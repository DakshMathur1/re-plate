import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.efficientnet import EfficientNetB0, preprocess_input
import numpy as np
import os

# --- Prototype "Training" Phase using EfficientNetB0 ---

# Set image dimensions
IMG_SIZE = (224, 224)

# Load pre-trained EfficientNetB0 as a feature extractor with global average pooling
feature_extractor = EfficientNetB0(weights='imagenet', include_top=False, pooling='avg', input_shape=(224, 224, 3))

# Function to load an image, preprocess it, and compute its embedding
def get_embedding(img_path):
    img = image.load_img(img_path, target_size=IMG_SIZE)
    img_array = image.img_to_array(img)
    # Expand dims to create a batch of one and preprocess the image for EfficientNetB0
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    # Compute the embedding
    embedding = feature_extractor.predict(img_array)
    # Normalize the embedding to unit length
    embedding = embedding / np.linalg.norm(embedding)
    return embedding

# Define prototype image paths for each category (one image per category)
prototypes = {
    "good": "./Sample_Images/Bananas/Training_Images/good_banana.jpg",
    "risky": "./Sample_Images/Bananas/Training_Images/risky_banana.jpg",
    "expired": "./Sample_Images/Bananas/Training_Images/rotten_banana.jpg"
}

# Compute and store the prototype embeddings
prototype_embeddings = {}
for label, path in prototypes.items():
    if not os.path.exists(path):
        raise FileNotFoundError(f"Prototype image for '{label}' not found at {path}")
    prototype_embeddings[label] = get_embedding(path)

# --- Testing Phase ---

# Function to compute cosine similarity between two embeddings
def cosine_similarity(a, b):
    return np.dot(a, b.T)

# Function to classify a test image using the prototype-based method with bias adjustments
def classify_image(test_img_path, temperature=25.0, confidence_threshold=0.80, risky_bias=0.15, expired_bias=0.15):
    if not os.path.exists(test_img_path):
        raise FileNotFoundError(f"Test image not found at {test_img_path}")
    test_embedding = get_embedding(test_img_path)
    
    # Compute cosine similarities with each prototype
    similarities = {}
    for label, proto_emb in prototype_embeddings.items():
        # cosine_similarity returns a 1x1 array; extract the scalar value
        sim = cosine_similarity(test_embedding, proto_emb)[0][0]
        # Apply category-specific bias adjustments:
        if label == "risky":
            sim += risky_bias
        elif label == "expired":
            sim += expired_bias
        similarities[label] = sim

    # Apply temperature scaling to sharpen the softmax distribution
    sim_values = np.array(list(similarities.values()))
    exp_sim = np.exp(temperature * sim_values)
    probabilities = exp_sim / exp_sim.sum()
    results = dict(zip(similarities.keys(), probabilities))

    print("Prototype-Based Classification Results (EfficientNetB0):")
    for label, prob in results.items():
        print(f"{label}: {prob * 100:.2f}%")
    
    # Determine if the prediction is confident
    max_label = max(results, key=results.get)
    max_prob = results[max_label]
    if max_prob >= confidence_threshold:
        print(f"\nConfident prediction: {max_label} with {max_prob * 100:.2f}% confidence.")
    else:
        print("\nPrediction is not confident enough; consider reviewing the image or improving prototypes.")
    
    return results

# --- Example Usage ---
# Change the path below to your test image (e.g., a banana from your testing set)
test_image_path1 = "./Sample_Images/Bananas/TestingImages/bananaRisky.jpg"
classify_image(test_image_path1)
