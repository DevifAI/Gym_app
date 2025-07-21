import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { usePayment } from '../hooks/usePayment'; // Make sure this exports getPaymentHistory

type Payment = {
  id: string;
  amount: number;
  type: 'product' | 'subscription';
  status: 'paid' | 'pending' | 'failed';
  date: string;
  transactionId: string;
};

const PaymentHistoryScreen = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const navigation = useNavigation<any>();
  const { getPaymentHistory } = usePayment();


  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      const result = await getPaymentHistory();

      console.log(result , 'payment hosytorrrrryryryrry');

      if (result?.status && Array.isArray(result.data)) {
        const parsed: Payment[] = result.data.map((item: any) => ({
          id: String(item.id),
          amount: parseFloat(item.grand_total),
          type: item.cart_items?.[0]?.type || 'product',
          status: item.status.toLowerCase(),
          date: item.created_at.split(' ')[0],
          transactionId: item.transaction_id || 'N/A',
        }));

        setPayments(parsed);
      } else {
        setPayments([]);
      }

      setLoading(false);
    };

    fetchPayments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'failed':
        return '#F44336';
      default:
        return '#777';
    }
  };

  const renderCard = ({ item }: { item: Payment }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <View style={styles.iconBox}>
            <Icon
              name={item.type === 'subscription' ? 'calendar-check' : 'cart'}
              size={22}
              color="#075E4D"
            />
          </View>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.cardTitle}>
              {item.type === 'subscription' ? 'Subscription' : 'Product Purchase'}
            </Text>
            <Text style={styles.dateText}>Date: {item.date}</Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amount}>₹ {item.amount.toFixed(2)}</Text>
        </View>

        <Text style={styles.detailText}>Transaction ID: {item.transactionId}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.topBar}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 8 }}>
            <MaterialIcons name="arrow-back-ios" size={26} color="#000" />
          </TouchableOpacity>
          <View style={styles.header2}>
            <Text style={styles.title}>PAYMENT HISTORY</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#075E4D" style={{ marginTop: 40 }} />
      ) : payments.length === 0 ? (
        <Text style={styles.noPayments}>No payments found.</Text>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

export default PaymentHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 35,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  header2: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#000',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: 'rgba(244, 246, 250, 0.99)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconBox: {
    backgroundColor: '#E3F3EF',
    padding: 8,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  amountLabel: {
    fontSize: 15,
    color: '#444',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#075E4D',
  },
  detailText: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  noPayments: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
  },
});
