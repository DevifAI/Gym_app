import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAmenity } from '../hooks/useAmenity';

type RootStackParamList = {
  SlotBook: { title: string; id: string };
};

const SlotBook = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'SlotBook'>>();
  const Title = route.params.title.toUpperCase();
  const { bookAmenityById, getPackages } = useAmenity();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);
  const [packagesStatus, setPackagesStatus] = useState<boolean>(true);
  const [loadingPackages, setLoadingPackages] = useState<boolean>(true);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  type AmenityBookingPayload = {
    sub_category_id: string;
    booking_date: string;
    booking_time: string;
  };

  useEffect(() => {
  const fetchPackages = async () => {
    setLoadingPackages(true);
    const res = await getPackages(route.params.id);

    if (!res.success) {
      setPackagesStatus(false);
      setPackages([]);
      setErrorMessage(res.message || 'Something went wrong'); // 👈 store message
    } else {
      setPackagesStatus(true);
      setPackages(res.data || []);
    }

    setLoadingPackages(false);
  };
    fetchPackages();
  }, []);

  const handleBookAmenity = async (): Promise<void> => {
    setLoadingButton(true);
    const payload: AmenityBookingPayload = {
      sub_category_id: route.params.id,
      booking_date: selectedDate.toISOString().split('T')[0],
      booking_time: formatTime(selectedTime),
    };

    const res = await bookAmenityById({ payload });
    setLoadingButton(false);

    if (!res.success) {
      Alert.alert(res.message || 'Booking failed.');
      return;
    }

    const data = res;

    console.log("dataaaaaaaaaaaaa" , data)
    if (data?.data?.is_available) {
      if (data?.data?.is_free) {
        navigation.navigate('PaymentSuccess', {
          type: 'free',
          message: res.message,
          details: data.data?.booking_details,
        });
      } else if (data?.data?.is_paid) {
        navigation.navigate('Payment', {
          type: 'paid',
          message: res.message,
          payload,
        });
      }
    } else {
      Alert.alert('Selected slot is not available.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>{Title}</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Date Picker */}
        <TouchableOpacity style={styles.inputBox} onPress={() => setShowDatePicker(true)}>
          <MaterialIcons name="calendar-today" size={20} color="#075E4D" />
          <Text style={styles.inputText}>Date</Text>
          <Text style={styles.inputValue}>{formatDate(selectedDate)}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#075E4D" />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, date) => {
              if (date) setSelectedDate(date);
              setShowDatePicker(false);
            }}
          />
        )}

        {/* Time Picker */}
        <TouchableOpacity style={styles.inputBox} onPress={() => setShowTimePicker(true)}>
          <MaterialIcons name="schedule" size={20} color="#075E4D" />
          <Text style={styles.inputText}>Time</Text>
          <Text style={styles.inputValue}>{formatTime(selectedTime)}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#075E4D" />
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="spinner"
            onChange={(_, time) => {
              if (time) setSelectedTime(time);
              setShowTimePicker(false);
            }}
          />
        )}

        {/* Packages */}
{loadingPackages ? (
  <ActivityIndicator size="large" color="#075E4D" style={{ marginTop: 30 }} />
) : !packagesStatus ? (
  <Text style={{ textAlign: 'center', color: '#888', marginTop: 30, fontSize: 16 }}>
    {errorMessage}
  </Text>
) : (
  packages.map((item, index) => {
    const isSelected = selectedPackageId === item.package_id;

    return (
      <View
        key={index}
        style={[styles.card, isSelected && styles.cardSelected]}
      >
        <View style={styles.info}>
          <Text style={[styles.name, isSelected && styles.nameSelected]}>
            {item.package_name}
          </Text>
          <Text style={[styles.price, isSelected && styles.priceSelected]}>
            ₹{item.price}
          </Text>
          {item.valid_for && (
            <Text style={[styles.price, { fontSize: 12 }]}>
              Valid for {item.valid_for} {item.valid_for === '1' ? 'month' : 'months'}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            setSelectedPackageId(isSelected ? null : item.package_id)
          }
        >
          {isSelected ? (
            <MaterialIcons name="check-circle" size={26} color="#075E4D" />
          ) : (
            <MaterialIcons name="add-circle-outline" size={26} color="#666" />
          )}
        </TouchableOpacity>
      </View>
    );
  })
)}


        {/* Book Button */}
        <View style={styles.fixedBottom}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleBookAmenity}
            disabled={loadingButton}
          >
            {loadingButton ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.continueText}>CHECK AVAILABILITY</Text>
                <View style={styles.arrowContainer}>
                  <MaterialCommunityIcons name="arrow-top-right" size={22} color="#084c3a" />
                </View>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 35,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  inputBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputText: {
    color: '#001',
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10,
    fontSize: 16,
  },
  inputValue: {
    flex: 1,
    color: '#444',
    fontSize: 14,
  },
card: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F9F9F9',
  borderRadius: 16,
  padding: 16,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: '#ddd',
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  justifyContent: 'space-between',
},

cardSelected: {
  borderColor: '#075E4D',
  backgroundColor: '#E6F5F2',
},

info: {
  flex: 1,
},

name: {
  fontSize: 16,
  fontWeight: '600',
  color: '#222',
},

nameSelected: {
  color: '#075E4D',
},

price: {
  marginTop: 4,
  fontSize: 14,
  color: '#666',
},

priceSelected: {
  color: '#084C3A',
},

iconButton: {
  paddingLeft: 12,
},


  fixedBottom: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: '#075E4D',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  arrowContainer: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 6,
    marginLeft: 12,
  },
});

export default SlotBook;
