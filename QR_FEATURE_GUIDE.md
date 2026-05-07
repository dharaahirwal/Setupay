# QR Code Feature Guide

## 🎯 Features Added

### 1. **QR Code Generator** (`QRCodeScreen.js`)
- Generates UPI-compliant QR codes
- Shows user's payment information
- Shareable QR code
- Copy UPI ID functionality
- Instructions for receiving payments

### 2. **QR Code Scanner** (`QRScannerScreen.js`)
- Real-time QR code scanning using camera
- Supports UPI QR code format
- Auto-fills payment details after scanning
- Camera permission handling
- Visual scanning frame with corners

### 3. **Updated Screens**
- **HomeScreen**: Added "Scan QR" and "My QR" quick actions
- **SendMoneyScreen**: Added QR scan button, auto-fills from scanned data

## 📦 Dependencies Added

```json
"react-native-qrcode-svg": "6.3.1",
"react-native-svg": "15.2.0",
"react-native-vision-camera": "4.0.5",
"vision-camera-code-scanner": "0.2.0"
```

## 🔧 Installation Steps

### Step 1: Install Dependencies
```bash
./install-qr-deps.bat
```

Or manually:
```bash
cd mobile
npm install react-native-qrcode-svg react-native-svg react-native-vision-camera vision-camera-code-scanner
```

### Step 2: Rebuild APK
```bash
cd mobile/android
./gradlew clean
./gradlew assembleRelease --no-daemon
```

### Step 3: Install on Device
```bash
adb install -r app/build/outputs/apk/release/app-release.apk
```

## 📱 How to Use

### Generate Your QR Code
1. Open PayApp
2. Tap "My QR" on home screen
3. Show QR code to sender
4. They scan and pay

### Scan QR Code to Pay
1. Open PayApp
2. Tap "Scan QR" on home screen
3. Point camera at QR code
4. Payment details auto-fill
5. Enter amount and PIN
6. Complete payment

### Alternative: Scan from Send Money Screen
1. Go to "Send Money"
2. Tap "📷 Scan QR Code" button
3. Scan and proceed with payment

## 🔐 Permissions

### Android Permissions Added
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
<uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
```

### Runtime Permissions
- Camera permission requested when opening scanner
- User can grant/deny permission
- Settings link provided if denied

## 📋 QR Code Format

### UPI QR Code Standard
```
upi://pay?pa=<UPI_ID>&pn=<NAME>&cu=INR&am=<AMOUNT>
```

**Parameters:**
- `pa` - Payee Address (UPI ID)
- `pn` - Payee Name
- `cu` - Currency (INR)
- `am` - Amount (optional)

### Example
```
upi://pay?pa=user@payapp&pn=John%20Doe&cu=INR
```

## 🎨 UI Features

### QR Code Screen
- ✅ Large, scannable QR code
- ✅ User avatar and name
- ✅ UPI ID with copy button
- ✅ Share functionality
- ✅ Instructions for receiving
- ✅ Link to scanner

### Scanner Screen
- ✅ Live camera preview
- ✅ Visual scanning frame
- ✅ Corner indicators
- ✅ Helpful tips
- ✅ Permission handling
- ✅ Error handling

## 🔄 User Flow

### Receive Money Flow
```
Home → My QR → Show QR → Sender Scans → Money Received
```

### Send Money Flow
```
Home → Scan QR → Camera Opens → Scan Code → 
Auto-fill Details → Enter Amount → Enter PIN → Success
```

## 🐛 Troubleshooting

### Camera Not Working
**Issue:** Black screen or "No Camera Found"
**Solution:**
1. Check camera permission in Settings
2. Restart app
3. Ensure device has working camera

### QR Code Not Scanning
**Issue:** Scanner doesn't detect QR code
**Solution:**
1. Ensure good lighting
2. Hold steady within frame
3. Clean camera lens
4. Try different distance

### Invalid QR Code Error
**Issue:** "Invalid QR Code" message
**Solution:**
1. Ensure QR code is UPI-compliant
2. Check QR code is not damaged
3. Try generating new QR code

### Build Errors
**Issue:** Build fails after adding dependencies
**Solution:**
```bash
cd mobile
rm -rf node_modules
npm install
cd android
./gradlew clean
./gradlew assembleRelease
```

## 🔒 Security Features

1. **Camera Permission**: Requested only when needed
2. **UPI Validation**: Validates UPI ID format
3. **Amount Verification**: User confirms before payment
4. **PIN Protection**: Requires UPI PIN for transactions
5. **Secure QR Format**: Uses standard UPI protocol

## 📊 Testing

### Test QR Generation
1. Open "My QR" screen
2. Verify QR code displays
3. Test share functionality
4. Test copy UPI ID

### Test QR Scanning
1. Generate QR code on another device
2. Open scanner
3. Scan QR code
4. Verify auto-fill works
5. Complete test transaction

### Test Permissions
1. Deny camera permission
2. Verify error message
3. Tap "Grant Permission"
4. Verify permission request

## 🚀 Future Enhancements

- [ ] Save QR code as image
- [ ] Scan from gallery
- [ ] Dynamic QR with amount
- [ ] QR code history
- [ ] Batch QR scanning
- [ ] NFC payment support
- [ ] Merchant QR codes
- [ ] QR code analytics

## 📝 Code Structure

```
mobile/src/screens/
├── QRCodeScreen.js       # QR code generator
├── QRScannerScreen.js    # QR code scanner
├── HomeScreen.js         # Updated with QR buttons
└── SendMoneyScreen.js    # Updated with scan integration

mobile/android/app/src/main/
└── AndroidManifest.xml   # Camera permissions
```

## 🎯 Key Features

✅ **UPI Standard Compliant**
✅ **Real-time Scanning**
✅ **Beautiful UI**
✅ **Permission Handling**
✅ **Error Handling**
✅ **Share Functionality**
✅ **Auto-fill Integration**
✅ **Secure Transactions**

## 📞 Support

For issues or questions:
1. Check this guide
2. Review error messages
3. Check device compatibility
4. Verify permissions granted
5. Test with different QR codes

---

**Note:** QR code scanning requires a physical device with a camera. It will not work on emulators.
