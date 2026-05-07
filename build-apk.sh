#!/bin/bash
# PayApp - APK Build Script
# Run from the payment-app directory: bash build-apk.sh

set -e

echo "========================================"
echo "  PayApp - Release APK Builder"
echo "========================================"

MOBILE_DIR="./mobile"
ANDROID_DIR="$MOBILE_DIR/android"
APK_OUTPUT="$ANDROID_DIR/app/build/outputs/apk/release/app-release.apk"

# Step 1: Install JS dependencies
echo ""
echo "[1/4] Installing Node.js dependencies..."
cd "$MOBILE_DIR"
npm install
cd ..

# Step 2: Generate keystore if it doesn't exist
KEYSTORE_PATH="$ANDROID_DIR/app/payapp-release-key.keystore"
if [ ! -f "$KEYSTORE_PATH" ]; then
  echo ""
  echo "[2/4] Generating release keystore..."
  keytool -genkeypair -v \
    -storetype PKCS12 \
    -keystore "$KEYSTORE_PATH" \
    -alias payapp-key-alias \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass PayApp@2024 \
    -keypass PayApp@2024 \
    -dname "CN=PayApp, OU=Mobile, O=PayApp, L=India, S=India, C=IN"
  echo "Keystore generated at: $KEYSTORE_PATH"
else
  echo ""
  echo "[2/4] Keystore already exists, skipping..."
fi

# Step 3: Clean previous build
echo ""
echo "[3/4] Cleaning previous build..."
cd "$ANDROID_DIR"
./gradlew clean

# Step 4: Build release APK
echo ""
echo "[4/4] Building release APK..."
./gradlew assembleRelease

echo ""
echo "========================================"
echo "  BUILD SUCCESSFUL!"
echo "========================================"
echo ""
echo "APK Location:"
echo "  $APK_OUTPUT"
echo ""
echo "Install on device:"
echo "  adb install $APK_OUTPUT"
echo ""
