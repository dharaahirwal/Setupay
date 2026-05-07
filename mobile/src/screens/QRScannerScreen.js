import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { Colors } from '../theme/colors';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const QRScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualInput, setManualInput] = useState('');

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.CAMERA 
        : PERMISSIONS.ANDROID.CAMERA;

      const result = await check(permission);

      if (result === RESULTS.GRANTED) {
        setHasPermission(true);
      } else if (result === RESULTS.DENIED) {
        const requestResult = await request(permission);
        setHasPermission(requestResult === RESULTS.GRANTED);
      } else if (result === RESULTS.BLOCKED) {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera permission in your device settings to scan QR codes.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        setHasPermission(false);
      } else {
        setHasPermission(false);
      }
    } catch (error) {
      console.error('Permission error:', error);
      setHasPermission(false);
    }
  };

  const handleBarCodeRead = (event) => {
    if (scanned) return;

    setScanned(true);
    const qrData = event.nativeEvent.codeStringValue;

    try {
      let upiId = qrData;
      let name = '';
      let amount = '';

      // Check if it's a UPI URL format
      if (qrData.startsWith('upi://pay')) {
        const url = new URL(qrData);
        upiId = url.searchParams.get('pa') || '';
        name = url.searchParams.get('pn') || '';
        amount = url.searchParams.get('am') || '';
      }

      if (upiId) {
        navigation.replace('SendMoney', {
          scannedUpiId: upiId,
          scannedName: name,
          scannedAmount: amount,
        });
      } else {
        Alert.alert('Invalid QR Code', 'Could not extract UPI ID from QR code');
        setScanned(false);
      }
    } catch (error) {
      // If not a URL, treat as direct UPI ID
      navigation.replace('SendMoney', {
        scannedUpiId: qrData,
      });
    }
  };

  const handleManualSubmit = () => {
    if (!manualInput.trim()) {
      Alert.alert('Error', 'Please enter a UPI ID');
      return;
    }

    try {
      let upiId = manualInput.trim();
      let name = '';
      let amount = '';

      // Check if it's a UPI URL format
      if (upiId.startsWith('upi://pay')) {
        const url = new URL(upiId);
        upiId = url.searchParams.get('pa') || '';
        name = url.searchParams.get('pn') || '';
        amount = url.searchParams.get('am') || '';
      }

      if (upiId) {
        navigation.replace('SendMoney', {
          scannedUpiId: upiId,
          scannedName: name,
          scannedAmount: amount,
        });
      } else {
        Alert.alert('Invalid Input', 'Could not extract UPI ID');
      }
    } catch (error) {
      // If not a URL, treat as direct UPI ID
      navigation.replace('SendMoney', {
        scannedUpiId: manualInput.trim(),
      });
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Scan QR Code</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.messageText}>Requesting camera permission...</Text>
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Scan QR Code</Text>
          <View style={{ width: 60 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>📷</Text>
            </View>
            <Text style={styles.title}>Camera Permission Required</Text>
            <Text style={styles.subtitle}>
              Please enable camera permission to scan QR codes.
            </Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => Linking.openSettings()}
            >
              <Text style={styles.submitButtonText}>Open Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, styles.secondaryButton]}
              onPress={() => setShowManualInput(true)}
            >
              <Text style={[styles.submitButtonText, styles.secondaryButtonText]}>
                Enter UPI ID Manually
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (showManualInput) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setShowManualInput(false)}>
            <Text style={styles.backBtn}>← Back to Scanner</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Enter UPI ID</Text>
          <View style={{ width: 60 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>✍️</Text>
            </View>
            <Text style={styles.title}>Manual Entry</Text>
            <Text style={styles.subtitle}>
              Enter the UPI ID or UPI payment link below
            </Text>
            <View style={styles.divider} />
            <Text style={styles.label}>Enter UPI ID or UPI Link</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., user@payapp or upi://pay?pa=..."
              placeholderTextColor={Colors.textHint}
              value={manualInput}
              onChangeText={setManualInput}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleManualSubmit}>
              <Text style={styles.submitButtonText}>Continue to Payment</Text>
            </TouchableOpacity>
            <View style={styles.examplesCard}>
              <Text style={styles.examplesTitle}>💡 Examples:</Text>
              <Text style={styles.exampleText}>• user@payapp</Text>
              <Text style={styles.exampleText}>• 9876543210@paytm</Text>
              <Text style={styles.exampleText}>• upi://pay?pa=user@payapp&pn=John</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Scan QR Code</Text>
        <TouchableOpacity onPress={() => setShowManualInput(true)}>
          <Text style={styles.manualBtn}>Manual</Text>
        </TouchableOpacity>
      </View>

      <Camera
        style={styles.camera}
        cameraType={CameraType.Back}
        scanBarcode={true}
        onReadCode={handleBarCodeRead}
        showFrame={true}
        laserColor={Colors.primary}
        frameColor={Colors.primary}
      />

      <View style={styles.overlay}>
        <View style={styles.scanArea}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>

      <View style={styles.bottomInfo}>
        <Text style={styles.infoTitle}>📱 Scan UPI QR Code</Text>
        <Text style={styles.infoText}>
          Point your camera at a UPI QR code to scan
        </Text>
        <TouchableOpacity
          style={styles.manualButton}
          onPress={() => setShowManualInput(true)}
        >
          <Text style={styles.manualButtonText}>Or Enter UPI ID Manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backBtn: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  topBarTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  manualBtn: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.divider,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: 16,
  },
  submitButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 12,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    color: Colors.primary,
  },
  examplesCard: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scanArea: {
    width: 250,
    height: 250,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: Colors.primary,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  bottomInfo: {
    backgroundColor: Colors.white,
    padding: 20,
    alignItems: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  manualButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  manualButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default QRScannerScreen;
