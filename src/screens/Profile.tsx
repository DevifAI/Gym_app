import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../redux/store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

// Define your navigation stack types
type RootStackParamList = {
  PaymentHistory: undefined;
  ViewSubscription: undefined;
  GymInfo: undefined;
  ContactUs: undefined;
  // Add other screens if needed
};

const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { userName, image } = useSelector((state: RootState) => state.auth);

  const avatarUrl = image || 'https://randomuser.me/api/portraits/men/1.jpg';
  const user = userName || 'Guest User';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <View style={styles.nameSection}>
            <Text style={styles.name}>{user}</Text>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.card}>
          <MenuItem icon="dumbbell" label="GYM Information" onPress={() => navigation.navigate('GymInfo')} />
          <MenuItem icon="card-account-details" label="View Subscription" onPress={() => navigation.navigate('ViewSubscription')} />
          <MenuItem icon="history" label="Payment History" onPress={() => navigation.navigate('PaymentHistory')} />
          <MenuItem icon="phone" label="Contact Us" onPress={() => navigation.navigate('ContactUs')} />

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={() => console.log('Logout pressed')}>
            <Icon name="logout" size={20} color="red" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

type MenuItemProps = {
  icon: string;
  label: string;
  onPress: () => void;
};

const MenuItem = ({ icon, label, onPress }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Icon name={icon} size={22} color="#075E4D" style={styles.menuIcon} />
    <Text style={styles.menuText}>{label}</Text>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
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
    backgroundColor: '#eee',
  },
  nameSection: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
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
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  arrow: {
    fontSize: 20,
    color: '#999',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  logoutText: {
    color: 'red',
    fontSize: 18,
  },
});

export default ProfileScreen;
