# MongoDB Setup Guide for PayApp

## Your Network Configuration
- **Local IP Address:** 172.21.232.45
- **Backend Port:** 5000
- **MongoDB Port:** 27017

## Option 1: Install MongoDB Community Edition (Recommended)

### Step 1: Download MongoDB
1. Visit: https://www.mongodb.com/try/download/community
2. Select:
   - Version: 8.0.x (Current)
   - Platform: Windows
   - Package: MSI
3. Download and run the installer

### Step 2: Installation Options
- Choose "Complete" installation
- Install MongoDB as a Service (check this option)
- Install MongoDB Compass (GUI tool - recommended)
- Default data directory: `C:\Program Files\MongoDB\Server\8.0\data`
- Default log directory: `C:\Program Files\MongoDB\Server\8.0\log`

### Step 3: Verify Installation
Open PowerShell and run:
```powershell
# Check if MongoDB service is running
Get-Service -Name MongoDB

# Test MongoDB connection
mongo --version
# or
mongosh --version
```

### Step 4: Start MongoDB Service (if not running)
```powershell
# Start MongoDB service
Start-Service MongoDB

# Set to start automatically
Set-Service -Name MongoDB -StartupType Automatic
```

## Option 2: Use MongoDB Atlas (Cloud - Free Tier)

If you prefer not to install locally:

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster (M0 Sandbox)
4. Get your connection string
5. Update `backend/.env` with the Atlas connection string

## After MongoDB is Running

### 1. Verify MongoDB Connection
```powershell
# Using MongoDB Shell
mongosh

# Or using MongoDB Compass
# Connect to: mongodb://localhost:27017
```

### 2. Seed the Database
```powershell
cd backend
npm run seed
```

This will create:
- Test users with initial balances
- Sample transaction data

### 3. Start the Backend Server
```powershell
cd backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

### 4. Test the Server
Open browser or use curl:
```
http://172.21.232.45:5000/health
```

Should return:
```json
{"status":"OK","timestamp":"2026-05-07T..."}
```

## Firewall Configuration

### Allow Backend Server Port
```powershell
# Run as Administrator
New-NetFirewallRule -DisplayName "PayApp Backend" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
```

### Allow MongoDB Port (if needed for remote access)
```powershell
# Run as Administrator
New-NetFirewallRule -DisplayName "MongoDB" -Direction Inbound -LocalPort 27017 -Protocol TCP -Action Allow
```

## Mobile App Configuration

✅ Already updated: `mobile/src/api/client.js`
- Base URL: `http://172.21.232.45:5000/api`

### Rebuild and Install APK
```powershell
cd mobile/android
./gradlew assembleRelease
adb install -r app/build/outputs/apk/release/app-release.apk
```

## Test Users (After Seeding)

| Phone | PIN | Initial Balance |
|-------|-----|----------------|
| 9876543210 | 1234 | ₹10,000 |
| 9876543211 | 1234 | ₹5,000 |
| 9876543212 | 1234 | ₹7,500 |

## Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service
```powershell
Start-Service MongoDB
```

### Backend Can't Connect
```
MongoDB connection error: MongoServerError
```
**Solution:** Check MongoDB is running and accessible

### Mobile App Can't Connect
```
Network Error / Timeout
```
**Solutions:**
1. Check backend server is running
2. Verify firewall allows port 5000
3. Ensure phone and PC are on same network
4. Test URL in phone browser: `http://172.21.232.45:5000/health`

### IP Address Changed
If your PC's IP changes:
1. Get new IP: `ipconfig`
2. Update `mobile/src/api/client.js`
3. Rebuild APK
4. Reinstall on device

## Quick Start Commands

```powershell
# 1. Start MongoDB (if not auto-starting)
Start-Service MongoDB

# 2. Seed database (first time only)
cd backend
npm run seed

# 3. Start backend server
npm run dev

# 4. In another terminal - rebuild mobile app
cd mobile/android
./gradlew assembleRelease

# 5. Install on device
adb install -r app/build/outputs/apk/release/app-release.apk
```

## Development Workflow

1. **Backend changes:** Server auto-restarts with nodemon
2. **Mobile changes:** Rebuild APK and reinstall
3. **Database reset:** Run `npm run seed` again

## MongoDB Compass (GUI)

Connection string: `mongodb://localhost:27017`

You can:
- View collections (users, transactions)
- Query data
- Monitor performance
- Export/import data
