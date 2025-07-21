import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type RouteParams = {
  title: string;
  time: string;
  duration: string;
  price: number;
  bookedSlots: number; // out of 4
  description: string
};

const Booking = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {
    title,
    time,
    duration,
    price,
    bookedSlots,
    description
  } = route.params as RouteParams;

  const renderPeopleIcons = () => {
    return [...Array(4)].map((_, index) => (
      <MaterialIcons
        key={index}
        name="person"
        size={18}
        color={index < bookedSlots ? '#075E4D' : '#ccc'}
        style={{ marginRight: 2 }}
      />
    ));
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title.toUpperCase()}</Text>
        </View>

        {/* Card */}
        <View style={styles.container2}>
            <View style={styles.card}>
          <View style={styles.timeBox}>
            <Text style={styles.time}>{time}</Text>
            <Text style={styles.duration}>{duration}</Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.name}>{title}</Text>
            <Text style={styles.price}>₹{price}</Text>
            
          </View>

        <View style={styles.peopleRow}>{renderPeopleIcons()}</View>

        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.detailLabel}>Details:</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        </View>
      </ScrollView>

     {/* Fixed Bottom Button */}
            <View style={styles.fixedBottom}>
              <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('Payment',{ title , price , time , duration , bookedSlots, })} >
                <Text style={styles.continueText}>BUY NOW</Text>
                <View style={styles.arrowContainer}>
                  <MaterialCommunityIcons name="arrow-top-right" size={22} color="#084c3a" />
                </View>
              </TouchableOpacity>
            </View>
    </SafeAreaView>
  );
};

export default Booking;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
   safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 35,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  container2:{
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 14,
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 14,
    // marginBottom: 16,
  },
  timeBox: {
    backgroundColor: '#E3F5F0',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
   width: width * 0.24,
  },
  time: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#075E4D',
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  price: {
    marginTop:4,
    fontSize: 16,
    color: '#666',
  },
  peopleRow: {
    flexDirection: 'row',
    marginLeft: 8,
  },
 descriptionSection: {
  padding: 14,
  borderRadius: 14,
  borderTopWidth: 1,
  borderTopColor: '#ccc', // or any color you prefer
},

  detailLabel: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 18,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  bookNowContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  bookNowButton: {
    backgroundColor: '#00533D',
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookNowText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
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
    // paddingVertical: 8,
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
    textAlign: 'center'
  },
  arrowContainer: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 6,
    marginLeft: -32,
  },
});
