# 🚨 RENDER MANUAL FIX - DO THIS NOW

## The Problem
Render is **ignoring your render.yaml file** and using old cached settings from the dashboard.

The error shows: `cd backend && npm installcd backend && npm start`

This is the OLD configuration stored in Render's dashboard, not from render.yaml.

---

## ✅ SOLUTION: Update Service Settings Manually

### Step 1: Go to Service Settings
1. Visit: https://dashboard.render.com
2. Click on your **setupay-backend** service
3. Click **"Settings"** tab (left sidebar)

### Step 2: Update Build & Deploy Settings
Scroll to **"Build & Deploy"** section and change:

**Current (WRONG):**
- Build Command: `cd backend && npm installcd backend && npm start` ❌

**Change to (CORRECT):**
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Step 3: Save and Deploy
1. Click **"Save Changes"** button at the bottom
2. Go back to your service dashboard
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🎯 Exact Settings to Use

Copy these EXACTLY into Render dashboard:

| Setting | Value |
|---------|-------|
| **Name** | `setupay-backend` |
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Branch** | `main` |
| **Environment** | `Node` |

**IMPORTANT:** 
- ✅ Set **Root Directory** to `backend`
- ❌ Do NOT use `cd backend &&` in any commands
- ✅ Commands will run from the Root Directory automatically

---

## 🔄 Alternative: Delete & Recreate (Recommended)

If manual update doesn't work, delete and recreate:

### Step 1: Delete Service
1. Go to Settings → Scroll to bottom
2. Click **"Delete Web Service"**
3. Type service name to confirm
4. Click **"Delete"**

### Step 2: Create New Service
1. Click **"New +"** → **"Web Service"**
2. **Important:** Select **"Deploy from Git repository"**
3. Connect to **dharaahirwal/Setupay**
4. Render should auto-detect `render.yaml` ✅

### Step 3: Verify Auto-Detection
You should see these values pre-filled:
- Name: `setupay-backend`
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

If NOT pre-filled, enter them manually.

### Step 4: Add Environment Variables
```
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=setupay_secret_2024_production
JWT_EXPIRES_IN=7d
```

### Step 5: Create Service
Click **"Create Web Service"** and wait 3-5 minutes.

---

## 📸 Visual Guide

### Where to Find Settings:

```
Render Dashboard
└── Your Services
    └── setupay-backend (click here)
        └── Settings (left sidebar)
            └── Build & Deploy section
                ├── Root Directory: backend
                ├── Build Command: npm install
                └── Start Command: npm start
```

---

## ✅ How to Verify It's Fixed

After deployment, check build logs. You should see:

```
==> Running build command 'npm install'...
npm install
added 150 packages...

==> Running start command 'npm start'...
npm start
Server running on port 5000
```

**NOT:**
```
==> Running build command 'cd backend && npm installcd backend && npm start'...
Unknown command: "installcd"  ❌
```

---

## 🆘 Why is Render Ignoring render.yaml?

Render only uses `render.yaml` when:
1. Creating a NEW service from scratch, OR
2. The service was created with "Infrastructure as Code" option

If you created the service manually first, Render stores those settings in its database and ignores render.yaml.

**Solution:** Either update settings manually OR delete and recreate the service.

---

## 📋 After Successful Deployment

1. **Test Health Endpoint:**
   ```
   https://setupay-backend.onrender.com/health
   ```
   Should return: `{"status":"ok"}`

2. **Update Mobile App:**
   Edit `mobile/src/api/client.js`:
   ```javascript
   const BASE_URL = 'https://setupay-backend.onrender.com/api';
   ```

3. **Rebuild APK:**
   ```bash
   cd mobile/android
   ./gradlew assembleRelease
   adb install -r app/build/outputs/apk/release/app-release.apk
   ```

---

## 🔐 Don't Forget MongoDB Atlas

You need MongoDB Atlas for production:
1. Create free cluster at https://cloud.mongodb.com
2. Create database user
3. Allow access from anywhere (0.0.0.0/0)
4. Copy connection string
5. Add to Render environment variables as `MONGODB_URI`

See `RENDER_DEPLOYMENT.md` for detailed MongoDB setup.

---

**TL;DR:** Go to Render dashboard → Settings → Set Root Directory to `backend` → Set Build Command to `npm install` → Set Start Command to `npm start` → Save → Deploy
