import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';

const QRCodeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [qrSize, setQrSize] = useState(250);

  // QR Code data format: upi://pay?pa=<UPI_ID>&pn=<NAME>&cu=INR
  const qrData = `upi://pay?pa=${user?.upiId}&pn=${encodeURIComponent(
    user?.fullName || user?.username
  )}&cu=INR`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Pay me using UPI\n\nUPI ID: ${user?.upiId}\nName: ${user?.fullName}\n\nScan QR code or use UPI ID to send money.`,
        title: 'My Payment QR Code',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleCopyUPI = () => {
    // In a real app, you'd use Clipboard API
    Alert.alert('UPI ID Copied', user?.upiId);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>My QR Code</Text>
        <TouchableOpacity onPress={handleShare}>
          <Text style={styles.shareBtn}>Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.qrContainer}>
            <View style={styles.qrWrapper}>
              <QRCode
                value={qrData}
                size={qrSize}
                color={Colors.textPrimary}
                backgroundColor={Colors.white}
              />
            </View>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.fullName?.charAt(0)?.toUpperCase() || '?'}
              </Text>
            </View>
            <Text style={styles.userName}>{user?.fullName}</Text>
            <TouchableOpacity
              style={styles.upiIdContainer}
              onPress={handleCopyUPI}>
              <Text style={styles.upiId}>{user?.upiId}</Text>
              <Text style={styles.copyIcon}>📋</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionsTitle}>How to receive payment:</Text>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>1</Text>
              <Text style={styles.instructionText}>
                Show this QR code to the sender
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>2</Text>
              <Text style={styles.instructionText}>
                They scan it using any UPI app
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>3</Text>
              <Text style={styles.instructionText}>
                Money will be credited instantly
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.scanButton} onPress={() => navigation.navigate('QRScanner')}>
          <Text style={styles.scanButtonText}>📝 Enter UPI ID to Pay</Text>
        </TouchableOpacity>
      </ScrollView>
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
  shareBtn: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
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
  },
  qrContainer: {
    marginBottom: 24,
  },
  qrWrapper: {
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    elevation: 2,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  upiIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  upiId: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  copyIcon: {
    fontSize: 16,
  },
  instructions: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  scanButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  scanButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QRCodeScreen;
