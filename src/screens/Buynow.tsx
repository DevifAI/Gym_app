import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartItems } from '../redux/slices/cartSlice';
import Toast from 'react-native-toast-message';

type ProductType = {
  package_id: string;
  package_name: string;
  price: string | number;
  rating?: number;
  image?: string;
  ingredients?: { name: string; value: string }[];
  volume?: string;
  sub_category_id: string;
  sub_category_name: string;
};

type RouteParams = {
  product: ProductType;
};

const BuyNow = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { product } = route.params;
   const cartItems = useSelector(selectCartItems);

  // Normalize product fields
  const normalizedProduct = {
    id: product.package_id,
    name: product.package_name,
    price: Number(product.price),
    rating: product.rating || 0,
    image: product.image,
    ingredients: product.ingredients || [],
    volume: product.volume || '',
    subcategory_id: product.sub_category_id,
    subcategory_name: product.sub_category_name,
  };

  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const increaseQty = () => setQuantity(prev => prev + 1);
  const decreaseQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleContinue = () => {
  dispatch(
  addToCart({
    id: normalizedProduct.id,
    name: normalizedProduct.name,
    price: normalizedProduct.price,
    image: normalizedProduct.image,
    quantity,
    subcategory_id: normalizedProduct.subcategory_id,
    subcategory_name: normalizedProduct.subcategory_name,
  })
);

    Toast.show({
      type: 'success',
      text1: 'Added to Cart',
      text2: `${normalizedProduct.name} has been added to your cart`,
      position: 'top',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.container}>
        <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingBottom: 140 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 8 }}>
              <MaterialIcons name="arrow-back-ios" size={26} color="#000" />
            </TouchableOpacity>
            <View style={styles.header2}>
              <Text style={styles.title}>BUY NOW</Text>
            </View>
            <TouchableOpacity
  onPress={() => navigation.navigate('Cart')}
  style={{ marginLeft: 'auto', marginTop: 8 }}
>
  <View>
    <MaterialCommunityIcons name="cart-outline" size={26} color="#000" />
    
    {cartItems.length > 0 && (
      <View style={styles.cartBadge}>
        <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
      </View>
    )}
  </View>
</TouchableOpacity>

          </View>

          <View style={styles.productSection}>
            <View style={styles.productRow}>
              <View style={styles.imageContainer}>
                <Image
                  source={
                    normalizedProduct.image
                      ? { uri: `https://${normalizedProduct.image}` }
                      : require('../assets/images/banner.png')
                  }
                  style={styles.productImage}
                />
                {normalizedProduct.rating > 0 && (
                  <View style={styles.ratingBadge}>
                    <Icon name="star" size={12} color="#fff" />
                    <Text style={styles.ratingText}>{normalizedProduct.rating}</Text>
                  </View>
                )}
              </View>

              <View style={styles.productDetails}>
                <Text style={styles.productName}>{normalizedProduct.name}</Text>
                <Text style={styles.productPrice}>
                  ₹{normalizedProduct.price * quantity}
                </Text>

                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={decreaseQty} style={styles.quantityButton}>
                    <Icon name="remove" size={16} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>
                    {quantity.toString().padStart(2, '0')}
                  </Text>
                  <TouchableOpacity onPress={increaseQty} style={styles.quantityButton}>
                    <Icon name="add" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.ingredientsSection}>
            <Text style={styles.sectionTitle}>Ingredients:</Text>
            {normalizedProduct.ingredients.map((item, index) => (
              <View key={index} style={styles.ingredientRow}>
                <Text style={styles.ingredientName}>{item.name}</Text>
                <Text style={styles.ingredientValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.volumeSection}>
            <Text style={styles.volumeText}>
              Volume: <Text style={styles.volumeValue}>{normalizedProduct.volume}</Text>
            </Text>
          </View>
        </ScrollView>

        <View style={styles.fixedBottom}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueText}>ADD TO CART</Text>
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
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollArea: {
    flex: 1,
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
  productSection: {
    padding: 16,
  },
  productRow: {
    flexDirection: 'row',
    gap: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#000',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  productDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    lineHeight: 20,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#075E4D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  ingredientsSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  ingredientName: {
    fontSize: 14,
    color: '#666',
  },
  ingredientValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  volumeSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  volumeText: {
    fontSize: 14,
    color: '#666',
  },
  volumeValue: {
    fontWeight: 'bold',
    color: '#000',
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
    paddingHorizontal: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  continueText: {
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

  cartBadge: {
  position: 'absolute',
  right: -8,
  top: -5,
  backgroundColor: '#075E4D',
  borderRadius: 10,
  paddingHorizontal: 6,
  paddingVertical: 2,
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: 18,
},
cartBadgeText: {
  color: 'white',
  fontSize: 10,
  fontWeight: 'bold',
  textAlign: 'center',
},

});

export default BuyNow;
