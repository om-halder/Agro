"""
Production-Ready Flask API for Crop Disease Detection Model
Hosted on Render - Optimized for performance and reliability
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2
import os
import logging
import time
from collections import defaultdict
from PIL import Image
import io
from functools import lru_cache
import threading

# =============================
# LOGGING SETUP
# =============================
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# =============================
# APP INITIALIZATION
# =============================
app = Flask(__name__)
CORS(app)

# =============================
# CONFIGURATION
# =============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "crop_disease_model.h5")
IMG_SIZE = 224
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB max
REQUEST_TIMEOUT = 30

# =============================
# GLOBAL MODEL STATE
# =============================
model = None
model_loaded = False
model_lock = threading.Lock()

# =============================
# CLASS NAMES
# =============================
CLASS_NAMES = [
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
# BUILD CROP MAP
# =============================
CROP_MAP = defaultdict(list)
for cls in CLASS_NAMES:
    crop = cls.split("___")[0]
    CROP_MAP[crop].append(cls)

# =============================
# MODEL LOADING
# =============================
def load_model():
    """Load TensorFlow model with error handling"""
    global model, model_loaded
    
    with model_lock:
        try:
            if model is not None:
                logger.info("Model already loaded")
                return True
            
            if not os.path.exists(MODEL_PATH):
                logger.error(f"Model file not found: {MODEL_PATH}")
                return False
            
            logger.info(f"Loading model from {MODEL_PATH}...")
            start_time = time.time()
            
            # Suppress TF warnings
            tf.get_logger().setLevel('ERROR')
            model = tf.keras.models.load_model(MODEL_PATH)
            
            load_time = time.time() - start_time
            logger.info(f"✅ Model loaded successfully in {load_time:.2f}s")
            model_loaded = True
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to load model: {str(e)}")
            model_loaded = False
            return False

# =============================
# IMAGE PREPROCESSING
# =============================
def preprocess_image(image_bytes):
    """
    Preprocess image from bytes
    Returns: numpy array ready for prediction
    """
    try:
        # Read image from bytes
        img_array = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("Failed to decode image")
        
        # Convert BGR to RGB
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Resize to model input size
        img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
        
        # Normalize to 0-1
        img = img.astype(np.float32) / 255.0
        
        # Add batch dimension
        img = np.expand_dims(img, axis=0)
        
        return img
        
    except Exception as e:
        logger.error(f"Image preprocessing error: {str(e)}")
        raise

# =============================
# PREDICTION FUNCTION
# =============================
@lru_cache(maxsize=1)
def get_crops():
    """Get available crops list (cached)"""
    return list(CROP_MAP.keys())

def predict_disease(image_bytes, crop_name):
    """
    Predict disease with confidence scores
    """
    try:
        if not model_loaded:
            return {
                "success": False,
                "error": "Model not loaded"
            }
        
        # Preprocess image
        img = preprocess_image(image_bytes)
        
        # Get predictions
        with model_lock:
            predictions = model.predict(img, verbose=0)[0]
        
        # Filter predictions for selected crop
        crop_predictions = {}
        for i, class_name in enumerate(CLASS_NAMES):
            if class_name in CROP_MAP[crop_name]:
                crop_predictions[class_name] = float(predictions[i])
        
        # Get top 3 predictions
        sorted_preds = sorted(
            crop_predictions.items(),
            key=lambda x: x[1],
            reverse=True
        )[:3]
        
        top_disease = sorted_preds[0][0] if sorted_preds else "Unknown"
        confidence = sorted_preds[0][1] if sorted_preds else 0.0
        
        return {
            "success": True,
            "disease": top_disease,
            "confidence": float(confidence),
            "all_predictions": dict(sorted_preds),
            "crop": crop_name
        }
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

# =============================
# ROUTES
# =============================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": model_loaded,
        "timestamp": time.time()
    }), 200

@app.route('/crops', methods=['GET'])
def get_available_crops():
    """Get list of available crops"""
    try:
        crops = get_crops()
        return jsonify({
            "success": True,
            "crops": sorted(crops),
            "count": len(crops)
        }), 200
    except Exception as e:
        logger.error(f"Error getting crops: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/predict', methods=['POST'])
def predict():
    """
    Main prediction endpoint
    Expected: multipart form with 'image' and 'crop' fields
    """
    try:
        start_time = time.time()
        
        # Validate request
        if 'image' not in request.files:
            return jsonify({
                "success": False,
                "error": "Image file required"
            }), 400
        
        if 'crop' not in request.form:
            return jsonify({
                "success": False,
                "error": "Crop name required"
            }), 400
        
        image_file = request.files['image']
        crop_name = request.form.get('crop', '').strip()
        
        # Validate inputs
        if image_file.filename == '':
            return jsonify({
                "success": False,
                "error": "No file selected"
            }), 400
        
        if crop_name not in CROP_MAP:
            return jsonify({
                "success": False,
                "error": f"Invalid crop: {crop_name}",
                "available_crops": list(CROP_MAP.keys())
            }), 400
        
        # Check file size
        image_bytes = image_file.read()
        if len(image_bytes) > MAX_IMAGE_SIZE:
            return jsonify({
                "success": False,
                "error": "Image too large (max 5MB)"
            }), 413
        
        # Run prediction
        result = predict_disease(image_bytes, crop_name)
        
        inference_time = time.time() - start_time
        result["inference_time_ms"] = round(inference_time * 1000, 2)
        
        if result["success"]:
            return jsonify(result), 200
        else:
            return jsonify(result), 500
            
    except Exception as e:
        logger.error(f"Prediction endpoint error: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/info', methods=['GET'])
def model_info():
    """Get model information"""
    return jsonify({
        "model_name": "Crop Disease Detection Model",
        "version": "1.0",
        "input_size": IMG_SIZE,
        "total_classes": len(CLASS_NAMES),
        "crops_supported": len(CROP_MAP),
        "model_loaded": model_loaded
    }), 200

@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle file too large error"""
    return jsonify({
        "success": False,
        "error": "Request body too large"
    }), 413

@app.errorhandler(500)
def internal_error(error):
    """Handle internal server errors"""
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({
        "success": False,
        "error": "Internal server error"
    }), 500

# =============================
# STARTUP
# =============================
@app.before_request
def startup():
    """Initialize model on first request"""
    global model_loaded
    if not model_loaded:
        load_model()

if __name__ == '__main__':
    # Load model before starting server
    load_model()
    
    # Get port from environment or default to 5000
    port = int(os.getenv('PORT', 5000))
    
    # Run server
    app.run(
        host='0.0.0.0',
        port=port,
        debug=False,
        threaded=True
    )
