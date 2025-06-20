import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type Amenity = {
  id: number;
  name: string;
  icon: ImageSourcePropType;
};

const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / 4;

const Amenities = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
const navigation = useNavigation<any>()
  useEffect(() => {
    const data: Amenity[] = [
      { id: 1, name: 'Pool', icon: require('../assets/images/pool.png') },
      { id: 2, name: 'Spa', icon: require('../assets/images/spa.png') },
      { id: 3, name: 'Massage', icon: require('../assets/images/massage.png') },
      { id: 4, name: 'Zumba', icon: require('../assets/images/progress.png') },
    ];
    setAmenities(data);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
          <StatusBar 
        backgroundColor="#ffff" // Dark green background
        barStyle="dark-content"  // Light icons/text
      />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>AMENITIES</Text>
        <TouchableOpacity style={styles.bellContainer}>
          <Icon name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {amenities.map((item) => (
           <TouchableOpacity
          key={item.id}
          style={styles.gridItem}
         onPress={() => navigation.navigate('SlotBook', { title: item.name })}
        >
          <View style={styles.iconCircle}>
            <Image source={item.icon} style={styles.iconImage} />
          </View>
          <Text style={styles.itemLabel}>{item.name}</Text>
        </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
 safeArea: {
    flex: 1,
    backgroundColor: '#fff',
     paddingTop: 35,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    // paddingVertical: 16,
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop:12,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  gridItem: {
    width: itemWidth,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  itemLabel: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    textTransform: 'capitalize',
    fontWeight:'bold',
  },
});

export default Amenities;
