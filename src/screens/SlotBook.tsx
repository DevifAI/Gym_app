import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  SlotBook: { title: string };
};

type MassageOption = {
  time: string;
  duration: string;
  title: string;
  price: number;
  bookedSlots: number; // max is 4
  description: string;
};

const massageOptions: MassageOption[] = [
  {
    time: '7:00 AM',
    duration: '30 min',
    title: 'Thai Massage',
    price: 999,
    bookedSlots: 2,
    description: 'This massage helps reduce tension and promote relaxation...',
  },
  {
    time: '7:00 PM',
    duration: '30 min',
    title: 'Ayurvedic Massage',
    price: 999,
    bookedSlots: 3,
    description: 'Ayurvedic massage improves blood circulation and vitality...',
  },
];


const SlotBook = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'SlotBook'>>();
 const Title = route.params.title.toUpperCase();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#075E4D"/>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display='spinner'
            onChange={(_, time) => {
              if (time) setSelectedTime(time);
              setShowTimePicker(false);
            }}
          />
        )}

        {/* Massage Options */}
        {massageOptions.map((item, index) => {
  const totalSlots = 4;
  const booked = item.bookedSlots;
  const available = totalSlots - booked;

  return (
    <TouchableOpacity
      key={index}
      onPress={() => navigation.navigate('Booking', { ...item })}
      activeOpacity={0.8}
      style={styles.card}
    >
      <View style={styles.timeBox}>
        <Text style={styles.time}>{item.time}</Text>
        <Text style={styles.duration}>{item.duration}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.title}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
      </View>
      <View style={styles.peopleIconRow}>
        {[...Array(booked)].map((_, i) => (
          <MaterialIcons key={`b-${i}`} name="person" size={18} color="#075E4D" />
        ))}
        {[...Array(available)].map((_, i) => (
          <MaterialIcons key={`a-${i}`} name="person" size={18} color="#999" />
        ))}
      </View>
    </TouchableOpacity>
  );
  })}
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
    paddingHorizontal: 16,
    paddingBottom: 30,
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
    color:"#001",
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10,
    fontSize:16,
  },
  inputValue: {
    flex: 1,
    color: '#444',
     fontSize:14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
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
    fontSize: 16,
    color: '#333',
  },
  duration: {
    fontSize: 12,
    color: '#666',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    marginTop:4,
    fontSize: 14,
    color: '#666',
  },
  peopleIconRow: {
    flexDirection: 'row',
    gap: 1,
  },
});

export default SlotBook;
