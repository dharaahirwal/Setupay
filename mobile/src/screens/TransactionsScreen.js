import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { getTransactions } from '../api/payment';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';

const TransactionsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadTransactions = useCallback(async (pageNum = 1, append = false) => {
    try {
      const data = await getTransactions(pageNum, 20);
      if (data.success) {
        if (append) {
          setTransactions((prev) => [...prev, ...data.transactions]);
        } else {
          setTransactions(data.transactions);
        }
        setHasMore(pageNum < data.pagination.pages);
      }
    } catch (error) {
      console.error('Load transactions error:', error);
    }
  }, []);

  useEffect(() => {
    loadTransactions(1).finally(() => setLoading(false));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await loadTransactions(1);
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await loadTransactions(nextPage, true);
    setLoadingMore(false);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderTransaction = ({ item: tx }) => (
    <View style={styles.txItem}>
      <View
        style={[
          styles.txIconBg,
          tx.type === 'debit' ? styles.debitBg : styles.creditBg,
        ]}>
        <Text style={styles.txIconText}>
          {tx.type === 'debit' ? '↑' : '↓'}
        </Text>
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txName}>{tx.counterparty.name}</Text>
        <Text style={styles.txUpi}>{tx.counterparty.upiId}</Text>
        <Text style={styles.txDate}>{formatDate(tx.timestamp)}</Text>
        {tx.note ? <Text style={styles.txNote}>"{tx.note}"</Text> : null}
        <Text style={styles.txRef}>Ref: {tx.upiRef}</Text>
      </View>
      <View style={styles.txRight}>
        <Text
          style={[
            styles.txAmount,
            tx.type === 'debit' ? styles.debitText : styles.creditText,
          ]}>
          {tx.type === 'debit' ? '-' : '+'}
          {formatAmount(tx.amount)}
        </Text>
        <View
          style={[
            styles.statusBadge,
            tx.status === 'success' ? styles.successBadge : styles.failedBadge,
          ]}>
          <Text style={styles.statusText}>{tx.status.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>No Transactions</Text>
      <Text style={styles.emptySubtitle}>
        Your transaction history will appear here
      </Text>
      <TouchableOpacity
        style={styles.sendBtn}
        onPress={() => navigation.navigate('SendMoney')}>
        <Text style={styles.sendBtnText}>Send Money</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            transactions.length === 0 ? styles.emptyContainer : styles.listContent
          }
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                color={Colors.primary}
                style={{ padding: 16 }}
              />
            ) : null
          }
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  listContent: {
    padding: 12,
  },
  emptyContainer: {
    flex: 1,
  },
  txItem: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  txIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  debitBg: {
    backgroundColor: Colors.errorLight,
  },
  creditBg: {
    backgroundColor: Colors.successLight,
  },
  txIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  txInfo: {
    flex: 1,
  },
  txName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  txUpi: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  txDate: {
    fontSize: 11,
    color: Colors.textHint,
    marginTop: 2,
  },
  txNote: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  txRef: {
    fontSize: 10,
    color: Colors.textHint,
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  debitText: {
    color: Colors.debit,
  },
  creditText: {
    color: Colors.credit,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  successBadge: {
    backgroundColor: Colors.successLight,
  },
  failedBadge: {
    backgroundColor: Colors.errorLight,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  sendBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  sendBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionsScreen;
