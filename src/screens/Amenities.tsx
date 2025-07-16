import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAmenity } from '../hooks/useAmenity';
import { useSubscription } from '../hooks/useSubscription';

const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / 4;

// Replace with actual asset imports
import poolImg from '../assets/images/pool.png';
import spaImg from '../assets/images/spa.png';
import zumbaImg from '../assets/images/progress.png';

const imageMap: { [key: string]: ImageSourcePropType } = {
  Pool: poolImg,
  Spa: spaImg,
  Massage: poolImg,
  Zumba: zumbaImg,
};

const defaultImage = poolImg;

const Amenities = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { amenities, loading: loadingAmenity, error } = useAmenity();
  const {
    subscriptions,
    loading: loadingSubscription,
    getActiveSubscription,
  } = useSubscription();

  useEffect(() => {
    if (route.name === 'Subscription') {
      getActiveSubscription();
    }
  }, [route.name]);

  const renderAmenityImage = (name: string) => {
    return imageMap[name] || defaultImage;
  };

  const displayItems =
    route.name === 'Subscription' ? subscriptions : amenities;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {route.name === 'Subscription' ? 'SUBSCRIPTION' : 'AMENITIES'}
        </Text>
      </View>

      {(loadingAmenity || loadingSubscription) ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.gridContainer}>
          {displayItems.map((item) => (
            <TouchableOpacity
              key={
                route.name === 'Subscription'
                  ? item.sub_category_id || item.category_name
                  : item.sub_category_id
              }
              style={styles.gridItem}
              onPress={() => {
                route.name === 'Subscription'
                  ? navigation.navigate('SubscriptionList' , {
                    id: item.sub_category_id,
                  })
                  : navigation.navigate('SlotBook', {
                      title: item.sub_category_name,
                      id: item.sub_category_id,
                    });
              }}
            >
              <View style={styles.iconCircle}>
                <Image
                  source={renderAmenityImage(
                    route.name === 'Subscription'
                      ? item.sub_category_name
                      : item.sub_category_name
                  )}
                  style={styles.iconImage}
                />
              </View>
              <Text style={styles.itemLabel}>
                {item.sub_category_name}
              </Text>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 1,
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
