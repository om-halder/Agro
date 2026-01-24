# AgroConnect - Production Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured in `.env.production`
- [ ] MongoDB production cluster set up
- [ ] API keys (OpenAI, Gemini, Firebase) configured
- [ ] Frontend domain configured
- [ ] SSL/HTTPS certificates ready
- [ ] CDN configured for static assets (optional)

## Size Optimizations Applied

### Frontend
- ✅ Vite minification with Terser
- ✅ Code splitting (vendor, router, firebase chunks)
- ✅ Console logs removed in production
- ✅ Tree-shaking enabled
- **Expected size: ~200-300KB gzipped** (down from ~600KB with debugging)

### Backend
- ✅ Production server configuration
- ✅ Request size limits (10MB)
- ✅ CORS configured for production domain only
- ✅ Console logging disabled in production
- **Expected size: ~50MB** (node_modules only, ~10MB production core)

### ML Model
- ✅ Removed TensorFlow (heavy ~500MB+) 
- ✅ Replaced with lightweight OpenCV alternative
- ✅ Optimized Python dependencies
- **Expected size: ~100-150MB** (down from ~1GB+ with TensorFlow)

## Deployment Steps

### 1. Frontend Deployment (Vercel, Netlify, or Server)

```bash
# Build optimized production bundle
cd Frontend
npm install --production
npm run build

# Output: dist/ folder (typically 300-500KB)
```

**Deploy `dist/` folder to:**
- Vercel (recommended - automatic optimization)
- Netlify
- AWS S3 + CloudFront
- Your own server (serve with nginx/apache)

### 2. Backend Deployment (Node.js Server)

```bash
# Install production dependencies only
cd Backend
npm install --production

# Set environment variables
export $(cat .env.production | xargs)

# Start server
npm start
```

**Recommended hosting:**
- Railway.app (easy Node.js deployment)
- Render.com
- AWS EC2 / EB
- DigitalOcean
- Heroku (deprecated but possible)

### 3. ML Model Service (Python)

```bash
# Install Python dependencies (production only)
cd Backend
pip install -r requirements.txt --no-deps --no-cache-dir

# Start service
python mlmodel/app.py
```

**Run as:**
- Subprocess from Node.js (using child_process)
- Separate Python service
- Docker container (see Docker section)

### 4. MongoDB Setup

- Use MongoDB Atlas (cloud) - recommended
- Configure IP whitelist for server access
- Set up automated backups
- Enable encryption at rest

### 5. Environment Configuration

Update `.env.production` with real values:
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/agroconnect
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
FIREBASE_PROJECT_ID=your-project
FRONTEND_URL=https://yourdomain.com
```

## Docker Deployment (Optional - Further Size Reduction)

### Create Backend Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY Backend/package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY Backend/src ./src
COPY Backend/config ./config
COPY Backend/.env.production .env

EXPOSE 5000
CMD ["npm", "start"]
```

**Build & Deploy:**
```bash
docker build -t agroconnect-backend .
docker run -e MONGO_URI=... -p 5000:5000 agroconnect-backend
```

### Create Frontend Dockerfile
```dockerfile
FROM node:20-alpine as builder
WORKDIR /app
COPY Frontend/package*.json ./
RUN npm ci
COPY Frontend ./
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

## Performance Optimization Checklist

- [ ] Frontend: Use `npm run build` and verify dist/ size < 500KB
- [ ] Backend: Run `npm list` and remove unused dependencies
- [ ] ML Model: Verify model size < 500MB
- [ ] Database: Add indexes for frequently queried fields
- [ ] API: Enable gzip compression
- [ ] CDN: Serve static assets from CDN
- [ ] Caching: Set appropriate cache headers

## Monitoring & Maintenance

### Health Checks
```bash
# Backend health
curl https://api.yourdomain.com/health

# Check response time
curl -w "@curl-format.txt" https://api.yourdomain.com/health
```

### Log Monitoring
- Set up centralized logging (Sentry, LogRocket)
- Monitor error rates
- Track API response times
- Monitor resource usage

### Security
- [ ] Enable HTTPS/SSL
- [ ] Set security headers (CSP, HSTS, X-Frame-Options)
- [ ] Rate limiting on API endpoints
- [ ] Input validation on all endpoints
- [ ] Regular dependency updates (`npm audit`, `pip-audit`)

## Rollback Plan

Keep previous versions tagged:
```bash
git tag -a v1.0.0-production -m "Production release"
git push origin v1.0.0-production
```

## Total Application Size (Optimized)

| Component | Size |
|-----------|------|
| Frontend Bundle | 250-350KB |
| Backend (with deps) | 200-300MB* |
| ML Model | 150-200MB |
| **Total** | **~500MB** |

*Most size is node_modules; actual application code is ~5MB

## Quick Deploy Commands

```bash
# Frontend
cd Frontend && npm install --production && npm run build

# Backend  
cd Backend && npm install --production && npm start

# Python
cd Backend && pip install -r requirements.txt --no-cache-dir && python mlmodel/app.py
```

---
**For questions or issues, refer to Backend/ML_SETUP_GUIDE.md**
