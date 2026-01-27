# AgroConnect ML Model Service

Production-ready crop disease detection model hosted on Render.

## Features

- 🚀 **Production Optimized**: Built with Gunicorn, health checks, and error handling
- ⚡ **Fast Inference**: Optimized image preprocessing and caching
- 🔄 **Stateless**: Horizontally scalable deployment
- 📊 **50+ Crop Classes**: Supports Apple, Corn, Grape, Potato, Tomato, and more
- 🛡️ **Security**: Non-root user, input validation, size limits

## Deployment on Render

### Prerequisites

1. Fork/clone the AgroConnect repository
2. TensorFlow model file (`crop_disease_model.h5`) - **Must be added to the MLModel folder**
3. Render account (free or paid)

### Step-by-Step Deployment

1. **Prepare the Model File**
   - Download/obtain your `crop_disease_model.h5`
   - Place it in `MLModel/src/crop_disease_model.h5`

2. **Create Render Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Fill in the details:
     - **Name**: `agroconnect-ml-model`
     - **Root Directory**: `MLModel`
     - **Build Command**: Leave empty (uses Dockerfile)
     - **Start Command**: Leave empty (uses Dockerfile)
     - **Instance Type**: Starter (free) or Standard (paid)

3. **Set Environment Variables**
   ```
   FLASK_ENV=production
   PORT=5000
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete (~5-10 minutes)
   - Note the service URL (e.g., `https://agroconnect-ml-model.onrender.com`)

## API Endpoints

### Health Check
```bash
GET /health
```
Response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "timestamp": 1704067200.5
}
```

### Get Available Crops
```bash
GET /crops
```
Response:
```json
{
  "success": true,
  "crops": ["Apple", "Corn", "Grape", "Potato", "Tomato", ...],
  "count": 38
}
```

### Predict Disease
```bash
POST /predict
Content-Type: multipart/form-data

- image: [binary file]
- crop: [crop name]
```
Response:
```json
{
  "success": true,
  "disease": "Tomato___Late_blight",
  "confidence": 0.95,
  "all_predictions": {
    "Tomato___Late_blight": 0.95,
    "Tomato___Early_blight": 0.04,
    "Tomato___healthy": 0.01
  },
  "crop": "Tomato",
  "inference_time_ms": 145.32
}
```

### Model Info
```bash
GET /info
```
Response:
```json
{
  "model_name": "Crop Disease Detection Model",
  "version": "1.0",
  "input_size": 224,
  "total_classes": 50,
  "crops_supported": 14,
  "model_loaded": true
}
```

## Supported Crops & Diseases

### Apple (4 classes)
- Apple scab
- Black rot
- Cedar apple rust
- Healthy

### Tomato (10 classes)
- Bacterial spot
- Early blight
- Late blight
- Leaf mold
- Septoria leaf spot
- Spider mites
- Target spot
- Tomato mosaic virus
- Yellow leaf curl virus
- Healthy

### And many more...
Corn, Grape, Peach, Pepper, Potato, Squash, Strawberry, Blueberry, Raspberry, Soybean, Orange, Cherry

## Performance Metrics

- **Cold Start**: ~40-50 seconds (initial model load on Render free tier)
- **Warm Start**: ~150-250ms per inference
- **Model Size**: ~90MB
- **Max Request Size**: 5MB
- **Timeout**: 30 seconds per request

## Local Development

### Setup

```bash
cd MLModel

# Create virtual environment
python -m venv venv

# Activate venv
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Run Locally

```bash
python -m src.app
```

Server runs on `http://localhost:5000`

### Test Locally

```bash
# Check health
curl http://localhost:5000/health

# Get available crops
curl http://localhost:5000/crops

# Predict (requires image file)
curl -X POST -F "image=@path/to/image.jpg" -F "crop=Tomato" \
  http://localhost:5000/predict
```

## Backend Integration

The Backend service calls this ML Model API using:

```javascript
// In Backend/src/services/modelService.js
const ML_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5001';

// Example:
const response = await axios.post(`${ML_API_URL}/predict`, formData);
```

Update Backend's `.env` with:
```
PYTHON_API_URL=https://agroconnect-ml-model.onrender.com
```

## Troubleshooting

### Model Not Loading
- Check if `crop_disease_model.h5` exists in `MLModel/src/`
- File should be ~90MB
- Check Render logs for errors

### Slow First Request
- Render free tier goes to sleep after 15 minutes of inactivity
- First request after wake-up takes 40-50 seconds
- Subsequent requests are fast

### Timeout Errors
- Increase timeout in Backend to 60+ seconds for first predictions
- Model inference typically takes 150-250ms

### Out of Memory
- If using free tier, may need to upgrade to Starter/Standard
- Free tier has 512MB RAM

## Production Best Practices

✅ **Implemented**
- Health checks for monitoring
- Input validation (file size, crop name)
- Error handling and logging
- Non-root user execution
- Gunicorn for production WSGI
- Thread-safe model loading

✅ **For Production Scale-Up**
- Use paid Render plans with autoscaling
- Set up monitoring and alerting
- Implement request queuing if needed
- Cache frequent predictions (optional)

## Environment Variables

See `.env.example` for all available variables.

Key variables:
- `PORT`: Server port (default: 5000)
- `FLASK_ENV`: `production` or `development`
- `LOG_LEVEL`: Logging level (default: INFO)

## License

Same as AgroConnect main project
