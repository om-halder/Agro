import tensorflow as tf
import numpy as np
import cv2
from collections import defaultdict

# =============================
# LOAD MODEL
# =============================
model = tf.keras.models.load_model("/content/drive/MyDrive/crop_disease_model.h5")

IMG_SIZE = 224

# =============================
# CLASS NAMES (HARDCODED)
# =============================
class_names = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___healthy",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___healthy",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Pepper__bell___Bacterial_spot",
    "Pepper__bell___healthy",
    "Potato___Early_blight",
    "Potato___healthy",
    "Potato___Late_blight",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___healthy",
    "Strawberry___Leaf_scorch",
    "Tomato_Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_healthy",
    "Tomato_Late_blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite",
    "Tomato__Target_Spot",
    "Tomato__Tomato_mosaic_virus",
    "Tomato__Tomato_YellowLeaf__Curl_Virus",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___healthy",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus"
]


# =============================
# BUILD CROP → DISEASE MAP
# =============================
crop_map = defaultdict(list)

for cls in class_names:
    crop = cls.split("___")[0]
    crop_map[crop].append(cls)

# =============================
# IMAGE PREPROCESSING
# =============================
def preprocess_image(img_path):
    img = cv2.imread(img_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img

# =============================
# PREDICT WITH CROP FILTER
# =============================
def predict_disease(img_path, selected_crop):
    img = preprocess_image(img_path)
    preds = model.predict(img)[0]

    filtered_preds = {
        class_names[i]: preds[i]
        for i in range(len(class_names))
        if class_names[i] in crop_map[selected_crop]
    }

    disease = max(filtered_preds, key=filtered_preds.get)
    confidence = filtered_preds[disease] * 100

    return disease, confidence

# =============================
# TEST
# =============================
disease, conf = predict_disease("/content/drive/MyDrive/test.jpg", "Apple")

print("🌿 Disease:", disease)
print(f"✅ Confidence: {conf:.2f}%")