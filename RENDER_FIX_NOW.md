# 🚨 FIX RENDER BUILD ERROR NOW

## The Problem
Render is showing: `Unknown command: "installcd"`

This happens because Render cached old build commands and concatenated them incorrectly.

---

## ✅ SOLUTION (Choose One)

### 🎯 Option 1: Clear Cache & Redeploy (FASTEST - 2 minutes)

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Login with your GitHub account

2. **Find Your Service**
   - Look for `setupay-backend` in your services list
   - Click on it

3. **Manual Deploy with Cache Clear**
   - Click the **"Manual Deploy"** button (top right)
   - Select **"Clear build cache & deploy"**
   - Wait for deployment (3-5 minutes)

4. **Done!** ✅
   - Render will now read the correct `render.yaml` configuration
   - Build command will be: `npm install` (correct)
   - Start command will be: `npm start` (correct)

---

### 🔄 Option 2: Delete & Recreate Service (5 minutes)

If Option 1 doesn't work:

1. **Delete Existing Service**
   - Go to service settings
   - Scroll to bottom
   - Click "Delete Web Service"
   - Confirm deletion

2. **Create New Service**
   - Click **"New +"** → **"Web Service"**
   - Click **"Connect a repository"**
   - Find and select **"dharaahirwal/Setupay"**
   - Click **"Connect"**

3. **Render Auto-Detects render.yaml** ✅
   - Render will automatically use settings from `render.yaml`
   - You should see:
     - Name: `setupay-backend`
     - Root Directory: `backend`
     - Build Command: `npm install`
     - Start Command: `npm start`

4. **Add Environment Variables**
   - Scroll to "Environment Variables" section
   - Add these:
     ```
     NODE_ENV = production
     PORT = 5000
     MONGODB_URI = <your-mongodb-atlas-connection-string>
     JWT_SECRET = setupay_secret_2024_production
     JWT_EXPIRES_IN = 7d
     ```

5. **Click "Create Web Service"**
   - Wait 3-5 minutes for deployment

---

### 🛠️ Option 3: Manual Override (If render.yaml not detected)

1. **Go to Service Settings**
   - Click your service → Settings tab

2. **Update Build & Deploy**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Branch:** `main`

3. **Save Changes**
   - Click "Save Changes"
   - Trigger manual deploy

---

## 🔍 Verify Configuration

Your `render.yaml` is already correct:

```yaml
services:
  - type: web
    name: setupay-backend
    rootDir: backend          # ✅ Sets working directory
    buildCommand: npm install  # ✅ No "cd" commands
    startCommand: npm start    # ✅ No "cd" commands
```

**The fix is already in your GitHub repo!** Render just needs to read it.

---

## 📋 After Successful Deployment

1. **Get Your API URL**
   - Example: `https://setupay-backend.onrender.com`

2. **Test Health Endpoint**
   - Visit: `https://setupay-backend.onrender.com/health`
   - Should return: `{"status":"ok"}`

3. **Update Mobile App**
   - Edit `mobile/src/api/client.js`:
     ```javascript
     const BASE_URL = 'https://setupay-backend.onrender.com/api';
     ```

4. **Rebuild APK**
   ```bash
   cd mobile/android
   ./gradlew assembleRelease
   adb install -r app/build/outputs/apk/release/app-release.apk
   ```

---

## 🆘 Still Not Working?

1. Check build logs in Render dashboard
2. Verify all environment variables are set
3. Make sure MongoDB Atlas connection string is correct
4. See `RENDER_TROUBLESHOOTING.md` for more help

---

## ✅ Success Checklist

- [ ] Render build completes without errors
- [ ] Service shows "Live" status (green)
- [ ] Health endpoint returns `{"status":"ok"}`
- [ ] Can login from mobile app
- [ ] Can send/receive payments

---

**Need MongoDB Atlas?** See `RENDER_DEPLOYMENT.md` for MongoDB setup instructions.
