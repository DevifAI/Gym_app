import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

const ProfileScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }} // Replace with actual image
          style={styles.avatar}
        />
        <View style={styles.nameSection}>
          <Text style={styles.name}>RAM KUMAR</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileButtonText}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card with Menu Options */}
      <View style={styles.card}>
        <MenuItem icon={require('../assets/images/cafe.png')} label="GYM Information" />
        <MenuItem icon={require('../assets/images/cafe.png')} label="Change Branch" />
        <MenuItem icon={require('../assets/images/cafe.png')} label="View Subscription" />
        <MenuItem icon={require('../assets/images/cafe.png')} label="Contact Us" />

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>⏻ Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const MenuItem = ({ icon, label }: { icon: any; label: string }) => (
  <TouchableOpacity style={styles.menuItem}>
    {/* <Image source={icon} style={styles.menuIcon} /> */}
    <Text style={styles.menuText}>{label}</Text>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  nameSection: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileButton: {
    backgroundColor: '#1bb184',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  profileButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  menuIcon: {
    height: 24,
    width: 24,
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  arrow: {
    fontSize: 20,
    color: '#999',
  },
  logoutButton: {
    alignItems: 'center',
    marginTop: 30,
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
