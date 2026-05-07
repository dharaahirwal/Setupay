import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { setUpiPin, changePassword, getMe } from '../api/auth';
import { Colors } from '../theme/colors';

const SettingsScreen = ({ navigation }) => {
  const { user, logout, updateUser } = useAuth();

  // UPI PIN state
  const [pinSection, setPinSection] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [pinLoading, setPinLoading] = useState(false);

  // Change password state
  const [pwSection, setPwSection] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const handleSetPin = async () => {
    if (newPin.length < 4 || newPin.length > 6) {
      Alert.alert('Invalid PIN', 'PIN must be 4 to 6 digits');
      return;
    }
    if (!/^\d+$/.test(newPin)) {
      Alert.alert('Invalid PIN', 'PIN must contain only numbers');
      return;
    }
    if (newPin !== confirmPin) {
      Alert.alert('PIN Mismatch', 'PINs do not match');
      return;
    }
    if (!accountPassword) {
      Alert.alert('Required', 'Please enter your account password');
      return;
    }

    setPinLoading(true);
    try {
      const data = await setUpiPin(newPin, accountPassword);
      if (data.success) {
        // Refresh user data
        const meData = await getMe();
        if (meData.success) updateUser(meData.user);

        Alert.alert('Success', 'UPI PIN set successfully!');
        setNewPin('');
        setConfirmPin('');
        setAccountPassword('');
        setPinSection(false);
      }
    } catch (err) {
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Failed to set UPI PIN'
      );
    } finally {
      setPinLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) {
      Alert.alert('Required', 'Please fill all fields');
      return;
    }
    if (newPw.length < 6) {
      Alert.alert('Weak Password', 'New password must be at least 6 characters');
      return;
    }
    if (newPw !== confirmPw) {
      Alert.alert('Mismatch', 'New passwords do not match');
      return;
    }

    setPwLoading(true);
    try {
      const data = await changePassword(currentPw, newPw);
      if (data.success) {
        Alert.alert('Success', 'Password changed successfully!');
        setCurrentPw('');
        setNewPw('');
        setConfirmPw('');
        setPwSection(false);
      }
    } catch (err) {
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Failed to change password'
      );
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.fullName?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.fullName}</Text>
            <Text style={styles.profileUsername}>@{user?.username}</Text>
            <Text style={styles.profileUpi}>{user?.upiId}</Text>
          </View>
        </View>

        {/* Account Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Balance</Text>
            <Text style={styles.infoValue}>{formatAmount(user?.balance || 0)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{user?.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>UPI PIN</Text>
            <View style={styles.pinStatusBadge}>
              <Text
                style={[
                  styles.pinStatusText,
                  user?.upiPinSet ? styles.pinSet : styles.pinNotSet,
                ]}>
                {user?.upiPinSet ? '✓ Set' : '✗ Not Set'}
              </Text>
            </View>
          </View>
        </View>

        {/* Set UPI PIN */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.sectionToggle}
            onPress={() => setPinSection(!pinSection)}>
            <View>
              <Text style={styles.cardTitle}>
                {user?.upiPinSet ? 'Change UPI PIN' : '🔐 Set UPI PIN'}
              </Text>
              <Text style={styles.cardSubtitle}>
                {user?.upiPinSet
                  ? 'Update your 4-6 digit UPI PIN'
                  : 'Required to send money'}
              </Text>
            </View>
            <Text style={styles.toggleArrow}>{pinSection ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {pinSection && (
            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>New PIN (4-6 digits)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new PIN"
                placeholderTextColor={Colors.textHint}
                value={newPin}
                onChangeText={setNewPin}
                keyboardType="numeric"
                secureTextEntry
                maxLength={6}
              />

              <Text style={styles.inputLabel}>Confirm PIN</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter PIN"
                placeholderTextColor={Colors.textHint}
                value={confirmPin}
                onChangeText={setConfirmPin}
                keyboardType="numeric"
                secureTextEntry
                maxLength={6}
              />

              <Text style={styles.inputLabel}>Account Password (for verification)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your account password"
                placeholderTextColor={Colors.textHint}
                value={accountPassword}
                onChangeText={setAccountPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={[styles.actionButton, pinLoading && { opacity: 0.7 }]}
                onPress={handleSetPin}
                disabled={pinLoading}>
                {pinLoading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.actionButtonText}>
                    {user?.upiPinSet ? 'Update PIN' : 'Set PIN'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Change Password */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.sectionToggle}
            onPress={() => setPwSection(!pwSection)}>
            <View>
              <Text style={styles.cardTitle}>🔑 Change Password</Text>
              <Text style={styles.cardSubtitle}>Update your account password</Text>
            </View>
            <Text style={styles.toggleArrow}>{pwSection ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {pwSection && (
            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter current password"
                placeholderTextColor={Colors.textHint}
                value={currentPw}
                onChangeText={setCurrentPw}
                secureTextEntry
              />

              <Text style={styles.inputLabel}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password (min 6 chars)"
                placeholderTextColor={Colors.textHint}
                value={newPw}
                onChangeText={setNewPw}
                secureTextEntry
              />

              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter new password"
                placeholderTextColor={Colors.textHint}
                value={confirmPw}
                onChangeText={setConfirmPw}
                secureTextEntry
              />

              <TouchableOpacity
                style={[styles.actionButton, pwLoading && { opacity: 0.7 }]}
                onPress={handleChangePassword}
                disabled={pwLoading}>
                {pwLoading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.actionButtonText}>Change Password</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* App Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>App Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Platform</Text>
            <Text style={styles.infoValue}>PayApp (DBL)</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
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
  header: {
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
  headerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  profileUsername: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  profileUpi: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
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
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  sectionToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleArrow: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  pinStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.background,
  },
  pinStatusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  pinSet: {
    color: Colors.success,
  },
  pinNotSet: {
    color: Colors.error,
  },
  formSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: Colors.errorLight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutButtonText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
