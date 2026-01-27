# 🎯 AgroConnect 3-Tier Deployment - Execution Checklist

**Print this and check off as you go!**

---

## ✅ PRE-DEPLOYMENT CHECKLIST (Do This First)

### Documentation & Understanding
- [ ] Read START-HERE.md (5 min)
- [ ] Read QUICK-REFERENCE.md (3 min)
- [ ] Read DEPLOYMENT-SUMMARY.md (10 min)
- [ ] Understand the 3-tier architecture
- [ ] Know the deployment order: ML → Backend → Frontend

### Credentials & Secrets Gathered
- [ ] MongoDB Atlas connection string (`MONGODB_URI`)
- [ ] Firebase Project ID (`FIREBASE_PROJECT_ID`)
- [ ] Firebase Client Email (`FIREBASE_CLIENT_EMAIL`)
- [ ] Firebase Private Key (`FIREBASE_PRIVATE_KEY`)
- [ ] OpenAI API Key (if using) (`OPENAI_API_KEY`)
- [ ] Gemini API Key (if using) (`GEMINI_API_KEY`)
- [ ] JWT Secret (`JWT_SECRET`)

### Files & Resources Verified
- [ ] Model file exists: `MLModel/src/crop_disease_model.h5` (~90MB)
- [ ] Model file is not corrupted
- [ ] All code committed to GitHub
- [ ] Main branch has latest code
- [ ] No uncommitted changes

### Local Testing Done
- [ ] Backend starts without errors: `npm start`
- [ ] Frontend builds successfully: `npm run build`
- [ ] No console errors in development
- [ ] No TypeScript/linting errors

### Render Account Ready
- [ ] Render account created
- [ ] GitHub connected to Render
- [ ] Render dashboard accessible
- [ ] Have admin/owner permissions

---

## 🚀 DEPLOYMENT PHASE (Execute in This Order!)

### STEP 1️⃣: Deploy ML Model Service (⏱️ 10 minutes)

Follow: **3-TIER-DEPLOYMENT-GUIDE.md** - Section "Deploy ML Model"

**Actions:**
- [ ] Go to render.com → Dashboard
- [ ] Click "New +" → "Web Service"
- [ ] Select GitHub repository
- [ ] Fill Service Details:
  - Name: `agroconnect-ml-model`
  - Environment: Docker
  - Root Directory: `MLModel`
  - Dockerfile Path: `./Dockerfile`
  - Instance Type: Starter (free) or higher
- [ ] Add Environment Variables:
  - FLASK_ENV=production
  - PORT=5000
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 min)

**Verification:**
- [ ] Service shows "deployed" status
- [ ] Logs show "Model loaded successfully"
- [ ] Can access health endpoint

**Save This Information:**
```
ML_API_URL = _________________________
Example: https://agroconnect-ml-model.onrender.com
```

**Test It:**
```bash
curl https://agroconnect-ml-model.onrender.com/health
curl https://agroconnect-ml-model.onrender.com/crops
```
- [ ] Both return successful responses

---

### STEP 2️⃣: Deploy Backend Service (⏱️ 5 minutes)

Follow: **3-TIER-DEPLOYMENT-GUIDE.md** - Section "Deploy Backend"

**Before Deploying - Update Variables:**
- [ ] Open Backend environment variables (in Render)
- [ ] Update `ML_API_URL` = (from Step 1 above)
- [ ] Update `FRONTEND_URL` = (will get in Step 3)
- [ ] Fill all other required variables
  - MONGODB_URI
  - FIREBASE_PROJECT_ID
  - FIREBASE_CLIENT_EMAIL
  - FIREBASE_PRIVATE_KEY
  - OPENAI_API_KEY (if used)
  - GEMINI_API_KEY (if used)

**Actions:**
- [ ] Go to Render Dashboard
- [ ] Click "New +" → "Web Service"
- [ ] Select GitHub repository
- [ ] Fill Service Details:
  - Name: `agroconnect-backend`
  - Environment: Node
  - Root Directory: Backend
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Instance Type: Starter (free) or higher
- [ ] Add all environment variables (see above)
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (3-5 min)

**Verification:**
- [ ] Service shows "deployed" status
- [ ] Logs show no errors
- [ ] Can access health endpoint

**Save This Information:**
```
BACKEND_URL = _________________________
Example: https://agroconnect-backend.onrender.com
```

**Test It:**
```bash
curl https://agroconnect-backend.onrender.com/health
```
- [ ] Returns successful response

---

### STEP 3️⃣: Deploy Frontend Service (⏱️ 5 minutes)

Follow: **3-TIER-DEPLOYMENT-GUIDE.md** - Section "Deploy Frontend"

**Before Deploying - Update Variables:**
- [ ] Open Frontend environment variables
- [ ] Update `VITE_API_URL` = (Backend URL from Step 2)
- [ ] Update `VITE_ML_API_URL` = (ML URL from Step 1)
- [ ] Fill all Firebase variables:
  - VITE_FIREBASE_API_KEY
  - VITE_FIREBASE_AUTH_DOMAIN
  - VITE_FIREBASE_PROJECT_ID
  - VITE_FIREBASE_STORAGE_BUCKET
  - VITE_FIREBASE_MESSAGING_SENDER_ID
  - VITE_FIREBASE_APP_ID

**Actions:**
- [ ] Go to Render Dashboard
- [ ] Click "New +" → "Web Service"
- [ ] Select GitHub repository
- [ ] Fill Service Details:
  - Name: `agroconnect-frontend`
  - Build Command: `npm install && npm run build`
  - Start Command: `npm start`
  - Root Directory: Frontend
  - Instance Type: Starter (free) or higher
- [ ] Add all environment variables (see above)
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (3-5 min)

**Verification:**
- [ ] Service shows "deployed" status
- [ ] Logs show successful build
- [ ] Can access frontend in browser

**Save This Information:**
```
FRONTEND_URL = _________________________
Example: https://agroconnect-frontend.onrender.com
```

---

## 🧪 TESTING PHASE (Do This Next)

Follow: **PRODUCTION-DEPLOYMENT-CHECKLIST.md**

### Smoke Tests (✅ 5 minutes)

**All Services Running?**
- [ ] ML Model service: Check Render dashboard (green status)
- [ ] Backend service: Check Render dashboard (green status)
- [ ] Frontend service: Check Render dashboard (green status)

**Health Checks:**
- [ ] ML Model health: `curl ML_API_URL/health` ✅ 200
- [ ] Backend health: `curl BACKEND_URL/health` ✅ 200
- [ ] Frontend loads: Open FRONTEND_URL in browser ✅ Loads

**Network Errors?**
- [ ] Open browser → Developer Tools (F12)
- [ ] Check Console tab: No 5xx errors
- [ ] Check Network tab: No failed requests
- [ ] Check Application tab: All data stored

### Functional Tests (✅ 10 minutes)

**User Flow:**
- [ ] Frontend loads completely
- [ ] Navigation works
- [ ] Login page accessible
- [ ] Can register new user
- [ ] Can login with credentials

**Crop Analysis Flow:**
- [ ] Upload page accessible
- [ ] Can select crop type
- [ ] Can upload crop image
- [ ] Image preview shows
- [ ] ML prediction completes
- [ ] Results display correctly
- [ ] Treatment recommendations show

**Error Handling:**
- [ ] Try uploading no image → Error message shows
- [ ] Try uploading wrong file type → Error message shows
- [ ] Try not selecting crop → Error message shows
- [ ] Messages are user-friendly (not technical)

### Performance Tests (✅ 5 minutes)

**Response Times:**
- [ ] Frontend loads in < 3 seconds
- [ ] API responses < 1 second
- [ ] ML prediction completes in reasonable time
  - First prediction: ~40-60s (cold start - OK)
  - Subsequent: ~150-250ms (good)
- [ ] No excessive waiting between actions

**Resource Usage:**
- [ ] Browser DevTools → Performance tab
- [ ] No memory leaks (check if goes up then down)
- [ ] CPU usage reasonable (not constant 100%)
- [ ] Network requests reasonable (not hundreds)

**Mobile Responsiveness:**
- [ ] DevTools → Toggle device toolbar
- [ ] Try mobile view: Responsive
- [ ] Try tablet view: Responsive
- [ ] All buttons clickable on mobile

---

## 📊 MONITORING SETUP (Do This for Production)

### Daily Monitoring
- [ ] Check Render Dashboard each morning
- [ ] All services show "deployed" (green)
- [ ] Review error logs (should be minimal)
- [ ] Check uptime (should be > 99%)

### Set Up Alerts (Optional but Recommended)
- [ ] Render → Service → Settings → Notifications
  - [ ] Enable deployment notifications
  - [ ] Enable failed deploy alerts
  - [ ] Add email address

### Weekly Review
- [ ] Check performance metrics
- [ ] Review error patterns
- [ ] Plan scaling if needed
- [ ] Update dependencies if needed

### Monthly Review
- [ ] Security audit
- [ ] Cost analysis
- [ ] Performance optimization
- [ ] Backup verification

---

## 🎯 FINAL VERIFICATION

### All Services Deployed
- [ ] ML Model: Running on Render
- [ ] Backend: Running on Render
- [ ] Frontend: Running on Render
- [ ] All services have unique URLs

### All Tests Passing
- [ ] Smoke tests: ✅ All passed
- [ ] Functional tests: ✅ All passed
- [ ] Performance tests: ✅ All acceptable
- [ ] No console errors: ✅ Verified

### Production Ready
- [ ] No hardcoded secrets in code
- [ ] All environment variables set
- [ ] CORS configured correctly
- [ ] Firebase authorized domains updated
- [ ] Database backups enabled
- [ ] Monitoring configured

### Documentation Complete
- [ ] Team knows deployment URLs
- [ ] Team has access to docs
- [ ] Emergency procedures documented
- [ ] Monitoring plan in place

---

## 🚨 EMERGENCY QUICK FIXES

**If Something Goes Wrong:**

### Service Won't Deploy
1. Check Render logs (Render → Service → Logs)
2. Look for error messages
3. Check git history: `git log`
4. Review last changes
5. See QUICK-REFERENCE.md for common issues

### Service Deploys But Doesn't Work
1. Check health endpoints
2. Check environment variables (correct values?)
3. Check connectivity between services
4. See PRODUCTION-DEPLOYMENT-CHECKLIST.md

### Need to Rollback
1. Go to Render Dashboard
2. Service → Deploy History
3. Click "Redeploy" on previous version
4. Wait for rollback to complete

### Still Stuck?
1. Check QUICK-REFERENCE.md (Emergency Troubleshooting)
2. Check 3-TIER-DEPLOYMENT-GUIDE.md (Troubleshooting)
3. Check service logs
4. Google error message

---

## 📋 SUCCESS CHECKLIST

✅ **You Succeeded When:**

- [ ] All 3 services deployed
- [ ] All services show green status
- [ ] Frontend loads in browser
- [ ] Can login to app
- [ ] Can upload crop image
- [ ] ML prediction completes
- [ ] Results display correctly
- [ ] No error messages
- [ ] Performance is good
- [ ] Team notified

---

## 📞 REFERENCE INFORMATION

### Service URLs (Save These)
```
Frontend:  _________________________
Backend:   _________________________
ML Model:  _________________________
```

### Emergency Contacts
```
Render Support:    support.render.com
Firebase Support:  Firebase Console → Help & Feedback
MongoDB Support:   MongoDB Atlas → Support
```

### Important Times
```
Deployment Date: _________________________
First Test Date: _________________________
Go-Live Date:    _________________________
```

### Team Information
```
Deployment Lead:  _________________________
Backend Owner:    _________________________
Frontend Owner:   _________________________
ML Model Owner:   _________________________
```

---

## ✨ REMEMBER

✅ Deploy in order: ML → Backend → Frontend
✅ Update environment variables at each step
✅ Test after each deployment
✅ Save all URLs for reference
✅ Keep this checklist for future deployments
✅ Celebrate when live! 🎉

---

## 🎉 DEPLOYMENT COMPLETE!

When all checkboxes are marked, your AgroConnect application is live on Render!

**Date Deployed:** _______________
**By:** _______________
**Notes:** _______________

---

**Good luck with your deployment! 🚀**

*Print this checklist and check off items as you complete them!*
