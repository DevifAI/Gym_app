import React from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const activities = [
    {
      name: 'Pool',
      time: '5 Apr 2025 5:00pm',
      status: 'Confirmed',
      color: 'green',
      icon: require('../assets/images/pool.png'),
    },
    {
      name: 'Spa',
      time: '5 Apr 2025 5:00pm',
      status: 'Cancelled',
      color: 'red',
      icon: require('../assets/images/spa.png'),
    },
    {
      name: 'Massage',
      time: '23 May 2025 4:00pm',
      status: 'Pending',
      color: 'blue',
      icon: require('../assets/images/massage.png'),
    },
     {
      name: 'Massage',
      time: '23 May 2025 4:00pm',
      status: 'Pending',
      color: 'blue',
      icon: require('../assets/images/massage.png'),
    },
    {
      name: 'Spa',
      time: '5 Apr 2025 5:00pm',
      status: 'Cancelled',
      color: 'red',
      icon: require('../assets/images/spa.png'),
    },
  ];

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
              <Text style={styles.greeting}>HI, RAM KUMAR</Text>
              <Text style={styles.subText}>Aenean vulputate</Text>
            </View>
          </View>
          <View style={styles.bellContainer}>
            <Icon name="bell-outline" size={20} color="#000" />
          </View>
        </View>

        {/* Banner */}
        <Image
          source={require('../assets/images/banner.png')}
          style={styles.banner}
          resizeMode="cover"
        />

        {/* Services */}
        <View style={styles.servicesContainer}>
          {[
            { label: 'Cafe', icon: require('../assets/images/cafe.png') },
            { label: 'Amenities', icon: require('../assets/images/gym.png') },
            { label: 'Progress', icon: require('../assets/images/progress.png') },
            { label: 'Payment History', icon: require('../assets/images/payment.png') },
          ].map((service, index) => (
            <View style={styles.Item}>
            <TouchableOpacity key={index} style={styles.serviceItem}>
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
          <Text style={styles.activityTitle}>UPCOMING ACTIVITY</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Activity Cards */}
        {activities.map((activity, index) => (
          <View
            key={index}
            style={[styles.activityCard, activity.status === 'Confirmed' && { borderColor: 'green', borderWidth: 1 }]}
          >
            <View style={styles.activityIconContainer} >
               <Image source={activity.icon} style={styles.activityIcon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activityName}>{activity.name}</Text>
              <View style={styles.timeRow}>
                <Icon name="clock-outline" size={16} color="#555" />
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
            <Text style={[styles.status, { color: activity.color }]}>{activity.status}</Text>
          </View>
        ))}
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
  height:120
  },
  serviceIcon: {
    width: 38,
    height:38,
    marginBottom: 6,
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
});
