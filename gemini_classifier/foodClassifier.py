#!/usr/bin/env python

import sys
import os
import base64
from typing import List, Optional, Union
from io import BytesIO
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv
from datetime import datetime, timedelta
import json

# Load environment variables from .env file
load_dotenv()

# Configure the Gemini API key
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in .env file or environment variables.")
genai.configure(api_key=api_key)

# Define the FastAPI app
app = FastAPI(
    title="Food Waste Classification API",
    description="API for classifying food images to reduce waste",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define response models
class ClassificationResponse(BaseModel):
    condition: str
    food_type: str 
    restrictions: List[str]
    reason: str
    item_name: str
    
# Define available inventory categories (adjust based on your actual inventory categories)
INVENTORY_CATEGORIES = [
    "Fruits & Vegetables",
    "Dairy & Eggs",
    "Meat & Poultry",
    "Seafood",
    "Bakery & Bread",
    "Frozen Foods",
    "Pantry Staples",
    "Snacks & Confectionery",
    "Beverages",
    "Prepared Foods"
]

# Mapping of potential dietary restrictions/tags
POTENTIAL_RESTRICTIONS = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
    "Soy-Free",
    "Halal",
    "Kosher",
    "Low Sugar",
    "Organic"
]

# Add new response model for best before analysis
class BestBeforeResponse(BaseModel):
    is_safe: bool
    safe_until: Union[str, None] = None
    explanation: str
    recommendation: str
    
# Add the best before guidelines as a constant
BEST_BEFORE_GUIDELINES = """
When packaged correctly and stored or frozen at the correct temperature, the following best before date timelines are generally true:

- Canned goods: Last up to one year past the best before date
- Dairy (and eggs): Lasts up to two weeks past the best before date
- Poultry pieces: Last up to six months in the freezer
- Meats (incl. beef, lamb, pork and whole poultry): Last up to one year in the freezer
- Dry cereals: Last up to one year past the best before date
- Packaged snacks (incl. popcorn, granola bars and bagged snacks): Last up to one year past the best before date
- Prepared and frozen meals: Last up to one year past the best before date in the freezer
- Unopened, shelf-stable condiments: Last up to one year past the best before date
- Unopened drinks (incl. juice or coconut water): Last up to one year past the best before date

Opened condiments safety guidelines:
- Opened ketchup in the fridge: Safe up to six months after the best before date
- Yellow mustard: Safe up to one year after the best before date
- Mayonnaise: Safe up to three months after the best before date
- Hot sauce: Safe up to three to five years when stored in the fridge (Sriracha only two years)

IMPORTANT NOTES:
- Dairy products and milk are NOT safe after their best before date has passed
- Always discard any food with visible mold, discoloration, bad odor, or unusual texture
- When in doubt, throw it out
"""

async def classify_image(image: Image.Image):
    """Classify a food image using Gemini API"""
    # Initialize the Gemini model
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    # Define classification labels 
    condition_labels = ["safe for consumption", "needs immediate distribution", "waste"]
    
    # Prompt for Gemini with both condition classification and food type - make food item identification more prominent
    prompt = f"""
Analyze the food item in the image and provide the following classifications:

1. SPECIFIC FOOD ITEM - VERY IMPORTANT: Identify the exact specific food item shown in the image.
   Be specific and name the exact food item you see (e.g., "Banana", "Apple", "Bread", "Milk", etc.).
   This is the most important part of your response.

2. FOOD CONDITION - Choose one of the following:
   - **safe for consumption**: The food looks fresh and suitable for eating.
   - **needs immediate distribution**: The food is slightly aged, bruised, or nearing spoilage but still edible. It should be distributed quickly.
   - **waste**: The food shows clear signs of spoilage like mold, significant rot, or decay and is not suitable for consumption.

3. FOOD TYPE - Classify into exactly one of these inventory categories:
   {', '.join([f'"{cat}"' for cat in INVENTORY_CATEGORIES])}

4. DIETARY RESTRICTIONS - List any applicable dietary restrictions from this list that apply to this food:
   {', '.join([f'"{r}"' for r in POTENTIAL_RESTRICTIONS])}
   Only include restrictions if you can definitively determine them from the image.
   If you cannot determine any restrictions, respond with "None identified".

Format your response EXACTLY as follows (this format is critical):
ItemName: [specific food item name]
Condition: [one of the food condition options]
FoodType: [one of the inventory categories]
Restrictions: [comma-separated list of applicable restrictions or "None identified"]
Reason: [Brief explanation of the condition classification ONLY - focus on signs of freshness or spoilage]

For the Reason field, ONLY explain why you classified the condition as you did. 
DO NOT describe what type of food it is in the reason.
"""

    try:
        # Generate content using the image and prompt
        response = model.generate_content([prompt, image], stream=False)
        response.resolve()
        response_text = response.text.strip()
        
        print(f"Raw Gemini response:\n{response_text}")  # Debug output
        
        # Parse the response
        item_name = "Unknown Item"
        condition = "Unknown"
        food_type = "Unknown"
        restrictions = ["None identified"]
        reason = "No reason provided."
        
        try:
            lines = response_text.split('\n')
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                    
                print(f"Processing line: {line}")  # Debug output
                
                if line.lower().startswith("itemname:"):
                    item_name = line.split(":", 1)[1].strip()
                    print(f"Found item name: {item_name}")  # Debug output
                elif line.lower().startswith("condition:"):
                    condition = line.split(":", 1)[1].strip()
                elif line.lower().startswith("foodtype:"):
                    food_type = line.split(":", 1)[1].strip()
                elif line.lower().startswith("restrictions:"):
                    restrictions_text = line.split(":", 1)[1].strip()
                    if "none" not in restrictions_text.lower():
                        restrictions = [r.strip() for r in restrictions_text.split(",")]
                elif line.lower().startswith("reason:"):
                    reason = line.split(":", 1)[1].strip()
                    
            # If no item name was found in the standard format, try to extract it from the response text
            if item_name == "Unknown Item":
                common_foods = ["banana", "apple", "orange", "tomato", "potato", "carrot", 
                                "bread", "milk", "cheese", "yogurt", "chicken", "beef",
                                "rice", "pasta", "cereal", "beans"]
                
                response_lower = response_text.lower()
                for food in common_foods:
                    if food in response_lower:
                        item_name = food.capitalize()
                        print(f"Extracted item name from text: {item_name}")  # Debug output
                        break
        except Exception as parse_error:
            print(f"Warning: Could not parse model response: {parse_error}")
            print(f"Raw model response:\n{response_text}")
            
        # Validate food type against inventory categories
        if food_type not in INVENTORY_CATEGORIES and food_type != "Unknown":
            # Find closest match
            for category in INVENTORY_CATEGORIES:
                if category.lower() in food_type.lower() or food_type.lower() in category.lower():
                    food_type = category
                    break
            
        # Validate condition against condition labels
        if condition not in condition_labels and condition != "Unknown":
            for label in condition_labels:
                if label in condition.lower():
                    condition = label
                    break
        
        # Ensure item_name is never empty
        if not item_name or item_name == "Unknown Item":
            # Try to derive from food_type
            if "Fruits" in food_type:
                item_name = "Fruit"
            elif "Vegetables" in food_type:
                item_name = "Vegetable"
            elif "Dairy" in food_type:
                item_name = "Dairy Product"
            elif "Meat" in food_type:
                item_name = "Meat Product"
            elif "Bakery" in food_type:
                item_name = "Baked Good"
            else:
                item_name = food_type
                
        # Prepare the final result
        result = {
            "condition": condition,
            "food_type": food_type,
            "restrictions": restrictions,
            "reason": reason,
            "item_name": item_name
        }
        
        print(f"Final classification result: {result}")  # Debug output
        return result
        
    except Exception as e:
        print(f"Error during Gemini API call: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/classify/", response_model=ClassificationResponse)
async def classify_food_image(file: UploadFile = File(...)):
    """
    Classify a food image to determine:
    - Condition (safe, needs immediate distribution, waste)
    - Food type category
    - Dietary restrictions
    - Reason for condition classification
    """
    try:
        # Read and validate the image
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file")
            
        try:
            img = Image.open(BytesIO(contents))
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")
            
        # Classify the image
        result = await classify_image(img)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.post("/classify-base64/", response_model=ClassificationResponse)
async def classify_food_image_base64(image_data: str = Form(...)):
    """
    Classify a food image provided as base64 string
    """
    try:
        # Decode base64 image
        try:
            # Remove data URL prefix if present
            if "base64," in image_data:
                image_data = image_data.split("base64,")[1]
                
            image_bytes = base64.b64decode(image_data)
            img = Image.open(BytesIO(image_bytes))
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid base64 image: {str(e)}")
            
        # Classify the image
        result = await classify_image(img)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.get("/categories")
def get_categories():
    """Get all available food categories and restriction tags"""
    return {
        "inventory_categories": INVENTORY_CATEGORIES,
        "restriction_tags": POTENTIAL_RESTRICTIONS
    }

# Add new function to analyze best before dates
async def analyze_best_before(food_type: str, best_before_date: str, item_name: str = None, is_opened: bool = False, storage_method: str = "refrigerated"):
    """Analyze whether food is safe to consume based on its best before date"""
    
    # Initialize the Gemini model
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    # Parse the best before date
    try:
        best_before = datetime.strptime(best_before_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Please use YYYY-MM-DD")
    
    # Get the current date
    current_date = datetime.now()
    
    # Calculate days elapsed since best before date
    days_elapsed = (current_date - best_before).days
    
    # Use item_name if provided, otherwise use food_type as a more generic descriptor
    food_descriptor = item_name if item_name else food_type
    
    # Prompt for Gemini to analyze the best before date
    prompt = f"""
Analyze if a food item is still safe to consume based on its best before date.

Food item details:
- Specific food item: {food_descriptor}
- General food type: {food_type}
- Best before date: {best_before_date}
- Current date: {current_date.strftime("%Y-%m-%d")}
- Days elapsed since best before date: {days_elapsed} days
- The item is {"opened" if is_opened else "unopened"}
- Storage method: {storage_method}

Guidelines on food safety after best before dates:
{BEST_BEFORE_GUIDELINES}

Based on the above information, determine:
1. Is the food still safe to consume? (true/false)
2. If safe, until what date would it remain safe? (YYYY-MM-DD or N/A)
3. A detailed explanation of why it is or isn't safe, specifically referring to this {food_descriptor} item
4. A specific recommendation on what to do with the {food_descriptor} (consume immediately, discard, etc.)

Format your response as a valid JSON object with the following structure:
{{
  "is_safe": boolean,
  "safe_until": "YYYY-MM-DD" or null,
  "explanation": "detailed explanation",
  "recommendation": "specific recommendation"
}}

Your JSON response MUST BE VALID and should contain ONLY the JSON object with no other text.
"""

    try:
        # Generate analysis using the prompt
        response = model.generate_content(prompt, stream=False)
        response.resolve()
        response_text = response.text.strip()
        
        print(f"Raw Gemini response for best before analysis:\n{response_text}")
        
        # Extract the JSON response - handle potential formatting issues
        try:
            # Try to parse the JSON directly
            result = json.loads(response_text)
        except json.JSONDecodeError:
            # If direct parsing fails, try to extract JSON from text
            json_pattern = r'({.*})'
            import re
            match = re.search(json_pattern, response_text, re.DOTALL)
            if match:
                try:
                    result = json.loads(match.group(1))
                except json.JSONDecodeError:
                    raise HTTPException(status_code=500, detail="Failed to parse JSON from AI response")
            else:
                raise HTTPException(status_code=500, detail="Failed to parse JSON from AI response")
        
        return result
    
    except Exception as e:
        print(f"Error during best before analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Error analyzing best before date: {str(e)}")

# Add new API endpoint for best before analysis
@app.post("/analyze-best-before/", response_model=BestBeforeResponse)
async def analyze_food_best_before(
    food_type: str = Form(...),
    best_before_date: str = Form(...), 
    item_name: str = Form(None),
    is_opened: bool = Form(False),
    storage_method: str = Form("refrigerated")
):
    """
    Analyze whether a food item is still safe to consume based on its best before date
    
    Parameters:
    - food_type: Type of food (e.g., Dairy, Canned goods)
    - item_name: Specific food item name for more precise analysis
    - best_before_date: The best before date in YYYY-MM-DD format
    - is_opened: Whether the package has been opened
    - storage_method: How the food is stored (refrigerated, frozen, room temperature)
    
    Returns:
    - BestBeforeResponse: Analysis of food safety
    """
    result = await analyze_best_before(
        food_type=food_type,
        best_before_date=best_before_date,
        item_name=item_name,
        is_opened=is_opened,
        storage_method=storage_method
    )
    
    return result

# Add a new combined response model
class CombinedAnalysisResponse(BaseModel):
    condition: str
    food_type: str
    restrictions: List[str]
    reason: str
    item_name: str
    is_safe: bool
    safe_until: Union[str, None] = None
    safety_explanation: str
    recommendation: str

# Add new endpoint for combined analysis
@app.post("/combined-analysis/", response_model=CombinedAnalysisResponse)
async def combined_food_analysis(
    file: UploadFile = File(None),
    image_data: str = Form(None),
    food_type: str = Form(None),
    best_before_date: str = Form(None),
    item_name: str = Form(None),
    is_opened: bool = Form(False),
    storage_method: str = Form("refrigerated")
):
    """
    Perform both image classification and best-before date analysis, with the best-before analysis
    overriding the condition if the food is deemed unsafe.
    """
    # First, classify the image
    classification_result = None
    
    try:
        if file:
            # Process uploaded file
            contents = await file.read()
            if contents:
                img = Image.open(BytesIO(contents))
                classification_result = await classify_image(img)
        elif image_data and "data:" in image_data:
            # Process base64 image
            if "base64," in image_data:
                image_data = image_data.split("base64,")[1]
                
            image_bytes = base64.b64decode(image_data)
            img = Image.open(BytesIO(image_bytes))
            classification_result = await classify_image(img)
    except Exception as e:
        print(f"Warning: Unable to process image: {e}")
    
    # If we couldn't get classification or food_type wasn't in the result, use the provided one
    if classification_result is None:
        if food_type is None:
            raise HTTPException(status_code=400, detail="Either an image or food_type must be provided")
        
        # Create a minimal classification result
        classification_result = {
            "condition": "safe for consumption",  # Default condition
            "food_type": food_type,
            "restrictions": ["None identified"],
            "reason": "No image analysis performed",
            "item_name": item_name or food_type
        }
    
    # Use the detected food type and item name if not provided
    if food_type is None:
        food_type = classification_result["food_type"]
    
    if item_name is None:
        item_name = classification_result["item_name"]
    
    # Now, analyze best before date if provided
    safety_result = None
    if best_before_date:
        try:
            safety_result = await analyze_best_before(
                food_type=food_type,
                best_before_date=best_before_date,
                item_name=item_name,
                is_opened=is_opened,
                storage_method=storage_method
            )
        except Exception as e:
            # Log the error but continue with just the classification
            print(f"Error during best before analysis: {e}")
    
    # Combine the results, with safety overriding classification if unsafe
    final_condition = classification_result["condition"]
    
    # If safety analysis indicates the item is not safe, override the condition to "waste"
    if safety_result and not safety_result["is_safe"]:
        final_condition = "waste"
        print(f"Overriding condition to 'waste' based on safety analysis")
    
    # Prepare the combined response
    result = {
        "condition": final_condition,
        "food_type": classification_result["food_type"],
        "restrictions": classification_result["restrictions"],
        "reason": classification_result["reason"],
        "item_name": classification_result["item_name"],
        "is_safe": safety_result["is_safe"] if safety_result else True,
        "safe_until": safety_result["safe_until"] if safety_result else None,
        "safety_explanation": safety_result["explanation"] if safety_result else "No safety analysis performed",
        "recommendation": safety_result["recommendation"] if safety_result else "No recommendation available"
    }
    
    print(f"Combined analysis result: {result}")
    return result

# For running the app directly
if __name__ == "__main__":
    # Make sure required libraries are installed before running
    missing_libs = []
    try:
        import fastapi
    except ImportError:
        missing_libs.append("fastapi")
    
    try:
        import python_multipart
    except ImportError:
        missing_libs.append("python-multipart")
        
    try:
        import uvicorn
    except ImportError:
        missing_libs.append("uvicorn")
    
    if missing_libs:
        print(f"Error: Missing required libraries: {', '.join(missing_libs)}")
        print("Please install them using: pip install " + " ".join(missing_libs))
        sys.exit(1)
    
    print("Starting Food Classification API server...")
    uvicorn.run("foodClassifier:app", host="0.0.0.0", port=8000, reload=True) 