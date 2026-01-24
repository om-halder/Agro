# 🚀 ML Model Integration Setup Guide

This guide walks you through integrating your trained `.h5` model into the AgroConnect backend.

## Architecture Overview

```
Frontend (React)
    ↓
Node.js Backend (Express)
    ↓
Python Flask API (Model Service)
    ↓
.h5 Model (TensorFlow/Keras)
    ↓
OpenAI API (Analysis)
    ↓
Frontend (Analysis Page)
```

**Flow:**
1. User uploads crop image + selects crop name
2. Frontend sends to Node.js backend (`/api/crop/analyze`)
3. Node.js sends image to Python Flask API
4. Python Flask loads model and predicts disease
5. Node.js receives disease prediction
6. Node.js sends to OpenAI API with detected disease
7. Results displayed on analysis page

---

## Step 1: Set Up Python Environment

### Option A: Using Virtual Environment (Recommended)

```bash
# Navigate to Backend folder
cd Backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Option B: Using Conda

```bash
# Create conda environment
conda create -n agroconnect python=3.10

# Activate environment
conda activate agroconnect

# Install dependencies
pip install -r requirements.txt
```

---

## Step 2: Add Your .h5 Model File

1. **Locate your trained model:**
   - You should have a file like `crop_disease_model.h5`

2. **Copy it to the backend:**
   ```
   Backend/
   ├── src/
   ├── mlmodel/
   │   ├── app.py
   │   ├── predict.py
   │   └── crop_disease_model.h5  ← Place your model here
   └── ...
   ```

3. **Update `.env` file in Backend folder:**
   ```env
   # Existing variables
   OPENAI_API_KEY=your_openai_key
   MONGO_URI=your_mongodb_uri
   PORT=5000

   # Add these new variables
   MODEL_PATH=./src/mlmodel/crop_disease_model.h5
   PYTHON_API_URL=http://localhost:5001
   ```

---

## Step 3: Start the Python Flask API

### Terminal 1: Run Flask Server

```bash
# From Backend folder
# Make sure venv is activated!

cd src/mlmodel
python app.py
```

**Expected output:**
```
🚀 Starting Flask API...
📦 Model path: ./src/mlmodel/crop_disease_model.h5
🌾 Total classes: 51
🥕 Total crops: 24
 * Running on http://0.0.0.0:5001
```

### Test Flask API is working:

```bash
# In another terminal
curl http://localhost:5001/health

# Expected response:
# {"status":"ok","model_loaded":true}
```

---

## Step 4: Install Node Dependencies

### Terminal 2: Install Backend Dependencies

```bash
# From Backend folder
npm install
```

This will install `axios` and other required packages.

---

## Step 5: Update Environment Variables

Make sure your `.env` file in Backend folder has:

```env
# Database
MONGO_URI=mongodb+srv://your_user:your_pass@your_cluster.mongodb.net/agroconnect

# OpenAI
OPENAI_API_KEY=sk-proj-your_key_here

# Server
PORT=5000

# Python ML Model API
PYTHON_API_URL=http://localhost:5001
MODEL_PATH=./src/mlmodel/crop_disease_model.h5
```

---

## Step 6: Start Node.js Backend

### Terminal 3: Start Express Server

```bash
# From Backend folder
npm start
# or if you have a dev script:
npm run dev
```

**Expected output:**
```
OPENAI KEY: sk-proj-...
MongoDB connected
Server running on port 5000
```

---

## Step 7: Test the Complete Flow

### Using Postman or cURL:

```bash
# Prepare image file
# Replace 'path/to/image.jpg' with actual image

curl -X POST http://localhost:5000/api/crop/analyze \
  -F "image=@path/to/image.jpg" \
  -F "crop=Tomato"

# Expected response:
{
  "crop": "Tomato",
  "disease": "Early blight",
  "confidence": 87.45,
  "symptoms": [
    "Brown spots on lower leaves",
    "Concentric rings pattern"
  ],
  "treatment": [
    "Apply copper fungicide",
    "Remove affected leaves"
  ],
  "prevention": [
    "Improve air circulation",
    "Avoid overhead watering"
  ]
}
```

---

## Step 8: Frontend Integration

Update your frontend API call in [cropApi.js](../Frontend/src/services/cropApi.js):

```javascript
const API_BASE = "http://localhost:5000/api";

export const analyzeCrop = async (image, cropName) => {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("crop", cropName);

  const response = await fetch(`${API_BASE}/crop/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Analysis failed");
  return await response.json();
};
```

---

## 🔍 Available Endpoints

### Get Available Crops

```bash
GET http://localhost:5001/crops
```

**Response:**
```json
{
  "success": true,
  "crops": {
    "Tomato": ["Early blight", "Late blight", "healthy"],
    "Potato": ["Early blight", "Late blight", "healthy"],
    ...
  },
  "total_crops": 24,
  "total_classes": 51
}
```

### Health Check

```bash
GET http://localhost:5001/health
```

**Response:**
```json
{
  "status": "ok",
  "model_loaded": true
}
```

---

## 📊 File Structure

After setup:
```
Backend/
├── src/
│   ├── mlmodel/
│   │   ├── app.py                      (Flask API)
│   │   ├── predict.py                  (Original script)
│   │   └── crop_disease_model.h5       (Your trained model)
│   ├── services/
│   │   ├── modelService.js             (Calls Flask API)
│   │   ├── openaiVisionService.js      (Updated)
│   │   └── ...
│   ├── controllers/
│   │   └── cropController.js           (Updated)
│   ├── routes/
│   │   └── cropRoutes.js               (Updated)
│   └── server.js
├── .env
├── package.json
├── requirements.txt
└── ...
```

---

## 🛠️ Troubleshooting

### Issue: Model not loading
```
❌ Failed to load model: No such file or directory
```

**Solution:**
- Verify model path in `.env` is correct
- Check file exists at `Backend/src/mlmodel/crop_disease_model.h5`

### Issue: Flask API not responding
```
Error: connect ECONNREFUSED 127.0.0.1:5001
```

**Solution:**
- Make sure Flask is running in Terminal 1
- Check if port 5001 is available: `netstat -an | grep 5001`

### Issue: OpenAI API errors
```
429 Too Many Requests
```

**Solution:**
- Check API key is valid
- Wait a bit before retrying
- Check usage limits in OpenAI dashboard

### Issue: Python dependencies conflict
```
ERROR: pip's dependency resolver does not currently take into account all the packages that are installed
```

**Solution:**
```bash
pip install --upgrade pip
pip cache purge
pip install -r requirements.txt
```

---

## 📱 Testing with Frontend

1. Navigate to your Crop Analysis page
2. Upload a crop leaf image
3. Select crop name (e.g., "Tomato")
4. Click "Analyze"
5. See results with:
   - ✅ Disease detected by ML model
   - 📊 Confidence percentage
   - 🔬 Symptoms
   - 💊 Treatment recommendations
   - 🛡️ Prevention tips

---

## 🚀 Production Deployment

For production, consider:

1. **Use environment variables**
   - Store model path and API URLs in `.env`
   - Never hardcode paths

2. **Docker containers**
   - Containerize Flask and Express separately
   - Use docker-compose to run both

3. **Error handling**
   - Add retry logic for model predictions
   - Graceful fallback if model unavailable

4. **Performance**
   - Add model caching
   - Use image optimization
   - Implement rate limiting

5. **Security**
   - Validate image uploads
   - Sanitize inputs
   - Use CORS properly

---

## 📞 Support

If issues persist:
1. Check console logs in both terminals
2. Verify all `.env` variables
3. Ensure Python dependencies are installed
4. Test endpoints individually with Postman

---

**Happy farming! 🌾**
