import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
import numpy as np
import os
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

console = Console()

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

# Prototype paths
prototypes = {
    "good": "./Sample_Images/Bananas/Training_Images/good_banana.jpg",
    "risky": "./Sample_Images/Bananas/Training_Images/risky_banana.jpg",
    "expired": "./Sample_Images/Bananas/Training_Images/rotten_banana.jpg"
}

# Prototype embeddings
prototype_embeddings = {}
for label, path in prototypes.items():
    if not os.path.exists(path):
        raise FileNotFoundError(f"Prototype image for {label} not found at {path}")
    prototype_embeddings[label] = get_embedding(path)

# Cosine similarity function
def cosine_similarity(a, b):
    return np.dot(a, b.T)

# Test images
test_images = [
    "./Sample_Images/Bananas/TestingImages/bananaExpired.jpg",
    "./Sample_Images/Bananas/TestingImages/bananaGood.jpg",
    "./Sample_Images/Bananas/TestingImages/bananaRisky.jpg"
]

# Temperature parameter
temperature = 25.0

# Process each image and output fancy UI box
for test_img_path in test_images:
    if not os.path.exists(test_img_path):
        raise FileNotFoundError(f"Test image not found at {test_img_path}")

    test_embedding = get_embedding(test_img_path)

    similarities = {}
    for label, proto_emb in prototype_embeddings.items():
        sim = cosine_similarity(test_embedding, proto_emb)[0][0]
        similarities[label] = sim

    sim_values = np.array(list(similarities.values()))
    exp_sim = np.exp(temperature * (sim_values - np.max(sim_values)))
    probabilities = exp_sim / exp_sim.sum()

    results = dict(zip(similarities.keys(), probabilities))
    max_label = max(results, key=results.get)
    max_prob = results[max_label]

    # Create fancy table for results
    table = Table(title=f"🍌 Prediction for '{os.path.basename(test_img_path)}'", style="cyan")
    table.add_column("Category", style="bold magenta", justify="center")
    table.add_column("Probability (%)", style="bold green", justify="center")

    for label, prob in results.items():
        prob_percent = f"{prob * 100:.2f}%"
        table.add_row(label.capitalize(), prob_percent)

    confidence_msg = (f"[bold green]Confident prediction:[/bold green] {max_label.capitalize()} "
                      f"({max_prob * 100:.2f}%)") 

    # Display in fancy UI box
    panel = Panel.fit(table, title="🍌 Classification Results", border_style="blue", padding=(1,2))
    console.print(panel)
    console.print(Panel.fit(confidence_msg, border_style="green" if max_prob >= 0.80 else "yellow", padding=(1,2)))
