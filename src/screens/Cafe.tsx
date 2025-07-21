import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useProduct } from '../hooks/useProduct'; // Ensure the path is correct
import { selectCartItems } from '../redux/slices/cartSlice';
import { useSelector } from 'react-redux';
// Example: using cart context/hook (adjust this to your setup)


const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const Cafe = () => {
  const navigation = useNavigation<any>();
  const { products, loading, error, message } = useProduct();

  const [activeFilter, setActiveFilter] = useState('');
  const [searchText, setSearchText] = useState('');
   const cartItems = useSelector(selectCartItems);

  // ✅ Dynamic filters based on sub_category_name
  const filters = Array.from(
    new Set(products.map((item) => item.sub_category_name).filter(Boolean))
  );

  const filteredProducts = products.filter((item) => {
    const nameMatch = item.package_name.toLowerCase().includes(searchText.toLowerCase());
    const categoryMatch = activeFilter === '' || item.sub_category_name === activeFilter;
    return nameMatch && categoryMatch;
  });

  const renderFilter = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => setActiveFilter(item === activeFilter ? '' : item)}
      style={[
        styles.filterBtn,
        activeFilter === item && styles.activeFilterBtn,
      ]}
    >
      <Text
        style={[
          styles.filterText,
          activeFilter === item && styles.activeFilterText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('Buynow', {
          product: item,
        })
      }
    >
      <View style={styles.imageContainer}>
        <Image
          source={
            item.image
              ? { uri: `https://${item.image}` }
              : require('../assets/images/dummyProduct.png')
          }
          style={styles.image}
        />
        {item.rating && (
          <View style={styles.rating}>
            <Icon name="star" size={12} color="#fff" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.productTitle}>{item.package_name}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.productPrice}>₹{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#075E4D" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loaderContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.topBar}>
              <View style={styles.searchBar}>
                <Icon name="search" size={20} color="#888" style={{ marginRight: 8 }} />
                <TextInput
                  placeholder="Search products"
                  placeholderTextColor="#aaa"
                  value={searchText}
                  onChangeText={setSearchText}
                  style={styles.searchInput}
                />
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

            <FlatList
              data={filters}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderFilter}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.filterList}
            />

            {filteredProducts.length < 0 && message ? (
              <View style={styles.messageContainer}>
                <Text style={styles.messageText}>{message}</Text>
              </View>
            ) : null}
          </>
        }
        data={filteredProducts}
        keyExtractor={(item) => item.package_id}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 35,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 46,
    flex: 1,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  filterList: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  filterBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: '#fff',
    marginRight: 10,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  activeFilterBtn: {
    backgroundColor: '#075E4D',
    borderColor: '#075E4D',
  },
  filterText: {
    fontSize: 15,
    color: '#555',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.35,
    borderRadius: 12,
    borderColor: '#075E4D',
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  image: {
    width: '90%',
    height: CARD_WIDTH * 0.8,
    resizeMode: 'cover',
    borderRadius: 15,
  },
  rating: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    backgroundColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  productTitle: {
    fontSize: 14,
    marginTop: 4,
    color: '#333',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#075E4D',
  },
  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  messageText: {
    color: '#075E4D',
    fontSize: 14,
    textAlign: 'center',
  },
  cartBadge: {
  position: 'absolute',
  right: -6,
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

export default Cafe;
