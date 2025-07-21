import React, { useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RootState } from '../redux/store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { logout, updateAddress } from '../redux/slices/authSlice';
import AddAddressModal from '../components/AddAddressModal';
import { useProfile } from '../hooks/useProfile';
import Toast from 'react-native-toast-message';

type RootStackParamList = {
  PaymentHistory: undefined;
  ViewSubscription: undefined;
  GymInfo: undefined;
  ContactUs: undefined;
  Login: undefined;
};

const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
const { updateUserAddress } = useProfile();

  const { userName, image, address ,userId } = useSelector((state: RootState) => state.auth);

  const [modalVisible, setModalVisible] = useState(false);
  const [addressData, setAddressData] = useState({
    address: address?.address || '',
    location: address?.location || '',
    country: address?.country || '',
    state: address?.state || '',
    city: address?.city || '',
    pin: address?.pin || '',
  });

  const hasAddress = address && Object.values(address).some((val) => val?.trim() !== '');

  const handleChange = (field: string, value: string) => {
    setAddressData((prev) => ({ ...prev, [field]: value }));
  };

const handleSave = async (data: typeof addressData) => {
  const payload = {
    member_id: userId ?? '', // Ensure member_id is never null
    address: data.address,
    location: data.location,
    country: data.country,
    state: data.state,
    city: data.city,
    pincode: data.pin,
  };

  const result : any = await updateUserAddress(payload);
  console.log("resutttttttttttt" , result)
  if (result.success) {
    setAddressData(data);
    setModalVisible(false);
  //  dispatch(updateAddress(data));
    Toast.show({
      type: 'success',
      text1: 'Address updated',
      text2: 'Your address was updated successfully',
      position: 'bottom',
    });
  } else {
    Toast.show({
      type: 'error',
      text1: 'Update failed',
      text2: result.message || 'Could not update address',
      position: 'bottom',
    });
  }
};


  const handleLogout = () => {
    dispatch(logout());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

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

            {hasAddress ? (
              <View style={styles.addressLineSection}>
                <Text style={styles.addressLine}>
                  {address?.address}, {address?.city}, {address?.state}
                </Text>
                <Text style={styles.addressLine}>
                  {address?.country} - {address?.pin}
                </Text>

                {/* <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
                  <MaterialIcons name="edit" size={18} color="#fff" />
                  <Text style={styles.editButtonText}>Edit Address</Text>
                </TouchableOpacity> */}
              </View>
            ) : (
              <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <MaterialIcons name="add-location-alt" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add Address</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.card}>
          <MenuItem icon="dumbbell" label="GYM Information" onPress={() => navigation.navigate('GymInfo')} />
          <MenuItem icon="card-account-details" label="View Subscription" onPress={() => navigation.navigate('ViewSubscription')} />
          <MenuItem icon="history" label="Payment History" onPress={() => navigation.navigate('PaymentHistory')} />
          <MenuItem icon="phone" label="Contact Us" onPress={() => navigation.navigate('ContactUs')} />

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={20} color="red" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <AddAddressModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSave}
          values={addressData}
          onChange={handleChange}
        />
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
    paddingTop:35,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  addressLineSection: {
    marginTop: 8,
  },
  addressLine: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#075E4D',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#075E4D',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
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
