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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const filters = ['Protein Shakes', 'Snacks', 'Detox & Hydrate', 'Dry Fruits'];

const products = [
  {
    id: '1',
    name: 'Whey Concentrate',
    category: 'Protein Shakes',
    price: 499,
    rating: 4.9,
    image: require('../assets/images/cafeItem1.png'),
    volume: '200ml',
    ingredients: [
      { name: 'Protein', value: '25g' },
      { name: 'Milk', value: '200ml' },
    ],
  },
  {
    id: '2',
    name: 'Protein Focused',
    category: 'Protein Shakes',
    price: 499,
    rating: 4.9,
    image: require('../assets/images/cafeItem2.png'),
    volume: '250ml',
    ingredients: [
      { name: 'Almonds', value: '10g' },
      { name: 'Honey', value: '1 tsp' },
    ],
  },
  {
    id: '3',
    name: 'Almond Cookies',
    category: 'Snacks',
    price: 199,
    rating: 4.5,
    image: require('../assets/images/cafeItem2.png'),
    volume: '100g',
    ingredients: [
      { name: 'Almond', value: '15g' },
    ],
  },
  {
    id: '4',
    name: 'Detox Water',
    category: 'Detox & Hydrate',
    price: 149,
    rating: 4.7,
    image: require('../assets/images/cafeItem1.png'),
    volume: '500ml',
    ingredients: [
      { name: 'Lemon', value: '1 slice' },
    ],
  },
  {
    id: '5',
    name: 'Cashew Pack',
    category: 'Dry Fruits',
    price: 299,
    rating: 4.4,
    image: require('../assets/images/cafeItem2.png'),
    volume: '150g',
    ingredients: [
      { name: 'Cashew', value: '100g' },
    ],
  },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const Cafe = () => {
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState('');
  const [searchText, setSearchText] = useState('');

  const filteredProducts = products.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(searchText.toLowerCase());
    const categoryMatch = activeFilter === '' || item.category === activeFilter;
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
          id: item.id,
          image: item.image,
          name: item.name,
          price: item.price,
          rating: item.rating,
          volume: item.volume,
          ingredients: item.ingredients,
        })
      }
    >
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.rating}>
          <Icon name="star" size={12} color="#fff" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      <Text style={styles.productTitle}>{item.name}</Text>
      <Text style={styles.productPrice}>₹{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.topBar}>
                {/* <Text style={}>BUY NOW</Text> */}
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
                          <MaterialCommunityIcons name="cart-outline" size={26} color="#000" />
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
          </>
        }
        data={filteredProducts}
        keyExtractor={(item) => item.id}
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
  cartIcon: {
    padding: 8,
    backgroundColor: '#f1f1f1',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
    width: 46,
    elevation: 2,
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
    height: CARD_WIDTH * 1.3,
    borderRadius: 12,
    borderColor: '#075E4D',
    borderWidth: 1,
    overflow: 'hidden',
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
  productTitle: {
    fontSize: 16,
    marginTop: 4,
    paddingHorizontal: 8,
    marginLeft: 6,
  },
  productPrice: {
    fontSize: 16,
    paddingHorizontal: 8,
    marginBottom: 8,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default Cafe;
