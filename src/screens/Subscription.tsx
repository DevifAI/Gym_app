import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { usePayment } from '../hooks/usePayment';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Toast from 'react-native-toast-message';
import { useSubscription } from '../hooks/useSubscription';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RazorpaySuccessData = {
  razorpay_payment_id: string;
  [key: string]: any;
};

type RootStackParamList = {
  SlotBook: { title: string; id: string };
};

const Subscription = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'SlotBook'>>();
  const subCategoryId = route.params?.id;

  const { userName, phone } = useSelector((state: RootState) => state.auth);
  const { getPackages, packages, message, buySubscriptionByMemberId ,subscriptionPaymentByMemberId } = useSubscription();
  const { pay } = usePayment();

  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [expandedPackageId, setExpandedPackageId] = useState<number | null>(null);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [loadingPackages, setLoadingPackages] = useState<boolean>(false);
  const [cartId, setCartId] = useState<string | null>(null);

  useEffect(() => {
    if (subCategoryId) {
      setLoadingPackages(true);
      getPackages(subCategoryId).finally(() => setLoadingPackages(false));
    }
  }, [subCategoryId]);

const handlePayment = async () => {
  if (selectedPackageId === null) {
    Alert.alert('Please select a subscription package.');
    return;
  }

  const selectedPackage = packages.find(pkg => pkg.package_id === selectedPackageId);
  if (!selectedPackage) {
    Alert.alert('Invalid package selected.');
    return;
  }

  const amount = parseInt(String(selectedPackage.price ?? '0'), 10);
  setLoadingButton(true);

  try {
    console.log('Initiating subscription purchase...');
    const result = await buySubscriptionByMemberId(
      String(selectedPackage.package_id),
      String(selectedPackage.price)
    );

    if (!result.success || !result.cart_id) {
      throw new Error('Failed to initiate subscription');
    }

    const savedCartId = String(result.cart_id);
    setCartId(savedCartId);
    await AsyncStorage.setItem('cart_id', savedCartId);

    // Wrap pay call with try-catch to catch errors BEFORE Razorpay popup
try {
  pay({
    amount,
    user: {
      name: userName || '',
      email: 'john@example.com', // Replace with actual email
      phone: phone || '',
    },
    onSuccess: async (data: RazorpaySuccessData) => {
      try {
        console.log('[PaymentSuccessPayload]', data);

        const res = await subscriptionPaymentByMemberId({
          cart_id: Number(savedCartId),
          transaction_id: data.razorpay_payment_id,
          payment_status: 'Paid',
        });
          console.log(res , 'paymentsucessssssss');
        if (!res.status) {
          throw new Error(res.message || 'Failed to record payment');
        }

        // ✅ Delete cart_id from AsyncStorage
        await AsyncStorage.removeItem('cart_id');

        navigation.navigate('PaymentSuccess', {
          type: 'subscription',
          message: 'Subscription purchased successfully!',
          packageId: selectedPackage.package_id,
          orderNo: savedCartId,
          transactionId: data.razorpay_payment_id,
        });
      } catch (error: any) {
        console.error('[onSuccess Error]', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message || 'Something went wrong after payment.',
        });
      } finally {
        setLoadingButton(false);
      }
    },
    onFailure: async () => {
      try {
        await subscriptionPaymentByMemberId({
          cart_id: Number(savedCartId),
          transaction_id: '',
          payment_status: 'Cancelled',
        });

        // ✅ Delete cart_id from AsyncStorage
        await AsyncStorage.removeItem('cart_id');

        Toast.show({
          type: 'error',
          text1: 'Payment Failed',
          text2: 'Please try again.',
        });
      } catch (error: any) {
        console.error('[onFailure Error]', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message || 'Something went wrong while updating failed payment.',
        });
      } finally {
        setLoadingButton(false);
      }
    },
  });
} catch (err) {
  console.error('Razorpay Error:', err);
  Alert.alert('Payment Error', 'Razorpay failed to open. Please try again.');
  setLoadingButton(false);
}

  } catch (error) {
    console.error('Payment Error:', error);
    Alert.alert('Error', 'Something went wrong during the payment process.');
    setLoadingButton(false); // <-- Ensure it's reset
  }
};



  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>PACKAGES</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Loading or Package List */}
        {loadingPackages ? (
          <ActivityIndicator size="large" color="#075E4D" style={{ marginTop: 50 }} />
        ) : packages.length === 0 ? (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{message || 'No packages found.'}</Text>
          </View>
        ) : (
          packages.map((item) => {
            const isSelected = selectedPackageId === item.package_id;
            const isExpanded = expandedPackageId === item.package_id;
            const description = item.description || 'Includes gym, pool, and wellness services.';

            return (
              <View
                key={item.package_id}
                style={[styles.card, isSelected && styles.cardSelected]}
              >
                <View style={styles.info}>
                  <Text style={[styles.name, isSelected && styles.nameSelected]}>
                    {item.package_name}
                  </Text>
                  <Text style={[styles.price, isSelected && styles.priceSelected]}>
                    ₹{item.price}
                  </Text>
                  <Text style={[styles.price, { fontSize: 12 }]}>
                    Valid for {item.valid_for} {item.valid_for === 1 ? 'month' : 'months'}
                  </Text>

                  {isExpanded && (
                    <View style={styles.featuresList}>
                      <Text style={styles.featureItem}>• {description}</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={() =>
                      setExpandedPackageId(isExpanded ? null : item.package_id)
                    }
                  >
                    <Text style={styles.viewMoreBtn}>
                      {isExpanded ? 'View Less' : 'View More'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.addButton, isSelected && styles.addButtonSelected]}
                  onPress={() =>
                    setSelectedPackageId(isSelected ? null : item.package_id)
                  }
                >
                  {isSelected ? (
                    <MaterialIcons name="check-circle" size={28} color="#075E4D" />
                  ) : (
                    <Text style={styles.addText}>+ Add</Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          })
        )}

        {/* Buy Button */}
        {packages.length > 0 && (
          <View style={styles.fixedBottom}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handlePayment}
              disabled={loadingButton}
            >
              {loadingButton ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={styles.continueText}>BUY NOW</Text>
                  <View style={styles.arrowContainer}>
                    <MaterialCommunityIcons name="arrow-top-right" size={22} color="#084c3a" />
                  </View>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 35,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  messageContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: 'space-between',
  },
  cardSelected: {
    borderColor: '#075E4D',
    backgroundColor: '#E6F5F2',
  },
  info: {
    flex: 1,
    paddingRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  nameSelected: {
    color: '#075E4D',
  },
  price: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
  priceSelected: {
    color: '#084C3A',
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
  },
  viewMoreBtn: {
    marginTop: 6,
    fontSize: 13,
    color: '#075E4D',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    minWidth: 70,
  },
  addButtonSelected: {
    backgroundColor: '#d4f3ea',
  },
  addText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#075E4D',
  },
  fixedBottom: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: '#075E4D',
    borderRadius: 30,
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  continueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 1,
  },
  arrowContainer: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 6,
    
    marginLeft: -32,
  },
});

export default Subscription;