"""
ensemble_classifier.py

This script loads three backbone models (MobileNetV2, EfficientNetB0, ResNet50) and uses prototype images for three classes:
   - good (fresh)
   - risky
   - expired

For each backbone, we compute the normalized embeddings of the prototypes. At test time, for a given test image, each backbone computes
its cosine similarities to the prototypes, applies temperature scaling along with category-specific bias adjustments, and produces a probability
distribution over the classes. The final ensemble prediction is the average of the three models’ probability distributions.
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image

# ----------------------------
# Settings and Shared Parameters
# ----------------------------
IMG_SIZE = (224, 224)
TEMPERATURE = 25.0
CONFIDENCE_THRESHOLD = 0.80

# Define paths to prototype images (one per category)
PROTOTYPES = {
    "good": "./Sample_Images/Bananas/Training_Images/good_banana.jpg",
    "risky": "./Sample_Images/Bananas/Training_Images/risky_banana.jpg",
    "expired": "./Sample_Images/Bananas/Training_Images/rotten_banana.jpg"
}

# Define test image path (change as needed)
TEST_IMAGE_PATH = "./Sample_Images/Bananas/TestingImages/banana1.jpg"

# ----------------------------
# Utility Functions
# ----------------------------
def cosine_similarity(a, b):
    """Compute cosine similarity between two embeddings."""
    return np.dot(a, b.T)

def get_embedding(model, preprocess_fn, img_path):
    """Load an image, preprocess it with the given preprocess_fn, and compute its normalized embedding."""
    img = image.load_img(img_path, target_size=IMG_SIZE)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_fn(img_array)
    embedding = model.predict(img_array)
    embedding = embedding / np.linalg.norm(embedding)
    return embedding

# ----------------------------
# Define Backbone Models and Their Preprocessing Functions
# ----------------------------
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input as mob_preprocess
from tensorflow.keras.applications.efficientnet import EfficientNetB0, preprocess_input as eff_preprocess
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input as resnet_preprocess

backbones = {
    "mobilenet": {
        "model": MobileNetV2(weights='imagenet', include_top=False, pooling='avg', input_shape=(224,224,3)),
        "preprocess": mob_preprocess,
        # Bias adjustments for this backbone (if needed)
        "biases": {"good": 0.0, "risky": 0.15, "expired": 0.15}
    },
    "efficientnet": {
        "model": EfficientNetB0(weights='imagenet', include_top=False, pooling='avg', input_shape=(224,224,3)),
        "preprocess": eff_preprocess,
        "biases": {"good": 0.0, "risky": 0.15, "expired": 0.15}
    },
    "resnet": {
        "model": ResNet50(weights='imagenet', include_top=False, pooling='avg', input_shape=(224,224,3)),
        "preprocess": resnet_preprocess,
        # For ResNet, we boost expired a bit more and risky slightly more:
        "biases": {"good": 0.0, "risky": 0.20, "expired": 0.30}
    }
}

# ----------------------------
# Prototype Embedding Computation
# ----------------------------
# For each backbone, compute and store the prototype embeddings in a nested dictionary:
# { backbone_name: { category: embedding } }
prototype_embeddings = {}
for bk_name, bk_info in backbones.items():
    model_instance = bk_info["model"]
    preprocess_fn = bk_info["preprocess"]
    prototype_embeddings[bk_name] = {}
    for label, path in PROTOTYPES.items():
        if not os.path.exists(path):
            raise FileNotFoundError(f"Prototype image for '{label}' not found at {path}")
        emb = get_embedding(model_instance, preprocess_fn, path)
        prototype_embeddings[bk_name][label] = emb

# ----------------------------
# Single-Backbone Classification Function
# ----------------------------
def classify_with_backbone(bk_name, test_embedding, temperature, biases):
    """For a given backbone, compute cosine similarities and return probability distribution for each category."""
    sims = {}
    for label, proto_emb in prototype_embeddings[bk_name].items():
        sim = cosine_similarity(test_embedding, proto_emb)[0][0]
        # Add bias for this category if defined
        if label in biases:
            sim += biases[label]
        sims[label] = sim
    sims_values = np.array(list(sims.values()))
    exp_sims = np.exp(temperature * sims_values)
    probs = exp_sims / exp_sims.sum()
    return dict(zip(sims.keys(), probs))

# ----------------------------
# Ensemble Classification
# ----------------------------
def classify_image_ensemble(test_img_path, temperature=TEMPERATURE, confidence_threshold=CONFIDENCE_THRESHOLD):
    if not os.path.exists(test_img_path):
        raise FileNotFoundError(f"Test image not found at {test_img_path}")
    
    # Dictionary to store probability distributions for each backbone
    backbone_probs = {}
    for bk_name, bk_info in backbones.items():
        model_instance = bk_info["model"]
        preprocess_fn = bk_info["preprocess"]
        biases = bk_info["biases"]
        test_embedding = get_embedding(model_instance, preprocess_fn, test_img_path)
        probs = classify_with_backbone(bk_name, test_embedding, temperature, biases)
        backbone_probs[bk_name] = probs
    
    # Average the probabilities across all backbones for each category
    categories = list(PROTOTYPES.keys())
    avg_probs = {}
    for cat in categories:
        total = 0.0
        for bk in backbone_probs:
            total += backbone_probs[bk][cat]
        avg_probs[cat] = total / len(backbones)
    
    print("Ensemble Prototype-Based Classification Results:")
    for label, prob in avg_probs.items():
        print(f"{label}: {prob*100:.2f}%")
    
    # Determine highest probability category
    max_label = max(avg_probs, key=avg_probs.get)
    max_prob = avg_probs[max_label]
    if max_prob >= confidence_threshold:
        print(f"\nConfident prediction: {max_label} with {max_prob*100:.2f}% confidence.")
    else:
        print("\nEnsemble prediction is not confident enough (<80%).")
    
    return avg_probs

# ----------------------------
# Main
# ----------------------------
if __name__ == "__main__":
    final_results = classify_image_ensemble(TEST_IMAGE_PATH)
