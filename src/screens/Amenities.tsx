import { useNavigation } from '@react-navigation/native';
import React from 'react';
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
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAmenity } from '../hooks/useAmenity'; // Adjust path as needed

const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / 4;

import poolImg from '../assets/images/pool.png';
import spaImg from '../assets/images/spa.png';
import massageImg from '../assets/images/massage.png';
import zumbaImg from '../assets/images/progress.png';

const imageMap: { [key: string]: ImageSourcePropType } = {
  Pool: poolImg,
  Spa: spaImg,
  Massage: massageImg,
  Zumba: zumbaImg,
};

const defaultImage = poolImg;


const Amenities = () => {
  const navigation = useNavigation<any>();
  const { amenities, loading, error } = useAmenity();

  const renderAmenityImage = (name: string) => {
    return imageMap[name] || defaultImage;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>AMENITIES</Text>
        <TouchableOpacity style={styles.bellContainer}>
          <Icon name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.gridContainer}>
          {amenities.map((item) => (
            <TouchableOpacity
              key={item.sub_category_id}
              style={styles.gridItem}
              onPress={() =>
                navigation.navigate('SlotBook', { title: item.sub_category_name , id: item.sub_category_id })
              }
            >
              <View style={styles.iconCircle}>
                <Image
                  source={renderAmenityImage(item.sub_category_name)}
                  style={styles.iconImage}
                />
              </View>
              <Text style={styles.itemLabel}>{item.sub_category_name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
    marginTop: 12,
    paddingVertical: 16,
    justifyContent: 'flex-start',
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
    fontWeight: 'bold',
  },
});

export default Amenities;
