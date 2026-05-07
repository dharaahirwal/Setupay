# Setupay - UPI Payment App

A full-stack UPI payment application built with React Native and Node.js, featuring QR code generation, real-time transactions, and secure payment processing.

## 🚀 Features

### Mobile App (React Native)
- 📱 **User Authentication** - Secure login/signup
- 💰 **Send Money** - Transfer funds to other users
- 📊 **Transaction History** - View all past transactions
- 🔐 **UPI PIN** - Secure transaction verification
- 📱 **QR Code Generator** - Generate payment QR codes
- 📝 **UPI ID Entry** - Manual UPI ID payment option
- 💳 **Balance Management** - Real-time balance updates
- 🔍 **User Search** - Find users by UPI ID, username, or phone

### Backend (Node.js + Express)
- 🔒 **JWT Authentication** - Secure API endpoints
- 💾 **MongoDB Database** - Persistent data storage
- 🔐 **Bcrypt Encryption** - Password and PIN hashing
- 📝 **Transaction Logging** - Complete audit trail
- ⚡ **Real-time Updates** - Instant balance updates
- 🛡️ **Input Validation** - Express-validator integration
- 🚦 **Rate Limiting** - API protection

## 📁 Project Structure

```
setupay/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── seed.js         # Database seeding
│   │   └── server.js       # Express server
│   ├── .env                # Environment variables
│   └── package.json
│
├── mobile/                  # React Native app
│   ├── android/            # Android native code
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── context/       # React Context
│   │   ├── screens/       # App screens
│   │   └── theme/         # Colors and styling
│   ├── App.js
│   └── package.json
│
├── build-apk.bat           # Windows APK build script
├── build-apk.sh            # Linux/Mac APK build script
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- React Native 0.74.2
- React Navigation
- Axios
- AsyncStorage
- react-native-qrcode-svg
- react-native-svg

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Bcrypt
- Express Validator
- Morgan (logging)

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB
- Android Studio (for mobile development)
- JDK 21 (bundled with Android Studio)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/setupay
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

4. **Start MongoDB:**
```bash
# Windows
Start-Service MongoDB

# Linux/Mac
sudo systemctl start mongod
```

5. **Seed database:**
```bash
npm run seed
```

6. **Start server:**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Mobile App Setup

1. **Navigate to mobile directory:**
```bash
cd mobile
```

2. **Install dependencies:**
```bash
npm install
```

3. **Update API URL:**
Edit `mobile/src/api/client.js`:
```javascript
const BASE_URL = 'http://YOUR_IP:5000/api';
```

4. **Build APK:**
```bash
cd android
./gradlew assembleRelease
```

Or use the build script:
```bash
# Windows
./build-apk.bat

# Linux/Mac
bash build-apk.sh
```

5. **Install on device:**
```bash
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

## 🔑 Test Accounts

After running `npm run seed`:

| Username | Password | Balance | UPI ID |
|----------|----------|---------|--------|
| __.dharaa._ | dhara2005 | ₹2,000 | __.dharaa._@dbl |
| adityasingh03rajput | aditya2005 | ₹2,00,000 | adityasingh03rajput@dbl |

**Important:** Set UPI PIN before sending money!

## 🎯 Usage

### First Time Setup
1. Login with test account
2. Go to **Settings**
3. Tap **"Set UPI PIN"**
4. Enter 4-6 digit PIN (e.g., 1234)
5. Confirm with account password
6. Now you can send money!

### Send Money
1. Tap **"Send Money"**
2. Search user by UPI ID/username/phone
3. Enter amount
4. Add note (optional)
5. Enter UPI PIN
6. Confirm transaction

### Generate QR Code
1. Tap **"My QR"**
2. Show QR to sender
3. They scan and pay
4. Money received instantly!

## 🔧 Configuration

### Change Server IP
Update `mobile/src/api/client.js`:
```javascript
const BASE_URL = 'http://YOUR_LOCAL_IP:5000/api';
```

Get your IP:
```bash
# Windows
ipconfig

# Linux/Mac
ifconfig
```

### Change App Name
1. Update `mobile/android/app/src/main/res/values/strings.xml`
2. Update `mobile/app.json`
3. Rebuild APK

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/set-upi-pin` - Set/update UPI PIN
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get current user

### Payments
- `GET /api/payment/balance` - Get balance
- `GET /api/payment/search-user` - Search users
- `POST /api/payment/send` - Send money
- `GET /api/payment/transactions` - Get transaction history
- `GET /api/payment/transaction/:id` - Get transaction details

## 🔒 Security Features

- ✅ JWT token authentication
- ✅ Bcrypt password hashing
- ✅ UPI PIN encryption
- ✅ Input validation
- ✅ Rate limiting
- ✅ CORS protection
- ✅ SQL injection prevention
- ✅ XSS protection

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Start MongoDB service
Start-Service MongoDB  # Windows
sudo systemctl start mongod  # Linux
```

### Build Failed
```bash
cd mobile/android
./gradlew clean
./gradlew assembleRelease
```

### Device Not Connected
```bash
adb devices
# Enable USB debugging on device
```

### "Please set UPI PIN first"
- Go to Settings → Set UPI PIN
- Enter 4-6 digit PIN
- Confirm with password

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributors

- Dhara Ahirwal - [@dharaahirwal](https://github.com/dharaahirwal)

## 🙏 Acknowledgments

- React Native community
- MongoDB team
- Express.js team
- All open source contributors

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check documentation
- Review error logs

---

**Made with ❤️ by Dhara Ahirwal**
