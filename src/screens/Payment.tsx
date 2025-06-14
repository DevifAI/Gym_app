import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

type PaymentRouteParams = {
  item: {
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
};

const paymentOptions = [
  { id: 'gpay', name: 'Google Pay', icon: 'google' },
  { id: 'phonepe', name: 'PhonePe', icon: 'phone' },
  { id: 'card', name: 'Debit / Credit card', icon: 'credit-card' },
];

const Payment = () => {
  const route = useRoute<RouteProp<Record<string, PaymentRouteParams>, string>>();
  const { item } = route.params;

  const [selectedMethod, setSelectedMethod] = useState('gpay');

  const total = item.price * item.quantity;
  const tax = 22; // Or calculate dynamically
  const toPay = total + tax;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.heading}>PAYMENTS</Text>

          {/* Product Card */}
          <View style={styles.productCard}>
            <Image
              source={{ uri: item.image }}
              style={styles.productImage}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.quantity}</Text>
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>₹{item.price}</Text>
            </View>
          </View>

          {/* Payment Methods */}
          <Text style={styles.label}>Payment Method:</Text>
          {paymentOptions.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedMethod === method.id && styles.paymentMethodSelected,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.radioCircle}>
                {selectedMethod === method.id && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.paymentText}>{method.name}</Text>
              <MaterialCommunityIcons
                name={method.icon}
                size={20}
                color="#444"
                style={{ marginLeft: 'auto' }}
              />
            </TouchableOpacity>
          ))}

          {/* Summary */}
          <View style={styles.dashedLine} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total:</Text>
            <Text style={styles.summaryValue}>₹{total}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax:</Text>
            <Text style={styles.summaryValue}>₹{tax}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabelBold}>To Pay:</Text>
            <Text style={styles.summaryValueBold}>₹{toPay}</Text>
          </View>
          <View style={styles.termsRow}>
            <Text style={styles.linkText}>Terms & Condition</Text>
            <Text style={styles.dot}> | </Text>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View style={styles.bottomBar}>
          <Text style={styles.totalButtonText}>₹{toPay}</Text>
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payButtonText}>PAY NOW</Text>
            <MaterialCommunityIcons name="arrow-right" size={22} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  badge: {
    position: 'absolute',
    top: -4,
    left: 55,
    backgroundColor: 'green',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  productPrice: {
    fontSize: 15,
    color: '#000',
    marginTop: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    marginTop: 8,
    color: '#000',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  paymentMethodSelected: {
    borderColor: 'green',
    backgroundColor: '#e6f7ea',
  },
  paymentText: {
    fontSize: 15,
    marginLeft: 12,
    color: '#000',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'green',
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderStyle: 'dashed',
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    color: '#555',
    fontSize: 14,
  },
  summaryValue: {
    color: '#555',
    fontSize: 14,
  },
  summaryLabelBold: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  summaryValueBold: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  termsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  linkText: {
    fontSize: 12,
    color: '#555',
    textDecorationLine: 'underline',
  },
  dot: {
    marginHorizontal: 4,
    fontSize: 12,
    color: '#555',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
  },
  totalButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  payButton: {
    backgroundColor: 'green',
    marginLeft: 'auto',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Payment;
