import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing import image
import numpy as np

# Define class labels
class_labels = ["good", "risky", "expired"]

# Load EfficientNetB0 without top layers and freeze it
base_model = tf.keras.applications.EfficientNetB0(
    weights='imagenet', include_top=False, input_shape=(224, 224, 3)
)
base_model.trainable = False

# Build custom classification head
inputs = tf.keras.Input(shape=(224, 224, 3))
x = tf.keras.applications.efficientnet.preprocess_input(inputs)
x = base_model(x, training=False)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dense(128, activation='relu')(x)
outputs = layers.Dense(3, activation='softmax')(x)
model = models.Model(inputs, outputs)

# Compile model (optional for inference; required for training)
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.summary()

# Function to load and preprocess image for EfficientNet
def load_image_efficientnet(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    return tf.keras.applications.efficientnet.preprocess_input(img_array)

# Use an image file located one folder behind the current script directory
img_path = './Sample_Images/apple.jpg'  # Adjust path as per your folder structure

img_processed = load_image_efficientnet(img_path)
predictions = model.predict(img_processed)[0]  # Shape (3,)
pred_percentages = predictions * 100

print("EfficientNetB0 Predictions:")
for label, percentage in zip(class_labels, pred_percentages):
    print(f"{label}: {percentage:.2f}%")
