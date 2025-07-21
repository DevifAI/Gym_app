import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import AddAddressModal from '../components/AddAddressModal';
import { updateAddress } from '../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProfile } from '../hooks/useProfile';
import Toast from 'react-native-toast-message';
import { usePayment } from '../hooks/usePayment';
import { useProduct } from '../hooks/useProduct';
import { clearCart } from '../redux/slices/cartSlice';

const Payment = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<Record<string, any>, string>>();
  const { cartPayload  } = route.params;
  const dispatch = useDispatch();
  const { updateUserAddress } = useProfile();
const [localAddress, setLocalAddress] = useState<any>(null);

  const { address ,userId ,  userName, phone ,  } = useSelector((state: RootState) => state.auth);

  const [modalVisible, setModalVisible] = useState(false);
  const [paymentType, setPaymentType] = useState<'online' | 'cod'>('online');
  const [deliveryMethod, setDeliveryMethod] = useState<'home' | 'store'>('home');

    const [addressData, setAddressData] = useState({
      address: address?.address || '',
      location: address?.location || '',
      country: address?.country || '',
      state: address?.state || '',
      city: address?.city || '',
      pin: address?.pin || '',
    });

    
  const { pay } = usePayment();
  const { buyProductByMemberId , productPaymentByMemberId } = useProduct();
    
  useEffect(() => {
  const loadAddress = async () => {
    const stored = await AsyncStorage.getItem('user_address');
    if (stored) {
      setLocalAddress(JSON.parse(stored));
    }
  };
  loadAddress();
}, []);


  const tax = 22;
  const subtotal = cartPayload.totalPrice;
  const total = subtotal + tax;

const hasAddress = localAddress
  ? Object.values(localAddress).some((val) => typeof val === 'string' && val.trim() !== '')
  : address && Object.values(address).some((val) => typeof val === 'string' && val.trim() !== '');



   const handleChange = (field: string, value: string) => {
    setAddressData((prev) => ({ ...prev, [field]: value }));
  };

const handleSave = async () => {
  const isEditing = hasAddress;

  if (isEditing) {
    // Save locally only
    await AsyncStorage.setItem('user_address', JSON.stringify(addressData));
    setLocalAddress(addressData);
    setModalVisible(false);

    Toast.show({
      type: 'success',
      text1: 'Address Updated',
      text2: 'Your address was updated locally.',
    });

    return;
  }

  // Add address via API
  const payload = {
    member_id: userId ?? '',
    address: addressData.address,
    location: addressData.location,
    country: addressData.country,
    state: addressData.state,
    city: addressData.city,
    pincode: addressData.pin,
  };

  const result = await updateUserAddress(payload);

  if (result.success) {
    await AsyncStorage.setItem('user_address', JSON.stringify(addressData));
    dispatch(updateAddress(addressData));
    setLocalAddress(addressData);
    setModalVisible(false);

    Toast.show({
      type: 'success',
      text1: 'Address Saved',
      text2: 'Your address was saved successfully.',
    });
  } else {
    Toast.show({
      type: 'error',
      text1: 'Address Error',
      text2: result.message || 'Failed to save address',
    });
  }
};


const handlePayment = async () => {
  const cartItems = cartPayload.items;

  if (!cartItems || cartItems.length === 0) {
    Alert.alert('Cart is empty', 'Please add items before proceeding.');
    return;
  }

  if (deliveryMethod === 'home' && !hasAddress) {
    Alert.alert('Address Required', 'Please add a delivery address.');
    return;
  }

  const orderPayload = {
    date: new Date().toISOString(),
    memberId: userId,
    totalPrice: subtotal,
    deliveryMethod,
    deliveryAddress: deliveryMethod === 'home' ? (localAddress || address) : null,
    paymentType,
    items: cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity,
      subCategoryId: item.subcategory_id,
      subCategoryName: item.subcategory_name,
    })),
  };
   console.log(JSON.stringify(orderPayload, null, 2));

  try {
    const orderResponse = await buyProductByMemberId(orderPayload);

    if (!orderResponse.success) {
      Toast.show({
        type: 'error',
        text1: 'Order Failed',
        text2: orderResponse.message || 'Please try again later.',
      });
      return;
    }

    const savedCartItems = orderResponse.cart_items || [];

    await AsyncStorage.setItem('saved_cart_items', JSON.stringify(savedCartItems));

    if (paymentType === 'cod') {
      // COD flow
      const dummyPayload = {
        memberId: userId,
        transactionId: '',
        savedCartItems,
        status: 'Pending - COD',
      };

      await productPaymentByMemberId(dummyPayload);
      dispatch(clearCart());

      navigation.navigate('PaymentSuccess', {
        type: 'cart',
        message: 'Order placed with Cash on Delivery',
        cartitems: savedCartItems[0] || '',
        transactionId: 'COD',
      });

    } else {
      // Online Payment flow
      pay({
        amount: subtotal,
        user: {
          name: userName || '',
          email: 'test@example.com',
          phone: phone || '',
        },
        onSuccess: async (data) => {
          const stored = await AsyncStorage.getItem('saved_cart_items');
          const parsedCartItems = stored ? JSON.parse(stored) : [];

          const dummyPayload = {
            transactionId: data.razorpay_payment_id,
            savedCartItems: parsedCartItems,
            status: 'Paid',
          };

          const paymentResponse = await productPaymentByMemberId(dummyPayload);

          if (!paymentResponse.success) {
            throw new Error(paymentResponse.message || 'Payment verification failed');
          }

          await AsyncStorage.removeItem('saved_cart_items');
          dispatch(clearCart());

          navigation.navigate('PaymentSuccess', {
            type: 'cart',
            message: 'Payment successful and order placed',
            cartitems: parsedCartItems[0] || '',
            transactionId: data.razorpay_payment_id,
          });
        },
        onFailure: async () => {
          const stored = await AsyncStorage.getItem('saved_cart_items');
          const parsedCartItems = stored ? JSON.parse(stored) : [];

          const dummyPayload = {
            memberId: userId,
            transactionId: '',
            savedCartItems: parsedCartItems,
            status: 'Cancelled',
          };

          await productPaymentByMemberId(dummyPayload);

          Toast.show({
            type: 'error',
            text1: 'Payment Failed',
            text2: 'Please try again.',
          });
        },
      });
    }
  } catch (error) {
    console.error('❌ handlePayment error:', error);
    Toast.show({
      type: 'error',
      text1: 'Unexpected Error',
      text2: 'Something went wrong. Please try again.',
    });
  }
};


  const RadioOption = ({ label, selected, onPress, icon }: any) => (
    <TouchableOpacity
      style={[styles.radioItem, selected && styles.radioItemSelected]}
      onPress={onPress}
    >
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      {icon}
      <Text style={[styles.radioLabel, selected && styles.radioLabelSelected]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back-ios" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>CHECKOUT</Text>
          </View>

          {/* Cart Summary */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Cart Summary ({cartPayload.items.length} items)</Text>
            {cartPayload.items.map((item, index) => (
              <View key={item.id + index} style={styles.cartItem}>
                <View>
                  <Text style={styles.cartItemName}>{item.name} x {item.quantity}</Text>
                  <Text style={styles.cartItemPrice}>₹{item.price}</Text>
                </View>
                <Text style={styles.cartItemTotal}>₹{item.price * item.quantity}</Text>
              </View>
            ))}
          </View>

          {/* Delivery Method */}
          <Text style={styles.label}>Delivery Method</Text>
          <View style={styles.radioGroup}>
            <RadioOption
              label="Home Delivery"
              selected={deliveryMethod === 'home'}
              onPress={() => setDeliveryMethod('home')}
              icon={<MaterialIcons name="home" size={20} color={deliveryMethod === 'home' ? '#fff' : '#075E4D'} style={{ marginHorizontal: 6 }} />}
            />
            <RadioOption
              label="Collect from Store"
              selected={deliveryMethod === 'store'}
              onPress={() => setDeliveryMethod('store')}
              icon={<MaterialCommunityIcons name="store" size={20} color={deliveryMethod === 'store' ? '#fff' : '#075E4D'} style={{ marginHorizontal: 6 }} />}
            />
          </View>

          {/* Address */}
          {deliveryMethod === 'home' && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
           {hasAddress ? (
  <View>
    <Text style={{ fontSize: 16 }}>
      {(localAddress?.address || address?.address)}, {(localAddress?.city || address?.city)}, {(localAddress?.state || address?.state)}
    </Text>
    <Text style={{ fontSize: 16 }}>
      {(localAddress?.country || address?.country)} - {(localAddress?.pin || address?.pin)}
    </Text>
    <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
      <MaterialIcons name="edit-location-alt" size={18} color="#fff" />
      <Text style={styles.editButtonText}>Edit Address</Text>
    </TouchableOpacity>
  </View>
) : (
  <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
    <MaterialIcons name="add-location-alt" size={18} color="#fff" />
    <Text style={styles.editButtonText}>Add Address</Text>
  </TouchableOpacity>
)}

            </View>
          )}

          {/* Payment Type */}
          <Text style={styles.label}>Payment Type</Text>
          <View style={styles.radioGroup}>
            <RadioOption
              label="Online Payment"
              selected={paymentType === 'online'}
              onPress={() => setPaymentType('online')}
              icon={<MaterialCommunityIcons name="credit-card-outline" size={20} color={paymentType === 'online' ? '#fff' : '#075E4D'} style={{ marginHorizontal: 6 }} />}
            />
            <RadioOption
              label="Cash on Delivery"
              selected={paymentType === 'cod'}
              onPress={() => setPaymentType('cod')}
              icon={<MaterialCommunityIcons name="cash" size={20} color={paymentType === 'cod' ? '#fff' : '#075E4D'} style={{ marginHorizontal: 6 }} />}
            />
          </View>

          {/* Order Summary */}
          <View style={styles.dashedLine} />
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>₹{subtotal}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Tax</Text><Text style={styles.summaryValue}>₹{tax}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabelBold}>To Pay</Text><Text style={styles.summaryValueBold}>₹{total}</Text></View>

          {/* Terms */}
          <View style={styles.termsRow}>
            <Text style={styles.linkText}>Terms & Conditions</Text>
            <Text style={styles.dot}> | </Text>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View style={styles.fixedBottom}>
          <TouchableOpacity style={styles.continueButton} onPress={handlePayment}>
            <View style={styles.priceContainer}><Text style={styles.priceText}>₹{total}</Text></View>
            <Text style={styles.continueText}>CONFIRM ORDER</Text>
            <View style={styles.arrowContainer}><MaterialCommunityIcons name="arrow-top-right" size={22} color="#084c3a" /></View>
          </TouchableOpacity>
        </View>

<AddAddressModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  onSave={handleSave}
  values={addressData}
  onChange={handleChange}
/>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 35 : 0,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
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
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 20,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#075E4D',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
  },
  radioItemSelected: {
    backgroundColor: '#075E4D',
  },
  radioLabel: {
    color: '#075E4D',
    fontWeight: '600',
    fontSize: 16,
  },
  radioLabelSelected: {
    color: '#fff',
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#075E4D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  radioOuterSelected: {
    backgroundColor: '#fff',
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#075E4D',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  cartItemPrice: {
    color: '#888',
    fontSize: 14,
  },
  cartItemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    alignSelf: 'center',
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    marginVertical: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#555',
  },
  summaryValue: {
    fontSize: 16,
    color: '#555',
  },
  summaryLabelBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  summaryValueBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  termsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  linkText: {
    fontSize: 14,
    color: '#075E4D',
    textDecorationLine: 'underline',
  },
  dot: {
    marginHorizontal: 4,
    fontSize: 12,
    color: '#555',
  },
  fixedBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom:38,
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
    fontSize: 18,
  },
  arrowContainer: {
    position: 'absolute',
    right: 16,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 6,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#075E4D',
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    gap: 6,
    width: 120,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Payment;
