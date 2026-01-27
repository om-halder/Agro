# AgroConnect 3-Tier Architecture Deployment Guide

Complete guide for deploying AgroConnect on Render with separated services: Frontend, Backend, and ML Model.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   AgroConnect 3-Tier Stack                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐                                       │
│  │ Frontend (React) │                                       │
│  │ Vercel/Netlify  │                                        │
│  └────────┬─────────┘                                       │
│           │                                                 │
│           │ API Calls                                       │
│           ▼                                                 │
│  ┌────────────────────────────┐                            │
│  │  Backend (Node.js/Express) │                            │
│  │  Render Web Service        │                            │
│  └────────┬───────────────────┘                            │
│           │                                                 │
│  ┌────────┴──────────────────────────┐                     │
│  │   REST API Calls (HTTP)           │                     │
│  ▼                                    ▼                     │
│  ┌─────────────────────┐  ┌──────────────────────┐        │
│  │  ML Model Service   │  │ Firebase/MongoDB     │        │
│  │  (Python/Flask)     │  │ Database             │        │
│  │  Render Web Service │  │ (External)           │        │
│  └─────────────────────┘  └──────────────────────┘        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Pre-Deployment Checklist

- [ ] GitHub account with AgroConnect repository
- [ ] Render account (free or paid)
- [ ] Firebase project set up with credentials
- [ ] MongoDB Atlas database (free or paid)
- [ ] ML model file (`crop_disease_model.h5`) ready
- [ ] Backend and Frontend code pushed to GitHub

## Deployment Steps

### Step 1: Prepare Repository Structure

The repository should have this structure:

```
AgroConnect/
├── Backend/                 # Node.js/Express API
│   ├── src/
│   ├── package.json
│   ├── .env.example
│   └── render.yaml
│
├── Frontend/                # React Vite app
│   ├── src/
│   ├── package.json
│   ├── .env.example
│   └── render.yaml
│
├── MLModel/                 # Python/Flask ML service
│   ├── src/
│   │   ├── app.py
│   │   └── crop_disease_model.h5
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   ├── render.yaml
│   └── README.md
│
└── README.md
```

### Step 2: Deploy ML Model on Render

#### 2.1 Push Model to Repository

1. **Add model file to repository:**
   ```bash
   # Copy your model to the MLModel folder
   cp path/to/crop_disease_model.h5 MLModel/src/
   
   # Commit and push
   git add MLModel/src/crop_disease_model.h5
   git commit -m "Add ML model"
   git push
   ```

   ⚠️ **Large File Warning:**
   - Model is ~90MB, may need Git LFS
   - Or store separately and configure in Render

2. **Configure Git LFS (if file > 100MB):**
   ```bash
   git lfs install
   git lfs track "*.h5"
   git add .gitattributes MLModel/src/crop_disease_model.h5
   git commit -m "Add Git LFS tracking"
   git push
   ```

#### 2.2 Create Render Service

1. Go to [render.com](https://render.com) → Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Fill in the form:
   - **Name:** `agroconnect-ml-model`
   - **Environment:** `Docker`
   - **Root Directory:** `MLModel`
   - **Dockerfile Path:** `./Dockerfile`
   - **Instance Type:** `Starter` (free) or `Standard` (paid)

5. **Environment Variables:**
   ```
   FLASK_ENV=production
   PORT=5000
   ```

6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)
8. **Note the service URL:** `https://agroconnect-ml-model.onrender.com`

**Verify ML Model:**
```bash
curl https://agroconnect-ml-model.onrender.com/health
curl https://agroconnect-ml-model.onrender.com/crops
```

### Step 3: Deploy Backend on Render

#### 3.1 Update Backend Environment Variables

1. **Update `.env`** in production or create Render environment variables
2. Key variables needed:

   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   FRONTEND_URL=https://your-frontend-domain.com
   ML_API_URL=https://agroconnect-ml-model.onrender.com
   OPENAI_API_KEY=your_openai_api_key
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_super_secret_key
   ```

#### 3.2 Create Render Service

1. Click **"New +"** → **"Web Service"**
2. Connect your repository
3. Fill in the form:
   - **Name:** `agroconnect-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** `Backend`
   - **Instance Type:** `Starter` (free) or higher

4. **Add Environment Variables:**
   - Paste all variables from `.env.example`
   - Fill in actual values

5. Click **"Create Web Service"**
6. Wait for deployment (3-5 minutes)
7. **Note the service URL:** `https://agroconnect-backend.onrender.com`

**Verify Backend:**
```bash
curl https://agroconnect-backend.onrender.com/health
```

### Step 4: Deploy Frontend on Render

#### 4.1 Update Frontend Environment Variables

Create/update Frontend `.env`:

```
VITE_API_URL=https://agroconnect-backend.onrender.com
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ML_API_URL=https://agroconnect-ml-model.onrender.com
```

#### 4.2 Create Render Service

1. Click **"New +"** → **"Web Service"** or **"Static Site"**
2. Connect your repository
3. For **Static Site**:
   - **Name:** `agroconnect-frontend`
   - **Build Command:** `cd Frontend && npm run build`
   - **Publish Directory:** `Frontend/dist`

4. For **Web Service** (with Node):
   - **Name:** `agroconnect-frontend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Root Directory:** `Frontend`

5. **Add Environment Variables:**
   - Paste all `VITE_*` variables

6. Click **"Create Web Service"**
7. Wait for deployment (3-5 minutes)
8. **Note the service URL:** `https://agroconnect-frontend.onrender.com`

## Post-Deployment Configuration

### 1. Update CORS Settings

**In Backend (src/server.js):**
```javascript
const allowedOrigins = [
  "https://agroconnect-frontend.onrender.com",
  "https://your-custom-domain.com", // if using custom domain
];
```

### 2. Configure Firebase CORS

In Firebase Console → Authentication:
```
Authorized JavaScript origins:
- https://agroconnect-frontend.onrender.com
- https://your-custom-domain.com

Authorized redirect URIs:
- https://agroconnect-frontend.onrender.com/__/auth/callback
- https://agroconnect-frontend.onrender.com/auth/callback
```

### 3. Test All Services

```bash
# Frontend
open https://agroconnect-frontend.onrender.com

# Backend Health
curl https://agroconnect-backend.onrender.com/health

# ML Model Health
curl https://agroconnect-ml-model.onrender.com/health

# Test ML Model
curl https://agroconnect-ml-model.onrender.com/crops
```

### 4. Monitor Services

- Go to Render Dashboard
- Check service status and logs
- Monitor resource usage

## Performance Optimization

### Backend Optimizations

✅ **Already Implemented:**
- Connection pooling for database
- Request timeouts for ML API calls
- Retry logic with exponential backoff
- Error handling and logging

### ML Model Optimizations

✅ **Already Implemented:**
- Model caching in memory
- Thread-safe predictions
- Health checks and monitoring
- Gunicorn with multiple workers
- Image size limits (5MB max)

### Frontend Optimizations

- Enable Gzip compression
- Minify and tree-shake dependencies
- Lazy load components
- Cache static assets

## Troubleshooting

### Cold Start Issues

**Problem:** First ML prediction takes 40-50 seconds
**Solution:** 
- This is normal for Render free tier (service goes to sleep)
- Upgrade to Starter or Standard plan for better performance
- Implement health check pings to keep service warm

### Memory Issues

**Problem:** ML Model service crashes with out of memory
**Solution:**
- Render free tier has 512MB RAM
- Model needs ~500MB + overhead
- Upgrade to Starter ($10/month) with more RAM

### Timeout Errors

**Problem:** Predictions timeout
**Solution:**
- Increase timeout in Backend modelService:
  - `INFERENCE_TIMEOUT = 60000` (60 seconds)
- Check ML Model logs for bottlenecks
- Verify network connectivity

### Model Not Loading

**Problem:** Model file not found
**Solution:**
- Verify `crop_disease_model.h5` exists in `MLModel/src/`
- Check Render deployment logs
- For large files, use Git LFS
- Consider hosting model on S3 and downloading at startup

### CORS Errors

**Problem:** Frontend can't call Backend
**Solution:**
- Update `FRONTEND_URL` in Backend environment
- Check Backend CORS configuration
- Verify origin headers in requests

## Cost Estimation (Monthly)

| Service | Plan | Cost |
|---------|------|------|
| ML Model | Starter | $7 |
| Backend | Starter | $7 |
| Frontend | Starter or Static | $0-7 |
| Firebase (free tier) | - | $0 |
| MongoDB (free tier) | - | $0 |
| **Total** | **Minimal** | **~$14-21** |

**Notes:**
- Free tier available but has sleep/limitations
- Starter tier ($7/month each) recommended for production
- Scale as needed

## Monitoring & Alerts

### Set Up Monitoring

1. **Render Built-in Monitoring:**
   - Check service metrics
   - Monitor logs
   - Track uptime

2. **Recommended External Tools:**
   - Sentry (error tracking)
   - LogRocket (frontend monitoring)
   - Datadog (comprehensive monitoring)

### Key Metrics to Watch

- **Response Time:** Should be < 500ms for normal operations
- **Error Rate:** Keep below 1%
- **ML Inference Time:** 150-250ms typically
- **Memory Usage:** Monitor for leaks
- **CPU Usage:** Should average < 50%

## Security Best Practices

✅ **Implemented:**
- Environment variables for secrets
- HTTPS/SSL on all services
- Input validation on all endpoints
- Rate limiting on critical endpoints
- Firebase authentication
- JWT tokens for API access

🔒 **Additional Recommendations:**
- Regular dependency updates
- Security headers in Backend
- DDOS protection (Cloudflare)
- Regular backups of data
- Incident response plan

## Maintenance Schedule

| Task | Frequency | Responsibility |
|------|-----------|-----------------|
| Dependency updates | Monthly | DevOps |
| Security audit | Quarterly | Security |
| Performance review | Monthly | DevOps |
| Database backup | Daily | Automated |
| Log review | Weekly | DevOps |

## Useful Commands

### Deploy Updates

```bash
# 1. Make changes
git add .
git commit -m "Update service"
git push origin main

# 2. Render automatically redeploys

# 3. Monitor deployment
# Go to Render Dashboard → Service → Logs
```

### Local Testing

```bash
# Backend
cd Backend
npm install
NODE_ENV=development node src/server.js

# ML Model
cd MLModel
pip install -r requirements.txt
python -m src.app

# Frontend
cd Frontend
npm install
npm run dev
```

### Debugging

```bash
# View Render logs
# Dashboard → Service → Logs

# SSH into service (paid plans)
# Dashboard → Service → SSH

# Check environment variables
# Dashboard → Service → Environment
```

## Support & Resources

- **Render Documentation:** https://render.com/docs
- **TensorFlow Serving:** https://www.tensorflow.org/serving
- **Express Documentation:** https://expressjs.com
- **React Documentation:** https://react.dev

## Next Steps

1. ✅ Review this guide completely
2. ✅ Prepare all required files and credentials
3. ✅ Deploy ML Model first
4. ✅ Deploy Backend second
5. ✅ Deploy Frontend third
6. ✅ Run post-deployment tests
7. ✅ Set up monitoring
8. ✅ Configure custom domain (optional)
9. ✅ Set up CI/CD pipeline (optional)

---

**Last Updated:** January 2026
**Version:** 1.0
