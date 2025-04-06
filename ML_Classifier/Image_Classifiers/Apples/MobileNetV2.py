import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
import numpy as np
import os

# Set image dimensions
IMG_SIZE = (224, 224)

# Load pre-trained MobileNetV2 as a feature extractor with global average pooling
feature_extractor = MobileNetV2(weights='imagenet', include_top=False, pooling='avg', input_shape=(224, 224, 3))

# Function to load an image, preprocess, and compute its embedding
def get_embedding(img_path):
    img = image.load_img(img_path, target_size=IMG_SIZE)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    embedding = feature_extractor.predict(img_array)
    embedding = embedding / np.linalg.norm(embedding)
    return embedding

# Define prototype image paths (adjust these paths as needed)
prototypes = {
    "good": "./Sample_Images/Apples/Training_Images/good_apple.jpg",
    "risky": "./Sample_Images/Apples/Training_Images/risky_apple.jpg",
    "expired": "./Sample_Images/Apples/Training_Images/rotten_apple.jpg"
}

# Compute embeddings for each prototype category
prototype_embeddings = {}
for label, path in prototypes.items():
    if not os.path.exists(path):
        raise FileNotFoundError(f"Prototype image for {label} not found at {path}")
    prototype_embeddings[label] = get_embedding(path)

# Function to compute cosine similarity between two embeddings
def cosine_similarity(a, b):
    return np.dot(a, b.T)

# Define three test images to process
test_images = [
    "./Sample_Images/Apples/TestingImages/appleExpired.jpg",
    "./Sample_Images/Apples/TestingImages/appleGood.jpg",
    "./Sample_Images/Apples/TestingImages/appleRisky.jpg"
]

# Sharpening temperature parameter
temperature = 25.0

# Process each test image separately
for test_img_path in test_images:
    if not os.path.exists(test_img_path):
        raise FileNotFoundError(f"Test image not found at {test_img_path}")
    
    test_embedding = get_embedding(test_img_path)
    
    similarities = {}
    for label, proto_emb in prototype_embeddings.items():
        sim = cosine_similarity(test_embedding, proto_emb)[0][0]
        similarities[label] = sim

    sim_values = np.array(list(similarities.values()))
    exp_sim = np.exp(temperature * sim_values)
    probabilities = exp_sim / exp_sim.sum()

    results = dict(zip(similarities.keys(), probabilities))

    print(f"\nPrototype-Based Classification Results for '{os.path.basename(test_img_path)}':")
    for label, prob in results.items():
        print(f"{label}: {prob * 100:.2f}%")

    max_label = max(results, key=results.get)
    max_prob = results[max_label]

    if max_prob >= 0.80:
        print(f"Confident prediction: {max_label} with {max_prob * 100:.2f}% confidence.")
    else:
        print("The prediction is not confident enough (less than 80%); consider reviewing the image or improving prototypes.")
