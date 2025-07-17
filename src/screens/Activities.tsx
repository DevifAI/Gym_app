import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useBooking } from '../hooks/useBooking';

const ActivitiesScreen = () => {
  const navigation = useNavigation<any>();

  const {
    getBookingList,
    bookingList,
    loading,
    error,
    bookingMessage,
  } = useBooking();

  useEffect(() => {
    getBookingList();
  }, []);

  const renderActivityStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return { text: 'Completed', color: 'green' };
      case 'cancelled':
        return { text: 'Cancelled', color: 'red' };
      case 'upcoming':
        return { text: 'Upcoming', color: '#3567FF' };
      default:
        return { text: status || 'Unknown', color: 'gray' };
    }
  };

  const getActivityIcon = (subCategory: string) => {
    switch (subCategory?.toLowerCase()) {
      case 'pool':
        return require('../assets/images/pool.png');
      case 'spa':
        return require('../assets/images/spa.png');
      case 'massage':
        return require('../assets/images/massage.png');
      default:
        return require('../assets/images/pool.png');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header with Back Button */}
               <View style={styles.header}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back-ios" size={26} color="#000" />
                  </TouchableOpacity>
                  <Text style={styles.headerTitle}>ACTIVITIES</Text>
                </View>

        {/* Loading */}
        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}

        {/* Error */}
        {error && (
          <View style={styles.messageContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Empty State */}
        {!loading && !error && bookingList?.length === 0 && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
              {bookingMessage || 'No bookings found'}
            </Text>
          </View>
        )}

        {/* Activities List */}
        {!loading &&
          !error &&
          bookingList &&
          bookingList.map((booking: any, index: number) => {
            const status = renderActivityStatus(
              booking.booking_status || booking.status
            );
            return (
              <View
                key={index}
                style={[
                  styles.card,
                  status.color === 'green' && {
                    borderColor: 'green',
                    borderWidth: 1,
                  },
                ]}
              >
                <View style={styles.iconWrapper}>
                  <Image
                    source={getActivityIcon(booking.sub_category_name)}
                    style={styles.icon}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{booking.sub_category_name}</Text>
                  <View style={styles.timeRow}>
                    <Icon name="clock-outline" size={16} color="#555" />
                    <Text style={styles.time}>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default ActivitiesScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  container: {
    padding: 20,
    paddingBottom: 100,
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
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  messageContainer: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  iconWrapper: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6,
    marginRight: 12,
  },
  icon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  time: {
    marginLeft: 4,
    fontSize: 13,
    color: '#666',
  },
  status: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});
