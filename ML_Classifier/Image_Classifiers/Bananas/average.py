import numpy as np

# Predictions from EfficientNetB0
efficientnet_predictions = {
    "bananaExpired.jpg": {"good": 0.0002, "risky": 0.7915, "expired": 0.2083},
    "bananaGood.jpg": {"good": 0.9912, "risky": 0.0087, "expired": 0.0000},
    "bananaRisky.jpg": {"good": 0.0011, "risky": 0.4540, "expired": 0.5449}
}

# Predictions from MobileNetV2
mobilenet_predictions = {
    "bananaExpired.jpg": {"good": 0.1464, "risky": 0.1030, "expired": 0.7506},
    "bananaGood.jpg": {"good": 0.9032, "risky": 0.0888, "expired": 0.0080},
    "bananaRisky.jpg": {"good": 0.1411, "risky": 0.4755, "expired": 0.3834}
}

# Predictions from ResNet50
resnet_predictions = {
    "bananaExpired.jpg": {"good": 0.0000, "risky": 0.2377, "expired": 0.7622},
    "bananaGood.jpg": {"good": 0.9683, "risky": 0.0297, "expired": 0.0020},
    "bananaRisky.jpg": {"good": 0.0000, "risky": 0.0640, "expired": 0.9360}
}

# Calculate average predictions for each apple
average_results = {}

for banana_image in efficientnet_predictions.keys():
    avg_good = np.mean([
        efficientnet_predictions[banana_image]["good"],
        mobilenet_predictions[banana_image]["good"],
        resnet_predictions[banana_image]["good"]
    ])
    
    avg_risky = np.mean([
        efficientnet_predictions[banana_image]["risky"],
        mobilenet_predictions[banana_image]["risky"],
        resnet_predictions[banana_image]["risky"]
    ])
    
    avg_expired = np.mean([
        efficientnet_predictions[banana_image]["expired"],
        mobilenet_predictions[banana_image]["expired"],
        resnet_predictions[banana_image]["expired"]
    ])

    # Store averaged results clearly
    average_results[banana_image] = {
        "good": avg_good,
        "risky": avg_risky,
        "expired": avg_expired
    }

# Clearly print the averaged predictions
for banana_image, preds in average_results.items():
    print(f"\nAverage Predictions for '{banana_image}':")
    for label, prob in preds.items():
        print(f"{label}: {prob * 100:.2f}%")

    # Identify the highest predicted category
    max_label = max(preds, key=preds.get)
    max_prob = preds[max_label]

    if max_prob >= 0.80:
        print(f"✅ Confident average prediction: {max_label} ({max_prob * 100:.2f}%)")
