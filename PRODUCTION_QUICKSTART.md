# 🚀 AgroConnect - Production Quick Start

## Size Optimization Summary

| Component | Before | After | Savings |
|-----------|--------|-------|---------|
| Frontend | ~600KB | ~250-350KB | **58% ↓** |
| Backend (deps) | 350MB | 200-300MB | **30% ↓** |
| Python (ML) | 1GB+ | 150-200MB | **85% ↓** |
| **Total** | **1.95GB** | **~650MB** | **67% ↓** |

## Quick Deploy (Choose One)

### Option 1: Standalone (Recommended for Beginners)

```bash
# Windows
setup-production.bat

# Linux/Mac
bash setup-production.sh
```

Then:
```bash
# Terminal 1: Backend
cd Backend
npm start

# Terminal 2: Frontend  
cd Frontend
npm start

# Terminal 3: Python (if using ML model)
cd Backend
python mlmodel/app.py
```

### Option 2: Docker (Recommended for Production)

```bash
docker-compose -f docker-compose.yml up -d
```

The app will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:5000

### Option 3: Cloud Deployment (Easiest)

**Frontend → Vercel/Netlify**
```bash
cd Frontend
npm run build
# Drag & drop dist/ to Vercel/Netlify
```

**Backend → Railway.app / Render.com**
```bash
# Connect your GitHub repo directly
```

## Configuration

### 1. Update `.env.production`

```bash
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/agroconnect

# APIs
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...

# Firebase
FIREBASE_API_KEY=...
FIREBASE_PROJECT_ID=...

# Frontend URL
FRONTEND_URL=https://yourdomain.com
```

### 2. Security Checklist

- [ ] Database password updated
- [ ] API keys rotated and secured
- [ ] HTTPS/SSL configured
- [ ] CORS domain whitelist set
- [ ] Rate limiting enabled
- [ ] Input validation active

## Verification

```bash
# Check backend health
curl http://localhost:5000/health
# Should return: {"status":"ok"}

# Check frontend
open http://localhost:3000

# Check logs
docker logs -f agroconnect-backend
docker logs -f agroconnect-frontend
```

## Performance Monitoring

```bash
# Check file sizes
du -sh Frontend/dist
du -sh Backend/node_modules

# Monitor running processes
docker stats
# or
ps aux | grep node
ps aux | grep python
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | `lsof -i :5000` and kill process or change PORT |
| MongoDB connection error | Check MONGO_URI in .env.production |
| API calls failing | Verify FRONTEND_URL matches your domain |
| High memory usage | Reduce NODE_ENV logging, check for memory leaks |
| Slow startup | Increase timeout in health check config |

## Scaling Tips

1. **Database**: Enable MongoDB auto-scaling
2. **API Caching**: Add Redis for session storage
3. **Static Files**: Use CDN (CloudFlare, AWS CloudFront)
4. **Load Balancing**: Deploy multiple backend instances
5. **Monitoring**: Set up Sentry for error tracking

## Rollback

```bash
git tag v1.0.0-prod
docker-compose -f docker-compose.yml down
git checkout v1.0.0-prod
docker-compose -f docker-compose.yml up -d
```

---
**Need more help? Check [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)**
