# ✅ Local Development Setup Complete!

## Setup Summary - May 7, 2026

### 🎯 What Was Done:

#### 1. **MongoDB Installation** ✅
- Installed MongoDB Server 8.2.7 via winget
- Service Status: **Running**
- Connection: `mongodb://localhost:27017/paymentapp`

#### 2. **Database Seeding** ✅
- Created test users with initial balances
- Database: `paymentapp`
- Collections: `users`, `transactions`

#### 3. **Network Configuration** ✅
- Local IP Address: **172.21.232.45**
- Backend Server: **http://172.21.232.45:5000**
- API Endpoint: **http://172.21.232.45:5000/api**

#### 4. **Mobile App Update** ✅
- Updated `mobile/src/api/client.js` with server IP
- Rebuilt release APK
- Installed on device (ZN42266XH6)

#### 5. **Backend Server** ✅
- Status: **Running** (Terminal ID: 23)
- Port: 5000
- Health Check: http://172.21.232.45:5000/health
- Auto-restart: Enabled (nodemon)

---

## 🔐 Test Accounts

| Username | Password | UPI ID | Balance |
|----------|----------|--------|---------|
| __.dharaa._ | dhara2005 | __.dharaa._@dbl | ₹2,000 |
| adityasingh03rajput | aditya2005 | adityasingh03rajput@dbl | ₹2,00,000 |

**Note:** UPI PIN must be set after first login in the app.

---

## 🚀 Quick Commands

### Start Backend Server (if stopped)
```powershell
cd backend
npm run dev
```

### Check Server Status
```powershell
# Health check
curl http://172.21.232.45:5000/health

# Or in browser
http://172.21.232.45:5000/health
```

### Rebuild & Install APK
```powershell
# Rebuild
cd mobile/android
./gradlew assembleRelease

# Install
adb install -r app/build/outputs/apk/release/app-release.apk
```

### MongoDB Commands
```powershell
# Check service
Get-Service MongoDB

# Start service
Start-Service MongoDB

# Stop service
Stop-Service MongoDB

# Connect via shell
mongosh
```

### View Database
```powershell
# Using MongoDB Shell
mongosh
use paymentapp
db.users.find()
db.transactions.find()
```

---

## 📱 Testing the App

### 1. Open PayApp on Device
- Find "PayApp" in app drawer
- Launch the application

### 2. Login
- Username: `__.dharaa._`
- Password: `dhara2005`

### 3. Set UPI PIN (First Time)
- You'll be prompted to set a 4-digit PIN
- Example: `1234`

### 4. Test Features
- ✅ View balance
- ✅ Send money to: `adityasingh03rajput@dbl`
- ✅ View transaction history
- ✅ Check profile/settings

---

## 🔧 Troubleshooting

### App Can't Connect to Server

**Check 1: Server Running?**
```powershell
curl http://172.21.232.45:5000/health
```

**Check 2: Same Network?**
- Ensure phone and PC are on same WiFi
- Check PC IP hasn't changed: `ipconfig`

**Check 3: Firewall**
```powershell
# Add firewall rule (Run as Administrator)
netsh advfirewall firewall add rule name="PayApp Backend" dir=in action=allow protocol=TCP localport=5000
```

**Check 4: Test from Phone Browser**
- Open browser on phone
- Navigate to: `http://172.21.232.45:5000/health`
- Should show: `{"status":"OK","timestamp":"..."}`

### MongoDB Connection Error

```powershell
# Check MongoDB is running
Get-Service MongoDB

# If stopped, start it
Start-Service MongoDB

# Restart backend server
cd backend
npm run dev
```

### Backend Server Crashed

```powershell
# Check logs in terminal
# Restart server
cd backend
npm run dev
```

### IP Address Changed

If your PC's IP address changes:

1. **Get new IP:**
   ```powershell
   ipconfig | Select-String "IPv4"
   ```

2. **Update mobile app:**
   ```javascript
   // Edit: mobile/src/api/client.js
   const BASE_URL = 'http://NEW_IP_HERE:5000/api';
   ```

3. **Rebuild APK:**
   ```powershell
   cd mobile/android
   ./gradlew assembleRelease
   adb install -r app/build/outputs/apk/release/app-release.apk
   ```

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/set-pin` - Set UPI PIN
- `POST /api/auth/verify-pin` - Verify UPI PIN

### User
- `GET /api/user/profile` - Get user profile
- `GET /api/user/balance` - Get balance
- `GET /api/user/search?query=username` - Search users

### Payment
- `POST /api/payment/send` - Send money
- `GET /api/payment/transactions` - Get transaction history
- `GET /api/payment/transaction/:id` - Get specific transaction

---

## 🛠️ Development Workflow

### Making Backend Changes
1. Edit files in `backend/src/`
2. Server auto-restarts (nodemon)
3. Test immediately

### Making Mobile Changes
1. Edit files in `mobile/src/`
2. Rebuild APK: `cd mobile/android && ./gradlew assembleRelease`
3. Reinstall: `adb install -r app/build/outputs/apk/release/app-release.apk`

### Database Changes
```powershell
# Re-seed database
cd backend
npm run seed

# Or manually via MongoDB Shell
mongosh
use paymentapp
db.users.find()
```

---

## 📁 Project Structure

```
payment-app/
├── backend/
│   ├── src/
│   │   ├── server.js          # Main server file
│   │   ├── seed.js            # Database seeder
│   │   ├── models/            # Mongoose models
│   │   ├── routes/            # API routes
│   │   └── middleware/        # Auth middleware
│   ├── .env                   # Environment config
│   └── package.json
│
├── mobile/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js      # API client (SERVER URL HERE)
│   │   ├── screens/           # App screens
│   │   └── context/           # React context
│   └── android/               # Android build files
│
└── Scripts:
    ├── setup-local.bat        # Automated setup
    ├── start-backend.bat      # Start server
    └── build-apk.bat          # Build APK
```

---

## ✅ Current Status

- ✅ MongoDB: Running
- ✅ Backend Server: Running on port 5000
- ✅ Mobile App: Installed on device
- ✅ Database: Seeded with test users
- ✅ Network: Configured (172.21.232.45)

## 🎉 Ready to Test!

Your PayApp is now fully configured and ready for testing. Open the app on your device and start testing payment features!

---

**Last Updated:** May 7, 2026
**Server IP:** 172.21.232.45:5000
**Device:** ZN42266XH6
