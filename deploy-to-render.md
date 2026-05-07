# Quick Render Deployment Guide

## 🚀 5-Minute Deployment

### Step 1: MongoDB Atlas (2 minutes)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create FREE cluster
3. Create database user
4. Allow access from anywhere (0.0.0.0/0)
5. Copy connection string

### Step 2: Render (2 minutes)
1. Go to https://render.com
2. Sign up with GitHub
3. New Web Service → Connect **dharaahirwal/Setupay**
4. Click **Connect**
5. Configure:
   - **Name:** `setupay-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Branch:** `main`
   - **Environment Variables:**
     ```
     NODE_ENV=production
     PORT=5000
     MONGODB_URI=<your-mongodb-atlas-connection-string>
     JWT_SECRET=setupay_secret_2024_production
     JWT_EXPIRES_IN=7d
     ```
6. Click **Create Web Service**

### Step 3: Update Mobile App (1 minute)
1. Edit `mobile/src/api/client.js`:
   ```javascript
   const BASE_URL = 'https://setupay-backend.onrender.com/api';
   ```
2. Rebuild APK:
   ```bash
   cd mobile/android && ./gradlew assembleRelease
   ```
3. Install:
   ```bash
   adb install -r app/build/outputs/apk/release/app-release.apk
   ```

### Done! 🎉

Your API is live at: `https://setupay-backend.onrender.com`

Test: `https://setupay-backend.onrender.com/health`

---

## 📋 Render Configuration Summary

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Branch** | `main` |
| **Runtime** | Node |
| **Plan** | Free |

## 🔐 Environment Variables

Add these in Render dashboard:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/setupay?retryWrites=true&w=majority
JWT_SECRET=setupay_jwt_secret_2024_production_random_key
JWT_EXPIRES_IN=7d
```

---

**Full Guide:** See `RENDER_DEPLOYMENT.md` for detailed instructions.
