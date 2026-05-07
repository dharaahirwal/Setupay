import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StatusBar,
} from 'react-native';
import { searchUser, sendMoney } from '../api/payment';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';

const SendMoneyScreen = ({ navigation, route }) => {
  const { user, updateUser } = useAuth();
  const { scannedUpiId, scannedName, scannedAmount } = route.params || {};

  // Step 1: Search
  const [searchQuery, setSearchQuery] = useState(scannedUpiId || '');
  const [searchLoading, setSearchLoading] = useState(false);
  const [foundUser, setFoundUser] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Step 2: Amount
  const [amount, setAmount] = useState(scannedAmount || '');
  const [note, setNote] = useState('');

  // Step 3: PIN
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [upiPin, setUpiPin] = useState('');
  const [sendLoading, setSendLoading] = useState(false);

  // Step 4: Success
  const [successData, setSuccessData] = useState(null);

  // Auto-search if scanned data is provided
  React.useEffect(() => {
    if (scannedUpiId) {
      handleSearch();
    }
  }, [scannedUpiId]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchError('');
    setFoundUser(null);
    setSearchLoading(true);
    try {
      const data = await searchUser(searchQuery.trim());
      if (data.success) {
        setFoundUser(data.user);
      }
    } catch (err) {
      setSearchError(
        err.response?.data?.message || 'User not found'
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const handleProceedToPin = () => {
    if (!amount || parseFloat(amount) < 1) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount (min ₹1)');
      return;
    }
    if (parseFloat(amount) > (user?.balance || 0)) {
      Alert.alert('Insufficient Balance', 'You do not have enough balance');
      return;
    }
    if (!user?.upiPinSet) {
      Alert.alert(
        'UPI PIN Not Set',
        'Please set your UPI PIN in Settings before sending money',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go to Settings', onPress: () => navigation.navigate('Settings') },
        ]
      );
      return;
    }
    setUpiPin('');
    setPinModalVisible(true);
  };

  const handleSend = async () => {
    if (upiPin.length < 4) {
      Alert.alert('Invalid PIN', 'Please enter your 4-6 digit UPI PIN');
      return;
    }
    setSendLoading(true);
    try {
      const data = await sendMoney({
        receiverUpiId: foundUser.upiId || foundUser.username,
        amount: parseFloat(amount),
        upiPin,
        note,
      });
      if (data.success) {
        setPinModalVisible(false);
        setSuccessData(data);
        updateUser({ ...user, balance: data.newBalance });
      }
    } catch (err) {
      setPinModalVisible(false);
      Alert.alert(
        'Transaction Failed',
        err.response?.data?.message || 'Something went wrong'
      );
    } finally {
      setSendLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setFoundUser(null);
    setAmount('');
    setNote('');
    setUpiPin('');
    setSuccessData(null);
    setSearchError('');
  };

  const formatAmount = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amt);
  };

  // Success Screen
  if (successData) {
    return (
      <View style={styles.successContainer}>
        <StatusBar backgroundColor={Colors.success} barStyle="light-content" />
        <View style={styles.successCard}>
          <View style={styles.successIcon}>
            <Text style={styles.successCheckmark}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successAmount}>
            {formatAmount(successData.transaction.amount)}
          </Text>
          <Text style={styles.successTo}>
            Sent to {successData.transaction.receiver.name}
          </Text>
          <View style={styles.successDetails}>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>UPI Ref</Text>
              <Text style={styles.successValue}>
                {successData.transaction.upiRef}
              </Text>
            </View>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>New Balance</Text>
              <Text style={styles.successValue}>
                {formatAmount(successData.newBalance)}
              </Text>
            </View>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Status</Text>
              <Text style={[styles.successValue, { color: Colors.success }]}>
                SUCCESS
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.doneButton} onPress={handleReset}>
            <Text style={styles.doneButtonText}>Send Another</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.homeButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Send Money</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">

        {/* Balance Info */}
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceInfoText}>
            Available Balance: {formatAmount(user?.balance || 0)}
          </Text>
        </View>

        {/* Search User */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Find Recipient</Text>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="UPI ID, username, or phone"
              placeholderTextColor={Colors.textHint}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
              disabled={searchLoading}>
              {searchLoading ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={styles.searchButtonText}>Find</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.qrScanButton}
            onPress={() => navigation.navigate('QRScanner')}>
            <Text style={styles.qrScanIcon}>📝</Text>
            <Text style={styles.qrScanText}>Enter UPI ID</Text>
          </TouchableOpacity>

          {searchError ? (
            <Text style={styles.searchError}>{searchError}</Text>
          ) : null}

          {foundUser && (
            <View style={styles.foundUserCard}>
              <View style={styles.foundUserAvatar}>
                <Text style={styles.foundUserAvatarText}>
                  {foundUser.fullName?.charAt(0)?.toUpperCase() || '?'}
                </Text>
              </View>
              <View style={styles.foundUserInfo}>
                <Text style={styles.foundUserName}>{foundUser.fullName}</Text>
                <Text style={styles.foundUserUpi}>{foundUser.upiId}</Text>
              </View>
              <Text style={styles.verifiedBadge}>✓ Verified</Text>
            </View>
          )}
        </View>

        {/* Amount Input */}
        {foundUser && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Enter Amount</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.rupeeSymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                placeholderTextColor={Colors.textHint}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                maxLength={8}
              />
            </View>

            {/* Quick amount buttons */}
            <View style={styles.quickAmounts}>
              {[100, 200, 500, 1000].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={styles.quickAmountBtn}
                  onPress={() => setAmount(String(amt))}>
                  <Text style={styles.quickAmountText}>₹{amt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.noteInput}
              placeholder="Add a note (optional)"
              placeholderTextColor={Colors.textHint}
              value={note}
              onChangeText={setNote}
              maxLength={200}
            />

            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleProceedToPin}>
              <Text style={styles.sendButtonText}>
                Proceed to Pay {amount ? formatAmount(parseFloat(amount) || 0) : ''}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* UPI PIN Modal */}
      <Modal
        visible={pinModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPinModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.pinModal}>
            <Text style={styles.pinModalTitle}>Enter UPI PIN</Text>
            <Text style={styles.pinModalSubtitle}>
              Paying {formatAmount(parseFloat(amount) || 0)} to{' '}
              {foundUser?.fullName}
            </Text>

            <TextInput
              style={styles.pinInput}
              placeholder="Enter 4-6 digit PIN"
              placeholderTextColor={Colors.textHint}
              value={upiPin}
              onChangeText={setUpiPin}
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
              autoFocus
            />

            <View style={styles.pinModalButtons}>
              <TouchableOpacity
                style={styles.cancelPinBtn}
                onPress={() => setPinModalVisible(false)}>
                <Text style={styles.cancelPinText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmPinBtn, sendLoading && { opacity: 0.7 }]}
                onPress={handleSend}
                disabled={sendLoading}>
                {sendLoading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.confirmPinText}>Pay Now</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
    width: 60,
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
  balanceInfo: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  balanceInfoText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  searchButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  qrScanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  qrScanIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  qrScanText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  searchError: {
    color: Colors.error,
    fontSize: 13,
    marginTop: 8,
  },
  foundUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.successLight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  foundUserAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  foundUserAvatarText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  foundUserInfo: {
    flex: 1,
  },
  foundUserName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  foundUserUpi: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  verifiedBadge: {
    color: Colors.success,
    fontWeight: '700',
    fontSize: 13,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    paddingBottom: 8,
    marginBottom: 16,
  },
  rupeeSymbol: {
    fontSize: 32,
    color: Colors.primary,
    fontWeight: 'bold',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  quickAmountBtn: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickAmountText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  noteInput: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  sendButton: {
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
  sendButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pinModal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    paddingBottom: 40,
  },
  pinModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  pinModalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  pinInput: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 8,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: 24,
  },
  pinModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelPinBtn: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelPinText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmPinBtn: {
    flex: 2,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  confirmPinText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Success
  successContainer: {
    flex: 1,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    elevation: 8,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successCheckmark: {
    fontSize: 40,
    color: Colors.white,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  successAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.success,
    marginBottom: 4,
  },
  successTo: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  successDetails: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  successLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  successValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  doneButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  doneButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  homeButton: {
    borderRadius: 12,
    padding: 14,
    width: '100%',
    alignItems: 'center',
  },
  homeButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SendMoneyScreen;
