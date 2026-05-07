import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Colors } from '../theme/colors';

const QRScannerScreen = ({ navigation }) => {
  const [manualInput, setManualInput] = useState('');

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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Enter UPI ID</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📷</Text>
          </View>

          <Text style={styles.title}>QR Scanner Coming Soon!</Text>
          <Text style={styles.subtitle}>
            Camera-based QR scanning will be available in the next update.
            For now, you can manually enter the UPI ID below.
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

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📱 Why Manual Entry?</Text>
          <Text style={styles.infoText}>
            To keep the app lightweight and compatible with all devices, we've
            temporarily disabled camera-based QR scanning. You can still make
            payments by entering the UPI ID directly.
          </Text>
          <Text style={styles.infoText} style={{ marginTop: 12 }}>
            Camera scanning will be added in a future update!
          </Text>
        </View>
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
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
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
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

export default QRScannerScreen;
