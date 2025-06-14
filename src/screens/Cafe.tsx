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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const filters = ['Protein Shakes', 'Snacks', 'Detox & Hydrate', 'Dry Fruits'];

const products = [
  {
    id: '1',
    name: 'Whey Concentrate',
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
    name: 'Muscle Builder',
    price: 599,
    rating: 4.8,
    image: require('../assets/images/cafeItem2.png'),
    volume: '300ml',
    ingredients: [
      { name: 'Banana', value: '1 piece' },
      { name: 'Peanut Butter', value: '2 tbsp' },
    ],
  },
  {
    id: '4',
    name: 'Super Shake',
    price: 549,
    rating: 4.7,
    image: require('../assets/images/cafeItem1.png'),
    volume: '180ml',
    ingredients: [
      { name: 'Whey', value: '20g' },
      { name: 'Cocoa', value: '1 tbsp' },
    ],
  },
  {
    id: '5',
    name: 'Recovery Shake',
    price: 579,
    rating: 4.6,
    image: require('../assets/images/cafeItem1.png'),
    volume: '220ml',
    ingredients: [
      { name: 'Carbs', value: '35g' },
      { name: 'Electrolytes', value: '100mg' },
    ],
  },
  {
    id: '6',
    name: 'Vegan Protein',
    price: 499,
    rating: 4.5,
    image: require('../assets/images/cafeItem2.png'),
    volume: '200ml',
    ingredients: [
      { name: 'Pea Protein', value: '20g' },
      { name: 'Almond Milk', value: '200ml' },
    ],
  },
   {
    id: '7',
    name: 'Vegan Protein',
    price: 499,
    rating: 4.5,
    image: require('../assets/images/cafeItem2.png'),
    volume: '200ml',
    ingredients: [
      { name: 'Pea Protein', value: '20g' },
      { name: 'Almond Milk', value: '200ml' },
    ],
  },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const Cafe = () => {
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState('Protein Shakes');

  const renderFilter = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => setActiveFilter(item)}
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
      onPress={() => navigation.navigate('Buynow', { ...item })}
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
      <FlatList
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>CAFE</Text>
              <View style={styles.bellContainer}>
                <Icon name="search" size={24} />
              </View>
            </View>

            {/* Filter */}
            <View style={{ marginHorizontal: -16 }}>
              <FlatList
                data={filters}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderFilter}
                keyExtractor={(item) => item}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                style={styles.filterList}
              />
            </View>
          </>
        }
        data={products}
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
          paddingBottom: 100,
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
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: 10,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  bellContainer: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 50,
  },
  filterList: {
    marginBottom: 16,
  },
  filterBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilterBtn: {
    backgroundColor: '#075E4D',
    borderColor: '#075E4D',
  },
  filterText: {
    fontSize: 16,
    color: '#333',
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
