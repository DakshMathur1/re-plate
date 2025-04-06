import torch
import clip
from PIL import Image
import numpy as np

# Set device: use GPU if available; otherwise, fallback to CPU
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load CLIP model and its preprocessing pipeline
model, preprocess = clip.load("ViT-B/32", device=device)

# Define multiple text prompts for each category (prompt ensembling)
prompts = {
    "good (fresh)": [
        "a photo of fresh food that is vibrant, perfectly edible, and appetizing",
        "an image of high-quality produce that looks extremely fresh and delicious",
        "a clear photo of food that is safe to eat and looks perfect"
    ],
    "risky": [
        "a photo of food that shows slight imperfections or minor blemishes, but is still edible",
        "an image of food that looks a bit off with minor defects, raising some concerns",
        "a picture of food that is somewhat questionable but not clearly spoiled"
    ],
    "expired": [
        "a photo of food that is clearly rotten, moldy, and visibly spoiled",
        "an image of food that is discolored, decayed, and unsafe to eat",
        "a picture of food that is obviously expired, showing signs of rot and decay"
    ]
}

# Compute average text embeddings for each category
category_embeddings = {}
for category, text_list in prompts.items():
    # Tokenize each prompt
    text_inputs = clip.tokenize(text_list).to(device)  # shape: [num_prompts, tokens]
    with torch.no_grad():
        text_features = model.encode_text(text_inputs)  # shape: [num_prompts, embed_dim]
    # Normalize each embedding
    text_features /= text_features.norm(dim=-1, keepdim=True)
    # Average the embeddings to get a single representation per category
    avg_embedding = text_features.mean(dim=0, keepdim=True)
    avg_embedding /= avg_embedding.norm(dim=-1, keepdim=True)
    category_embeddings[category] = avg_embedding

# Load and preprocess the image (adjust the path as needed)
img_path = "./Sample_Images/good_banana.jpg"  # Change this to your image path
image_input = preprocess(Image.open(img_path)).unsqueeze(0).to(device)
with torch.no_grad():
    image_features = model.encode_image(image_input)
image_features /= image_features.norm(dim=-1, keepdim=True)

# Optionally, set a temperature scaling factor (higher = sharper distribution)
temperature = 10.0

# Compute cosine similarity between the image and each category's average embedding
similarity_scores = {}
for category, embed in category_embeddings.items():
    # Cosine similarity is in [-1, 1]; scale by temperature and compute softmax later
    sim = (image_features @ embed.T).item()  # scalar
    similarity_scores[category] = sim

# Convert similarities to probabilities using softmax with temperature scaling
sim_values = np.array(list(similarity_scores.values()))
exp_sim = np.exp(temperature * sim_values)
probabilities = exp_sim / exp_sim.sum()

print("CLIP Zero-Shot Classification Results (with prompt ensembling):")
for category, prob in zip(similarity_scores.keys(), probabilities):
    print(f"{category}: {prob * 100:.2f}%")
