import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, removeFromCart, updateQuantity } from '../redux/slices/cartSlice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { usePayment } from '../hooks/usePayment';
import { RootState } from '../redux/store';
import Toast from 'react-native-toast-message';

const CartScreen = () => {
  const cartItems = useSelector(selectCartItems) as Array<any>;
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
    const { pay } = usePayment();
     const { userName, phone } = useSelector((state: RootState) => state.auth);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleBuyNow = () => {
    console.log('Proceeding to checkout...');
  };

  const increaseQty = (id: string, currentQty: number) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const decreaseQty = (id: string, currentQty: number) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
    }
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

 const handlePayment = () => {
  if (cartItems.length === 0) {
    Alert.alert('Your cart is empty.');
    return;
  }

  pay({
    amount: subtotal,
    user: {
      name: userName || '',
      email: 'john@example.com', // Replace with real email
      phone: phone || '',
    },
    onSuccess: (data) => {
      console.log('Payment Success:', data);
      navigation.navigate('PaymentSuccess', {
        type: 'cart',
        message: 'Order placed successfully',
      });
    },
    onFailure: (error) => {
      console.log('Payment Failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Payment Failed',
        text2: 'Please try again.',
      });
    },
  });
};



  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price} each</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => decreaseQty(item.id, item.quantity)} style={styles.qtyButton}>
            <Icon name="remove" size={16} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity.toString().padStart(2, '0')}</Text>
          <TouchableOpacity onPress={() => increaseQty(item.id, item.quantity)} style={styles.qtyButton}>
            <Icon name="add" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.total}>₹{item.price * item.quantity}</Text>
        <TouchableOpacity onPress={() => handleRemove(item.id)}>
          <MaterialIcons name="delete-outline" size={22} color="#d00" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>CART</Text>
        </View>

        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty.</Text>}
        />

        {cartItems.length > 0 && (
          <View style={styles.footer}>
            <View style={styles.subtotalRow}>
              <Text style={styles.subtotalLabel}>Subtotal</Text>
              <Text style={styles.subtotalValue}>₹{subtotal.toFixed(2)}</Text>
            </View>

            <TouchableOpacity style={styles.buyNowButton} onPress={handlePayment}>
              <Text style={styles.buyNowText}>BUY NOW</Text>
              <View style={styles.arrowContainer}>
                <MaterialCommunityIcons name="arrow-top-right" size={22} color="#084c3a" />
              </View>
            </TouchableOpacity>
          </View>
        )}
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
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 140,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: 'cover',
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  price: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#075E4D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 64,
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginHorizontal:16
  },
  subtotalLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  subtotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  buyNowButton: {
    flexDirection: 'row',
    backgroundColor: '#075E4D',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buyNowText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  arrowContainer: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 6,
    marginLeft: -32,
  },
});

export default CartScreen;
