import numpy as np

# Predictions from EfficientNetB0
efficientnet_predictions = {
    "appleExpired.jpg": {"good": 0.0000, "risky": 0.2558, "expired": 0.7442},
    "appleGood.jpg": {"good": 0.9718, "risky": 0.0282, "expired": 0.0000},
    "appleRisky.jpg": {"good": 0.0770, "risky": 0.9228, "expired": 0.0003}
}

# Predictions from MobileNetV2
mobilenet_predictions = {
    "appleExpired.jpg": {"good": 0.0016, "risky": 0.2704, "expired": 0.7280},
    "appleGood.jpg": {"good": 0.9617, "risky": 0.0367, "expired": 0.0016},
    "appleRisky.jpg": {"good": 0.1183, "risky": 0.6103, "expired": 0.2704}
}

# Predictions from ResNet50
resnet_predictions = {
    "appleExpired.jpg": {"good": 0.0005, "risky": 0.1500, "expired": 0.8495},
    "appleGood.jpg": {"good": 0.9800, "risky": 0.0200, "expired": 0.0000},
    "appleRisky.jpg": {"good": 0.1000, "risky": 0.8500, "expired": 0.0500}
}

# Calculate average predictions for each apple
average_results = {}

for apple_image in efficientnet_predictions.keys():
    avg_good = np.mean([
        efficientnet_predictions[apple_image]["good"],
        mobilenet_predictions[apple_image]["good"],
        resnet_predictions[apple_image]["good"]
    ])
    
    avg_risky = np.mean([
        efficientnet_predictions[apple_image]["risky"],
        mobilenet_predictions[apple_image]["risky"],
        resnet_predictions[apple_image]["risky"]
    ])
    
    avg_expired = np.mean([
        efficientnet_predictions[apple_image]["expired"],
        mobilenet_predictions[apple_image]["expired"],
        resnet_predictions[apple_image]["expired"]
    ])

    # Store averaged results clearly
    average_results[apple_image] = {
        "good": avg_good,
        "risky": avg_risky,
        "expired": avg_expired
    }

# Clearly print the averaged predictions
for apple_image, preds in average_results.items():
    print(f"\nAverage Predictions for '{apple_image}':")
    for label, prob in preds.items():
        print(f"{label}: {prob * 100:.2f}%")

    # Identify the highest predicted category
    max_label = max(preds, key=preds.get)
    max_prob = preds[max_label]

    if max_prob >= 0.80:
        print(f"✅ Confident average prediction: {max_label} ({max_prob * 100:.2f}%)")
