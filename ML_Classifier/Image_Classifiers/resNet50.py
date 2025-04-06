import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing import image
import numpy as np

# Define class labels
class_labels = ["good", "risky", "expired"]

# Load ResNet50 without top layers and freeze it
base_model = tf.keras.applications.ResNet50(
    weights='imagenet', include_top=False, input_shape=(224, 224, 3)
)
base_model.trainable = False

# Build custom classification head
inputs = tf.keras.Input(shape=(224, 224, 3))
x = tf.keras.applications.resnet50.preprocess_input(inputs)
x = base_model(x, training=False)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dense(128, activation='relu')(x)
outputs = layers.Dense(3, activation='softmax')(x)
model = models.Model(inputs, outputs)

# Compile model (optional for inference; required for training)
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.summary()

# Function to load and preprocess image for ResNet50
def load_image_resnet(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    return tf.keras.applications.resnet50.preprocess_input(img_array)

# Use image file in the same directory
img_path = './Sample_Images/good_banana.jpg'  # Place fruit_image.jpg in the same directory as your script
img_processed = load_image_resnet(img_path)
predictions = model.predict(img_processed)[0]
pred_percentages = predictions * 100

print("ResNet50 Predictions:")
for label, percentage in zip(class_labels, pred_percentages):
    print(f"{label}: {percentage:.2f}%")
