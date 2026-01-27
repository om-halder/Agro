# AgroConnect Production Deployment - Quick Reference Card

Print this card for easy reference during deployment!

---

## 📋 DEPLOYMENT CHECKLIST - 3 Services

### Before Starting
- [ ] GitHub account with code pushed
- [ ] Render account created
- [ ] Firebase credentials ready
- [ ] MongoDB connection string ready
- [ ] Model file in `MLModel/src/crop_disease_model.h5`

### Service 1: ML Model (Python/Flask)
```
Name:              agroconnect-ml-model
Environment:       Docker
Root Directory:    MLModel
Dockerfile:        ./Dockerfile
Instance Type:     Starter (free) or Standard
Build Time:        5-10 minutes
Estimated Cost:    $7/month (Starter)
```
**After Deploy:** Note URL → `ML_API_URL`

### Service 2: Backend (Node.js/Express)
```
Name:              agroconnect-backend
Environment:       Node
Root Directory:    Backend
Build Command:     npm install
Start Command:     npm start
Instance Type:     Starter (free) or Standard
Build Time:        3-5 minutes
Estimated Cost:    $7/month (Starter)
```
**Before Deploy:** Update `ML_API_URL` environment variable

### Service 3: Frontend (React/Vite)
```
Name:              agroconnect-frontend
Build Command:     npm install && npm run build
Start Command:     npm start
Root Directory:    Frontend
Instance Type:     Starter (free)
Build Time:        3-5 minutes
Estimated Cost:    $7/month (Starter)
```
**Before Deploy:** Update `VITE_API_URL` environment variable

---

## 🔑 CRITICAL ENVIRONMENT VARIABLES

### MLModel Service
```
FLASK_ENV=production
PORT=5000
```

### Backend Service (MUST HAVE)
```
ML_API_URL=https://agroconnect-ml-model.onrender.com
FRONTEND_URL=https://agroconnect-frontend.onrender.com
MONGODB_URI=mongodb+srv://...
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

### Frontend Service (MUST HAVE)
```
VITE_API_URL=https://agroconnect-backend.onrender.com
VITE_ML_API_URL=https://agroconnect-ml-model.onrender.com
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
```

---

## ⚡ PERFORMANCE TARGETS

| Metric | Target | Notes |
|--------|--------|-------|
| Frontend Load | < 3s | Gzip enabled |
| Backend Response | < 1s | Warm requests |
| ML First Prediction | 40-60s | Cold start (Render wake up) |
| ML Warm Prediction | 150-250ms | Normal operation |
| Total E2E Time | < 2s | After initial load |

---

## 🧪 VERIFICATION TESTS

```bash
# 1. ML Model Health
curl https://agroconnect-ml-model.onrender.com/health

# 2. ML Available Crops
curl https://agroconnect-ml-model.onrender.com/crops

# 3. Backend Health
curl https://agroconnect-backend.onrender.com/health

# 4. Frontend Load (Browser)
https://agroconnect-frontend.onrender.com
```

---

## 🚨 EMERGENCY TROUBLESHOOTING

### Model Takes 40+ Seconds
**Issue:** Cold start on free tier
**Fix:** Normal behavior. Upgrade plan or use auto-ping.

### Timeout Error on First Prediction
**Issue:** ML service waking up
**Fix:** Normal. Expected 40-60s first time.

### Image Upload Fails
**Issue:** Backend can't reach ML
**Fix:** Check `ML_API_URL` in Backend env vars.

### Out of Memory
**Issue:** Free tier only 512MB
**Fix:** Upgrade to Starter ($7/month).

### CORS Error
**Issue:** Frontend domain not allowed
**Fix:** Update `FRONTEND_URL` in Backend.

---

## 📊 COST BREAKDOWN (Monthly)

| Service | Free Plan | Starter | Cost |
|---------|-----------|---------|------|
| ML Model | ❌ (sleeps) | ✅ | $7 |
| Backend | ❌ (sleeps) | ✅ | $7 |
| Frontend | ✅ Static | ✅ | $0-7 |
| **Total** | N/A | **Min** | **~$14** |

💡 Free tier works for testing but sleeps after 15 min inactivity.

---

## 📝 DEPLOYMENT SEQUENCE

```
Step 1: Deploy ML Model
         ↓
Wait 5-10 min → Get ML_API_URL
         ↓
Step 2: Deploy Backend (with ML_API_URL)
         ↓
Wait 3-5 min → Get Backend URL
         ↓
Step 3: Deploy Frontend (with Backend URL)
         ↓
Wait 3-5 min → Test
         ↓
✅ DONE
```

---

## 🔐 SECURITY CHECKLIST

- [ ] No API keys in code (use env vars)
- [ ] All connections HTTPS
- [ ] Firebase rules configured
- [ ] CORS origins restricted
- [ ] Input validation enabled
- [ ] Rate limiting on endpoints
- [ ] Secrets rotated

---

## 📂 NEW FILES CREATED

```
✅ MLModel/src/app.py              - Production Flask app
✅ MLModel/requirements.txt        - Python dependencies
✅ MLModel/Dockerfile              - Container config
✅ MLModel/render.yaml             - Render config
✅ MLModel/.env.example            - Env vars template
✅ MLModel/README.md               - ML guide
✅ Backend/.env.example (UPDATED)  - With ML_API_URL
✅ Frontend/.env.example (NEW)     - VITE_ variables
✅ 3-TIER-DEPLOYMENT-GUIDE.md      - Complete guide
✅ PRODUCTION-DEPLOYMENT-CHECKLIST.md - Step-by-step
✅ DEPLOYMENT-SUMMARY.md           - Summary
```

---

## 🎯 SUCCESS CRITERIA

✅ All services deployed and running
✅ All services report healthy status
✅ Frontend loads in browser
✅ User can login
✅ Can upload crop image
✅ ML prediction completes
✅ Results display correctly
✅ No console errors
✅ Performance acceptable

---

## 📞 QUICK LINKS

| Resource | URL |
|----------|-----|
| Render Dashboard | render.com/dashboard |
| Render Docs | render.com/docs |
| MLModel Guide | MLModel/README.md |
| Deployment Guide | 3-TIER-DEPLOYMENT-GUIDE.md |
| Checklist | PRODUCTION-DEPLOYMENT-CHECKLIST.md |

---

## ⏱️ ESTIMATED TOTAL TIME

- Preparation: 30 minutes
- ML Model Deploy: 10 minutes
- Backend Deploy: 5 minutes
- Frontend Deploy: 5 minutes
- Testing: 10 minutes
- **Total: ~60 minutes**

---

## 📌 REMEMBER

1. **Deploy ML Model FIRST** - Get the URL
2. **Add ML URL to Backend** - Before deploying
3. **Add Backend URL to Frontend** - Before deploying
4. **Test each service** - After deployment
5. **Monitor logs** - For errors

---

## 🆘 NEED HELP?

1. Check service logs (Render Dashboard)
2. Read `DEPLOYMENT-SUMMARY.md`
3. Follow `PRODUCTION-DEPLOYMENT-CHECKLIST.md`
4. Check `3-TIER-DEPLOYMENT-GUIDE.md`
5. Review `MLModel/README.md`

---

**Good Luck! 🚀**

*Last Updated: January 2026*
*Version: 1.0*
