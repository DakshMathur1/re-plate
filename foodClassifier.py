#!/usr/bin/env python

import sys
import os
from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv  # Import dotenv

# Load environment variables from .env file
load_dotenv()

# Configure the Gemini API key
# It will now first check the loaded .env variables, then system environment
try:
    api_key = os.getenv("GOOGLE_API_KEY") # Use os.getenv to avoid KeyError if not found
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found in .env file or environment variables.")
    genai.configure(api_key=api_key)
except ValueError as e:
    print(f"Error: {e}")
    print("Please ensure GOOGLE_API_KEY is set in your .env file or environment variables.")
    sys.exit(1)
except Exception as e: # Catch other potential configuration errors
    print(f"Error configuring Gemini API: {e}")
    sys.exit(1)

def main(image_path):
    # Try opening the image file.
    try:
        img = Image.open(image_path)
    except Exception as e:
        print(f"Error opening image: {e}")
        sys.exit(1)

    # Initialize the Gemini model
    # model = genai.GenerativeModel('gemini-pro-vision') # Deprecated model
    # model = genai.GenerativeModel('gemini-1.5-pro') # User changed to flash
    model = genai.GenerativeModel('gemini-2.0-flash') # Use the latest flash model

    # Define classification labels and the prompt for Gemini
    labels = ["safe for consumption", "needs immediate distribution", "waste"]
    # Updated prompt to ask for reasoning
    prompt = f"""
Analyze the food item in the image. Classify it into one of the following categories based on its visual appearance:
1.  **safe for consumption**: The food looks fresh and suitable for eating.
2.  **needs immediate distribution**: The food is slightly aged, bruised, or nearing spoilage but still edible. It should be distributed quickly.
3.  **waste**: The food shows clear signs of spoilage like mold, significant rot, or decay and is not suitable for consumption.

Respond with the category name and a brief explanation for your choice.
Use the following format:
Category: [one of '{labels[0]}', '{labels[1]}', or '{labels[2]}']
Reason: [Your brief explanation]
"""

    # Generate content using the image and prompt
    try:
        response = model.generate_content([prompt, img], stream=False)
        response.resolve() # Wait for the response to complete
        response_text = response.text.strip()

        # Parse the response to extract label and reason
        predicted_label = "Unknown"
        reason = "No reason provided."
        try:
            lines = response_text.split('\n')
            for line in lines:
                if line.lower().startswith("category:"):
                    predicted_label = line.split(":", 1)[1].strip()
                elif line.lower().startswith("reason:"):
                    reason = line.split(":", 1)[1].strip()
        except Exception as parse_error:
            print(f"Warning: Could not parse model response: {parse_error}")
            print(f"Raw model response:\n{response_text}")
            # Attempt basic extraction if parsing fails
            for l in labels:
                if l in response_text.lower():
                    predicted_label = l
                    break

        # Validate the extracted label
        if predicted_label not in labels and predicted_label != "Unknown":
            print(f"Warning: Model returned an unexpected label: '{predicted_label}'")
            # Simple fallback: check if any known label is in the raw text
            found_label = None
            for l in labels:
                if l in response_text.lower():
                    found_label = l
                    break
            if found_label:
                predicted_label = found_label
                print(f"Attempted to extract label: {predicted_label}")
            else:
                print("Could not reliably determine label from response.")
                # Keep predicted_label as the potentially incorrect one for context

        # Print the result with reason
        print(f"Predicted label: {predicted_label}")
        print(f"Reason: {reason}")

    except Exception as e:
        print(f"Error during Gemini API call: {e}")
        sys.exit(1)


if __name__ == "__main__":
    # Ensure dotenv is installed
    try:
        import dotenv
    except ImportError:
        print("Error: 'python-dotenv' library not found.")
        print("Please install it using: pip install python-dotenv")
        sys.exit(1)

    if len(sys.argv) < 2:
        # Updated usage message
        print("Usage: python foodClassifier.py <path_to_image>")
        sys.exit(1)

    # Ensure the google-generativeai library is installed
    try:
        import google.generativeai
    except ImportError:
        print("Error: 'google-generativeai' library not found.")
        print("Please install it using: pip install google-generativeai")
        sys.exit(1)

    main(sys.argv[1])
