# PayApp - Setup & Build Guide

## Prerequisites

### Required Software
- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (local or Atlas) → https://www.mongodb.com
- **Java JDK 17** → https://adoptium.net
- **Android Studio** → https://developer.android.com/studio
  - Install SDK: Android 14 (API 34)
  - Install NDK: 26.1.10909125
  - Install Build Tools: 34.0.0

### Environment Variables (add to ~/.bashrc or system env)
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export JAVA_HOME=/path/to/jdk17
```

---

## Step 1: Backend Setup

```bash
cd payment-app/backend
npm install
```

### Start MongoDB
```bash
# Local MongoDB
mongod --dbpath /data/db

# OR use MongoDB Atlas (update MONGODB_URI in .env)
```

### Seed the database (creates both user accounts)
```bash
npm run seed
```

Output:
```
✅ Seed completed successfully!
1. Username: __.dharaa._  | Password: dhara2005  | Balance: ₹2,000
2. Username: adityasingh03rajput | Password: aditya2005 | Balance: ₹2,00,000
```

### Start the backend server
```bash
npm run dev
# Server runs on http://localhost:5000
```

---

## Step 2: Mobile App Setup

```bash
cd payment-app/mobile
npm install
```

### Configure Backend URL
Edit `src/api/client.js`:
- **Android Emulator**: `http://10.0.2.2:5000` (default, already set)
- **Real Android Device**: `http://<YOUR_PC_IP>:5000`
- **iOS Simulator**: `http://localhost:5000`

---

## Step 3: Generate Release Keystore

```bash
cd payment-app/mobile/android/app

keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore payapp-release-key.keystore \
  -alias payapp-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass PayApp@2024 \
  -keypass PayApp@2024 \
  -dname "CN=PayApp, OU=Mobile, O=PayApp, L=India, S=India, C=IN"
```

---

## Step 4: Build Release APK

```bash
cd payment-app/mobile

# Install JS dependencies first
npm install

# Build the release APK
cd android
./gradlew assembleRelease
```

### APK Location
```
payment-app/mobile/android/app/build/outputs/apk/release/app-release.apk
```

---

## Step 5: Build Debug APK (for testing)

```bash
cd payment-app/mobile/android
./gradlew assembleDebug
```

Debug APK location:
```
payment-app/mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Step 6: Install APK on Device

```bash
# Via ADB (USB debugging enabled)
adb install payment-app/mobile/android/app/build/outputs/apk/release/app-release.apk

# Or transfer the APK file to your phone and install manually
```

---

## Accounts

| Username | Password | UPI ID | Balance |
|---|---|---|---|
| `__.dharaa._` | `dhara2005` | `__.dharaa._@dbl` | ₹2,000 |
| `adityasingh03rajput` | `aditya2005` | `adityasingh03rajput@dbl` | ₹2,00,000 |

> **Note:** UPI PIN is NOT set by default. Each user must set their PIN in Settings before sending money.

---

## Features

- ✅ Login with username/password
- ✅ View balance (toggle show/hide)
- ✅ Send money via UPI ID / username
- ✅ UPI PIN verification on every transaction
- ✅ Set / Change UPI PIN (verified with account password)
- ✅ Transaction history with pagination
- ✅ Quick amount buttons (₹100, ₹200, ₹500, ₹1000)
- ✅ Add note to transactions
- ✅ Transaction success screen with UPI reference
- ✅ Change account password
- ✅ Pull-to-refresh
- ✅ JWT authentication with auto-refresh
- ✅ MongoDB transactions (atomic balance updates)
- ✅ Rate limiting on API

---

## Troubleshooting

### "Network Error" on device
- Make sure backend is running
- Check the IP in `src/api/client.js`
- Ensure phone and PC are on same WiFi network

### Gradle build fails
- Run `cd android && ./gradlew clean` then retry
- Ensure JAVA_HOME points to JDK 17
- Ensure ANDROID_HOME is set correctly

### MongoDB connection fails
- Check if MongoDB service is running
- Verify MONGODB_URI in `.env`
