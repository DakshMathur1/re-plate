import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
import numpy as np
import os

#test

# Set image dimensions
IMG_SIZE = (224, 224)

# Load pre-trained MobileNetV2 as a feature extractor with global average pooling
feature_extractor = MobileNetV2(weights='imagenet', include_top=False, pooling='avg', input_shape=(224, 224, 3))

# Function to load an image, preprocess, and compute its embedding
def get_embedding(img_path):
    img = image.load_img(img_path, target_size=IMG_SIZE)
    img_array = image.img_to_array(img)
    # Expand dims to have a batch of 1 and preprocess for MobileNetV2
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    # Get the embedding
    embedding = feature_extractor.predict(img_array)
    # Normalize the embedding to unit length
    embedding = embedding / np.linalg.norm(embedding)
    return embedding

# Define prototype image paths (adjust these paths as needed)
prototypes = {
    "good": "./Sample_Images/Bananas/Training_Images/good_banana.jpg",
    "risky": "./Sample_Images/Bananas/Training_Images/risky_banana.jpg",
    "expired": "./Sample_Images/Bananas/Training_Images/rotten_banana.jpg"
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

# Process a test image (for example, banana1)
test_img_path = "./Sample_Images/Bananas/TestingImages/banana3.jpg"  # Change to your test image path
if not os.path.exists(test_img_path):
    raise FileNotFoundError(f"Test image not found at {test_img_path}")
test_embedding = get_embedding(test_img_path)

# Compute cosine similarities with each prototype
similarities = {}
for label, proto_emb in prototype_embeddings.items():
    # cosine_similarity returns a 1x1 array; extract the scalar value
    sim = cosine_similarity(test_embedding, proto_emb)[0][0]
    similarities[label] = sim

# Sharpen the distribution using a higher temperature parameter
temperature = 25.0  # Increased temperature for a sharper softmax distribution
sim_values = np.array(list(similarities.values()))
exp_sim = np.exp(temperature * sim_values)
probabilities = exp_sim / exp_sim.sum()

# Map probabilities back to labels
results = dict(zip(similarities.keys(), probabilities))

print("Prototype-Based Classification Results:")
for label, prob in results.items():
    print(f"{label}: {prob * 100:.2f}%")

# Determine the best class and check if it meets the confidence threshold (e.g., 80%)
max_label = max(results, key=results.get)
max_prob = results[max_label]

if max_prob >= 0.80:
    print(f"\nConfident prediction: {max_label} with {max_prob * 100:.2f}% confidence.")
else:
    print("\nThe prediction is not confident enough (less than 80%); consider reviewing the image or improving prototypes.")
