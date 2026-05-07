# Setupay - Render Deployment Guide

Complete guide to deploy Setupay backend on Render.com

## 📋 Prerequisites

1. **GitHub Account** - Your code is already on GitHub ✅
2. **Render Account** - Sign up at https://render.com (free)
3. **MongoDB Atlas Account** - Sign up at https://www.mongodb.com/cloud/atlas (free)

## 🗄️ Step 1: Setup MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/GitHub or email
3. Choose **FREE** tier (M0 Sandbox)

### 1.2 Create a Cluster
1. Click **"Build a Database"**
2. Choose **FREE** tier (Shared)
3. Select **AWS** as provider
4. Choose region closest to you (e.g., Mumbai for India)
5. Cluster Name: `setupay-cluster`
6. Click **"Create"**

### 1.3 Create Database User
1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `setupay-admin`
5. Password: Generate secure password (save it!)
6. Database User Privileges: **Read and write to any database**
7. Click **"Add User"**

### 1.4 Configure Network Access
1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 1.5 Get Connection String
1. Go to **Database** → **Connect**
2. Choose **"Connect your application"**
3. Driver: **Node.js**
4. Copy the connection string:
```
mongodb+srv://setupay-admin:<password>@setupay-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
5. Replace `<password>` with your actual password
6. Add database name: `setupay`
```
mongodb+srv://setupay-admin:YOUR_PASSWORD@setupay-cluster.xxxxx.mongodb.net/setupay?retryWrites=true&w=majority
```

## 🚀 Step 2: Deploy to Render

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Authorize Render to access your repositories

### 2.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: **dharaahirwal/Setupay**
3. Click **"Connect"**

### 2.3 Configure Service
Fill in the following details:

**Basic Settings:**
- **Name:** `setupay-backend`
- **Region:** Oregon (US West) or closest to you
- **Branch:** `main`
- **Root Directory:** Leave empty
- **Runtime:** `Node`
- **Build Command:**
  ```bash
  cd backend && npm install
  ```
- **Start Command:**
  ```bash
  cd backend && npm start
  ```

**Instance Type:**
- Select **Free** tier

### 2.4 Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Generate random string (e.g., `setupay_jwt_secret_2024_production_key`) |
| `JWT_EXPIRES_IN` | `7d` |

**Example:**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://setupay-admin:YOUR_PASSWORD@setupay-cluster.xxxxx.mongodb.net/setupay?retryWrites=true&w=majority
JWT_SECRET=setupay_jwt_secret_2024_production_key_random_string
JWT_EXPIRES_IN=7d
```

### 2.5 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Render will:
   - Clone your repository
   - Install dependencies
   - Start the server
   - Provide a URL

### 2.6 Get Your API URL
After deployment, you'll get a URL like:
```
https://setupay-backend.onrender.com
```

## 📱 Step 3: Update Mobile App

### 3.1 Update API Base URL
Edit `mobile/src/api/client.js`:

```javascript
// Change from local IP to Render URL
const BASE_URL = 'https://setupay-backend.onrender.com/api';
```

### 3.2 Rebuild APK
```bash
cd mobile/android
./gradlew clean
./gradlew assembleRelease
```

### 3.3 Install Updated APK
```bash
adb install -r app/build/outputs/apk/release/app-release.apk
```

## 🧪 Step 4: Test Deployment

### 4.1 Test Health Endpoint
Open browser or use curl:
```bash
curl https://setupay-backend.onrender.com/health
```

Expected response:
```json
{"status":"OK","timestamp":"2024-..."}
```

### 4.2 Test API Endpoints
```bash
# Test registration
curl -X POST https://setupay-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123",
    "fullName": "Test User",
    "phone": "9999999999"
  }'
```

### 4.3 Seed Database (Optional)
If you want to seed the production database:

1. Go to Render Dashboard
2. Click on your service
3. Go to **"Shell"** tab
4. Run:
```bash
cd backend && node src/seed.js
```

## 🔧 Step 5: Configure Custom Domain (Optional)

### 5.1 Add Custom Domain
1. Go to Render Dashboard → Your Service
2. Click **"Settings"** → **"Custom Domain"**
3. Add your domain (e.g., `api.setupay.com`)
4. Follow DNS configuration instructions

### 5.2 Update Mobile App
Update `BASE_URL` to your custom domain:
```javascript
const BASE_URL = 'https://api.setupay.com/api';
```

## 📊 Monitoring & Logs

### View Logs
1. Go to Render Dashboard
2. Click on your service
3. Go to **"Logs"** tab
4. View real-time logs

### Monitor Performance
1. Go to **"Metrics"** tab
2. View:
   - CPU usage
   - Memory usage
   - Request count
   - Response times

## 🔒 Security Best Practices

### 1. Environment Variables
✅ Never commit `.env` files
✅ Use Render's environment variables
✅ Generate strong JWT secrets

### 2. MongoDB Atlas
✅ Use strong passwords
✅ Enable IP whitelisting (if not using 0.0.0.0/0)
✅ Regular backups
✅ Monitor access logs

### 3. API Security
✅ Rate limiting enabled
✅ CORS configured
✅ Input validation
✅ JWT authentication

## 🐛 Troubleshooting

### Build Failed
**Issue:** Build command fails
**Solution:**
1. Check build logs in Render
2. Verify `package.json` in backend folder
3. Ensure all dependencies are listed

### MongoDB Connection Error
**Issue:** Cannot connect to MongoDB
**Solution:**
1. Verify connection string is correct
2. Check MongoDB Atlas network access (0.0.0.0/0)
3. Ensure database user has correct permissions
4. Check if password contains special characters (URL encode them)

### App Can't Connect to API
**Issue:** Mobile app shows network error
**Solution:**
1. Verify Render service is running
2. Check API URL in `mobile/src/api/client.js`
3. Test health endpoint in browser
4. Ensure phone has internet connection

### Free Tier Limitations
**Issue:** Service spins down after inactivity
**Solution:**
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Upgrade to paid tier for always-on service
- Or use a service like UptimeRobot to ping every 14 minutes

## 💰 Pricing

### Render Free Tier
- ✅ 750 hours/month (enough for 1 service)
- ✅ Automatic HTTPS
- ✅ Continuous deployment
- ⚠️ Spins down after 15 min inactivity
- ⚠️ 512 MB RAM
- ⚠️ Shared CPU

### MongoDB Atlas Free Tier
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ No credit card required
- ✅ Perfect for development/testing

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push
Render automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update backend"
git push origin main

# Render automatically:
# 1. Detects push
# 2. Pulls latest code
# 3. Runs build command
# 4. Restarts service
```

### Manual Deploy
1. Go to Render Dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `random_secret_key` |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |

## 🎯 Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied
- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Environment variables added
- [ ] Service deployed successfully
- [ ] Health endpoint tested
- [ ] Mobile app updated with new URL
- [ ] APK rebuilt and installed
- [ ] End-to-end testing completed

## 🚀 Quick Deploy Commands

```bash
# 1. Update mobile app API URL
# Edit mobile/src/api/client.js

# 2. Rebuild APK
cd mobile/android
./gradlew assembleRelease

# 3. Install on device
adb install -r app/build/outputs/apk/release/app-release.apk

# 4. Test
# Open app and try login/payment
```

## 📞 Support

### Render Support
- Documentation: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

### MongoDB Atlas Support
- Documentation: https://docs.atlas.mongodb.com
- Community: https://www.mongodb.com/community/forums
- Support: https://support.mongodb.com

## 🎉 Success!

Your Setupay backend is now deployed and accessible worldwide! 🌍

**API URL:** `https://setupay-backend.onrender.com`

Test it:
```bash
curl https://setupay-backend.onrender.com/health
```

---

**Made with ❤️ by Dhara Ahirwal**
