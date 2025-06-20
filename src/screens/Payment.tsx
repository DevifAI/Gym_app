import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

type PaymentRouteParams = {
  title: string;
  price: string;
  duration: string;
  time: string;
  bookedSlots: number;
};

const paymentOptions = [
  { id: 'gpay', name: 'Google Pay', image: require('../assets/payments/Gpay.png') },
  { id: 'phonepe', name: 'PhonePe', image: require('../assets/payments/Phpe.png') },
  { id: 'card', name: 'Debit / Credit Card', image: require('../assets/payments/Card.png') },
];


const Payment = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<Record<string, PaymentRouteParams>, string>>();
  const {
    title ,
    price ,
    duration ,
    time,
    bookedSlots,
  } = route.params;

  const [selectedMethod, setSelectedMethod] = useState('gpay');

  const total = parseInt(price || '0');
  const tax = 22;
  const toPay = total + tax;
  const totalSlots = 4;

  const renderPeopleIcons = () => {
    return [...Array(totalSlots)].map((_, index) => (
      <MaterialIcons
        key={index}
        name="person"
        size={18}
        color={index < bookedSlots ? '#075E4D' : '#ccc'}
        style={{ marginRight: 2 }}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>

           <View style={styles.header}>
                   <TouchableOpacity onPress={() => navigation.goBack()}>
                     <MaterialIcons name="arrow-back-ios" size={24} />
                   </TouchableOpacity>
                   <Text style={styles.headerTitle}>PAYMENT</Text>
                 </View>

          {/* Summary Card */}
          <View style={styles.card}>
            <View style={styles.timeBox}>
              <Text style={styles.time}>{time}</Text>
              <Text style={styles.duration}>{duration}</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.name}>{title}</Text>
              <Text style={styles.price}>₹{price}</Text>

            </View>
            <View style={styles.peopleRow}>{renderPeopleIcons()}</View>
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
              <Image source={method.image} style={styles.paymentIcon} />
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

          {/* Terms */}
          <View style={styles.termsRow}>
            <Text style={styles.linkText}>Terms & Condition</Text>
            <Text style={styles.dot}> | </Text>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </View>
        </ScrollView>

        {/* Bottom Bar */}
     <View style={styles.fixedBottom}>
  <TouchableOpacity
    style={styles.continueButton}
    onPress={() => navigation.navigate('PaymentSuccess')}
  >
    {/* Left price pill */}
    <View style={styles.priceContainer}>
      <Text style={styles.priceText}>₹{toPay}</Text>
    </View>

    {/* Centered text */}
    <Text style={styles.continueText}>BUY NOW</Text>

    {/* Right arrow */}
    <View style={styles.arrowContainer}>
      <MaterialCommunityIcons name="arrow-top-right" size={22} color="#084c3a" />
    </View>
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
    paddingTop: 35,
  },
  container: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#ffff',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  timeBox: {
    backgroundColor: '#E3F5F0',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: width * 0.24,
  },
  time: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#075E4D',
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  price: {
    marginTop: 4,
    fontSize: 16,
    color: '#666',
  },
  peopleRow: {
    flexDirection: 'row',
    marginTop: 8,
  },

  label: { fontSize: 16, fontWeight: '500', marginBottom: 12, marginTop: 8, color: '#000' },
  paymentIcon: {
  width: 22,
  height: 22,
  resizeMode: 'contain',
  marginLeft: 'auto',
},
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  paymentMethodSelected: {
    borderWidth:1.5,
    borderColor: '#075E4D',
    // backgroundColor: '#E3F5F0',
  },
  paymentText: { fontSize: 15, marginLeft: 12, color: '#000' },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#075E4D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#075E4D',
  },

  dashedLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderStyle: 'dashed',
    marginVertical: 12,
  },
  summaryRow: {
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,

  },
  summaryLabel: { color: '#555', fontSize: 15 },
  summaryValue: { color: '#555', fontSize: 15 },
  summaryLabelBold: { color: '#000', fontWeight: 'bold', fontSize: 18 },
  summaryValueBold: { color: '#000', fontWeight: 'bold', fontSize: 18 },

  termsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  linkText: { fontSize: 14, color: '#075E4D', textDecorationLine: 'underline' },
  dot: { marginHorizontal: 4, fontSize: 12, color: '#555' },

fixedBottom: {
  position: 'absolute',
  bottom: 20,
  left: 0,
  right: 0,
  backgroundColor: '#fff',
  paddingHorizontal: 16,
},
continueButton: {
  flexDirection: 'row',
  backgroundColor: '#075E4D',
  borderRadius: 30,
  height: 56,
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
},
continueText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
},
priceContainer: {
  position: 'absolute',
  left: 16,
  backgroundColor: 'white',
  borderRadius: 18,
  paddingVertical: 6,
  paddingHorizontal: 12,
},
priceText: {
  color: '#075E4D',
  fontWeight: 'bold',
  fontSize:18
},
arrowContainer: {
  position: 'absolute',
  right: 16,
  backgroundColor: 'white',
  borderRadius: 50,
  padding: 6,
},

});

export default Payment;
