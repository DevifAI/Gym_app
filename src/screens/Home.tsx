import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useBooking } from '../hooks/useBooking';
import { useNavigation } from '@react-navigation/native';
import SubscriptionExpiryModal from '../modal/SubscriptionExpiry';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [expiryModal, setExpiryModal] = useState(false);
  const navigation = useNavigation<any>();

    useEffect(() => {
  changeNavigationBarColor('#ffffff', true); // true for light buttons/icons
}, []);

const services = [
  { label: 'Product', icon: require('../assets/images/cafe.png'), screen: 'Cafe' },
  { label: 'Amenities', icon: require('../assets/images/gym.png'), screen: 'Aminities' },
  { label: 'Progress', icon: require('../assets/images/progress.png'), screen: 'ProgressScreen' },
  { label: 'Subscription', icon: require('../assets/images/payment.png'), screen: 'Subscription' },
];

      const {userName} = useSelector((state: RootState) => state.auth);
        const {
    getBookingList,
    bookingList,
    loading,
    error,
    bookingMessage
  } = useBooking();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        await getBookingList();
      } catch (err) {
        console.error(err)
      }
    };

    fetchBookings();
  }, []);

    const renderActivityStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { text: 'Completed', color: 'green' };
      case 'cancelled':
        return { text: 'Cancelled', color: 'red' };
      case 'upcoming':
        return { text: 'Upcoming', color: '#3567FF' };
      default:
        return { text: status, color: 'gray' };
    }
  };

  const getActivityIcon = (subCategory: string) => {
    switch (subCategory.toLowerCase()) {
      case 'pool':
        return require('../assets/images/pool.png');
      case 'spa':
        return require('../assets/images/spa.png');
      case 'massage':
        return require('../assets/images/pool.png');
      default:
        return require('../assets/images/pool.png');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar 
  backgroundColor="#ffff" // Dark green background
  barStyle="dark-content"  // Light icons/text
/>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>HI, {userName}</Text>
              <Text style={styles.subText}>Aenean vulputate</Text>
            </View>
          </View>
          {/* <View style={styles.bellContainer}>
            <Icon name="bell-outline" size={20} color="#000" />
          </View> */}
        </View>

        {/* Banner */}
        <Image
          source={require('../assets/images/banner.png')}
          style={styles.banner}
          resizeMode="cover"
        />

        {/* Services */}
      <View style={styles.servicesContainer}>
  {services.map((service, index) => (
    <View key={index} style={styles.Item}>
      <TouchableOpacity
        style={styles.serviceItem}
        onPress={() => navigation.navigate(service.screen)}
      >
        <Image source={service.icon} style={styles.serviceIcon} />
      </TouchableOpacity>
      <View style={styles.labelContainer}>
        <Text style={styles.serviceLabel}>{service.label}</Text>
      </View>
    </View>
  ))}
</View>


        {/* Upcoming Activity */}
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>RECENT ACTIVITIES</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Activities')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Activity Cards */}
         {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={styles.messageContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Empty State */}
        {!loading && !error && (!bookingList || bookingList.length === 0) && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
              {bookingMessage || 'No bookings found'}
            </Text>
          </View>
        )}

        {/* Activity Cards */}
        {!loading && !error && bookingList && bookingList.length > 0 && (
          <>
            {/* {bookingMessage && (
              <Text style={styles.successMessage}>{bookingMessage}</Text>
            )} */}
            {bookingList.map((booking: any, index: number) => {
              const status = renderActivityStatus(booking.booking_status || booking.status);
              return (
                <View
                  key={index}
                  style={[
                    styles.activityCard,
                    status.color === 'green' && { borderColor: 'green', borderWidth: 1 }
                  ]}
                >
                  <View style={styles.activityIconContainer}>
                    <Image 
                      source={getActivityIcon(booking.sub_category_name)} 
                      style={styles.activityIcon} 
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.activityName}>{booking.sub_category_name}</Text>
                    <View style={styles.timeRow}>
                      <Icon name="clock-outline" size={16} color="#555" />
                      <Text style={styles.activityTime}>
  {`${booking.booking_date}\n${booking.booking_time}`}
</Text>
                    </View>
                  </View>
                  <Text style={[styles.status, { color: status.color }]}>
                    {status.text}
                  </Text>
                </View>
              );
            })}
          </>
        )}

        <SubscriptionExpiryModal
  visible={expiryModal}
  onClose={() => setExpiryModal(false)}
  onRenew={() => {
    setExpiryModal(false);
    navigation.navigate('Subscription');
  }}
  subscriptions={[
    { name: 'Pool :', daysLeft: 3 },
    { name: 'Massage :', daysLeft: 1 },
  ]}
/>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:20,
    // paddingBottom:80,
  },
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  greeting: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  subText: {
    fontSize: 14,
    color: '#888',
  },
  bellContainer: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 20,
  },
  banner: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 20,
  },
  servicesContainer: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between', 
    marginBottom: 20,
    width: '100%',
  },
  serviceItem: {
     backgroundColor: '#eee',
    justifyContent:'center',
    paddingVertical:12,
    paddingHorizontal:14,
    borderRadius:50,
  
  
  },
    Item: {
    flexDirection:'column',
    alignItems: 'center',
    justifyContent:'flex-start',
    gap:4,

  width:80,
  height:100
  },
  serviceIcon: {
    width: 32,
    height:32,
    marginBottom: 2,
  },
  labelContainer:{
     flex:1,
    alignItems: 'center',
    justifyContent:'center',
  },
  serviceLabel: {
    fontSize: 14,
    color: '#000',
    textAlign:'center',
     fontWeight: '600',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  viewAll: {
    color: '#666666',
    fontSize: 16,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  activityIcon: {
    width: 35,
    height: 35,
    
    resizeMode:'contain'
    //    borderWidth: 1,       
  // borderColor: 'red',
  },
  activityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft:4
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  activityIconContainer:{
    flexDirection:'row',
   justifyContent: 'center',
  alignItems: 'center',
  padding:8,
  borderRadius:2,
  backgroundColor: 'white',
  marginRight: 12,
  },
  activityTime: {
    marginLeft: 4,
    fontSize: 13,
    color: '#666',
  },
  status: {
    fontWeight: 'bold',
    fontSize: 14,
  },

   loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  messageText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  successMessage: {
    color: 'green',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
});
