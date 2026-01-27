# Production Deployment Checklist

Use this checklist before and after deploying to Render.

## Pre-Deployment (Local Testing)

### Code Quality
- [ ] All dependencies are installed
- [ ] No console.error/warnings in production code
- [ ] Environment variables are properly configured
- [ ] No hardcoded API keys or secrets
- [ ] Code is committed and pushed to GitHub

### Testing
- [ ] Backend health check passes: `npm run dev`
- [ ] Frontend builds successfully: `npm run build`
- [ ] ML Model runs locally: `python -m src.app`
- [ ] Test API endpoints locally
- [ ] Test image upload and prediction
- [ ] Test authentication flow

### ML Model
- [ ] Model file exists: `MLModel/src/crop_disease_model.h5`
- [ ] Model size appropriate (~90MB)
- [ ] Model loads without errors
- [ ] Test prediction endpoint

### Environment Variables
- [ ] All required variables in `.env`
- [ ] No typos in variable names
- [ ] URLs use HTTPS (except localhost)
- [ ] Secrets are strong and unique

### Database
- [ ] MongoDB connection string valid
- [ ] Firebase credentials obtained
- [ ] Firebase rules configured
- [ ] Database backups enabled

### GitHub
- [ ] All changes committed
- [ ] Branch protection enabled
- [ ] Collaborators added
- [ ] `.gitignore` excludes secrets

## Deployment Order

### 1️⃣ Deploy ML Model (Python/Flask)

**On Render.com:**
```
Service Name: agroconnect-ml-model
Environment: Docker
Root Directory: MLModel
Instance Type: Starter (free) or Standard ($10/month)
```

**Verify:**
```bash
curl https://agroconnect-ml-model.onrender.com/health
curl https://agroconnect-ml-model.onrender.com/crops
```

**Save the URL:** `https://agroconnect-ml-model.onrender.com`

### 2️⃣ Deploy Backend (Node.js/Express)

**Update environment variables:**
```
ML_API_URL=https://agroconnect-ml-model.onrender.com
FRONTEND_URL=https://agroconnect-frontend.onrender.com
```

**On Render.com:**
```
Service Name: agroconnect-backend
Environment: Node
Root Directory: Backend
Build Command: npm install
Start Command: npm start
Instance Type: Starter (free) or Standard ($10/month)
```

**Verify:**
```bash
curl https://agroconnect-backend.onrender.com/health
```

**Save the URL:** `https://agroconnect-backend.onrender.com`

### 3️⃣ Deploy Frontend (React/Vite)

**Update environment variables:**
```
VITE_API_URL=https://agroconnect-backend.onrender.com
VITE_ML_API_URL=https://agroconnect-ml-model.onrender.com
```

**On Render.com:**
```
Service Name: agroconnect-frontend
Build Command: npm install && npm run build
Start Command: npm start
Root Directory: Frontend
Instance Type: Starter (free) or Static (free)
```

**Verify:**
```bash
# Open in browser
https://agroconnect-frontend.onrender.com
```

## Post-Deployment Testing

### Smoke Tests (5 minutes)

- [ ] Frontend loads without errors
- [ ] Backend health check responds
- [ ] ML Model health check responds
- [ ] Can login to Frontend
- [ ] Network tab shows no 5xx errors

### Functional Tests (15 minutes)

- [ ] User registration works
- [ ] User login works
- [ ] Upload crop image
- [ ] ML prediction completes
- [ ] Results display correctly
- [ ] User profile updates

### Performance Tests (10 minutes)

- [ ] Frontend loads in < 3 seconds
- [ ] API response time < 1 second (warm)
- [ ] ML prediction completes in < 5 seconds (after initial load)
- [ ] No memory leaks (check DevTools)
- [ ] Images load correctly

### Integration Tests (15 minutes)

- [ ] End-to-end crop analysis flow
- [ ] Test with different image sizes
- [ ] Test with different crops
- [ ] Test error handling (invalid image, etc.)
- [ ] Test with slow network (DevTools throttling)

## Monitoring Setup

### Daily Checks
- [ ] All services running (green status)
- [ ] No error spikes in logs
- [ ] Performance metrics normal
- [ ] Uptime > 99%

### Weekly Checks
- [ ] Review error logs
- [ ] Check resource usage
- [ ] Update dependencies
- [ ] Verify backups

### Monthly Checks
- [ ] Security audit
- [ ] Performance review
- [ ] Cost analysis
- [ ] Plan scaling if needed

## Production Rollback Plan

If deployment fails or causes issues:

### Option 1: Render Dashboard
1. Go to Service
2. Click "Deploy History"
3. Click "Redeploy" on previous version
4. Wait for rollback to complete

### Option 2: Git Rollback
```bash
# If issue is recent
git revert HEAD
git push origin main

# Render will automatically redeploy
```

### Option 3: Manual Fix
1. Fix the issue locally
2. Test thoroughly
3. Commit and push
4. Monitor deployment

## Disaster Recovery

### Database Backup
- [ ] Enable MongoDB automatic backups
- [ ] Test backup restoration monthly
- [ ] Keep backup history 30+ days

### Service Failure
- [ ] All services have health checks
- [ ] Render auto-restarts failed services
- [ ] Monitor alerts configured

### Security Breach
- [ ] Rotate all API keys immediately
- [ ] Update Firebase rules
- [ ] Review access logs
- [ ] Notify users if needed

## Critical Alerts to Set Up

### ML Model Service
- [ ] Health check fails
- [ ] Memory usage > 80%
- [ ] Response time > 30 seconds
- [ ] Error rate > 5%

### Backend Service
- [ ] Health check fails
- [ ] Memory usage > 80%
- [ ] Response time > 5 seconds
- [ ] Database connection fails
- [ ] Error rate > 5%

### Frontend
- [ ] Build fails
- [ ] Deployment fails
- [ ] 404 errors increase

## Quick Reference: Service URLs

After deployment, save these URLs:

```
Frontend:   https://agroconnect-frontend.onrender.com
Backend:    https://agroconnect-backend.onrender.com
ML Model:   https://agroconnect-ml-model.onrender.com
```

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Model not loading | File missing | Check `MLModel/src/crop_disease_model.h5` |
| Cold start 40-50s | Render sleep | Upgrade plan or use keep-alive pings |
| Timeout errors | ML too slow | Increase timeout to 60s |
| CORS errors | Wrong origin | Update FRONTEND_URL in Backend |
| Out of memory | ML model large | Upgrade Render instance |
| Slow predictions | Model warming up | Normal first time, fast after |

## Success Criteria

✅ **Deployment is successful when:**

- [ ] All 3 services deployed
- [ ] All services report healthy status
- [ ] Frontend loads in browser
- [ ] User can login
- [ ] Crop image upload works
- [ ] ML prediction completes
- [ ] Results display on frontend
- [ ] No console errors
- [ ] Network tab shows 200/201 responses
- [ ] Performance is acceptable

## Support & Escalation

### Issue Level 1: Check Logs
- Frontend: Browser console (F12)
- Backend: Render Dashboard → Service → Logs
- ML Model: Render Dashboard → Service → Logs

### Issue Level 2: Check Status
- Render Status: status.render.com
- Firebase Status: status.firebase.google.com
- MongoDB Status: status.mongodb.com

### Issue Level 3: Emergency Contacts
- Render Support: https://render.com/support
- Firebase Support: Firebase Console → Support
- MongoDB Support: MongoDB Atlas → Support

---

**Last Updated:** January 2026
**Version:** 1.0

**Remember:** Always test in development first before deploying to production!
