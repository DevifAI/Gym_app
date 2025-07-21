import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Input from '../components/Input';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import { useAuth } from '../hooks/useAuth';

const { width } = Dimensions.get('window');

const formatDateToYYYYMMDD = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const Register = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigation = useNavigation<any>();
  const { registerUser, loading } = useAuth();

const validate = () => {
  const phoneRegex = /^\d{10}$/;

  if (!name || !phone) {
    Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill out all required fields' });
    return false;
  }

  if (!phoneRegex.test(phone)) {
    Toast.show({ type: 'error', text1: 'Invalid Phone', text2: 'Phone number must be 10 digits' });
    return false;
  }

  return true;
};


  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = formatDateToYYYYMMDD(selectedDate);
      setDob(formattedDate);
    }
  };

  const handleRegister = async () => {
    if (!validate()) return;

    const userData = {
      name,
      phone,
      email,
      dob,
    };

    const result = await registerUser(userData);

    if (result.success) {
      Toast.show({ type: 'success', text1: 'Success', text2: 'Registered successfully!' });
      navigation.navigate('OtpVerify', {
  phone,
  email,
});
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: 35 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.title}>CREATE ACCOUNT</Text>
            <Text style={styles.subtitle}>Fill in your details to register</Text>

            <Input label="Full Name" value={name} onChangeText={setName} />

            <Input
              label="Phone Number"
              value={phone}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, '');
                if (cleaned.length <= 10) {
                  setPhone(cleaned);
                }
              }}
              keyboardType="phone-pad"
            />

            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
  <Input
    label="Date of Birth"
    value={dob}
    editable={false}
    pointerEvents="none"
    onChangeText={() => {}} // required but unused
  />
</TouchableOpacity>


            {showDatePicker && (
              <DateTimePicker
                value={dob ? new Date(dob) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            )}

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerText}>
                {loading ? 'REGISTERING...' : 'REGISTER'}
              </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                  Sign In
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  registerButton: {
    backgroundColor: '#084c3a',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#000',
  },
  loginLink: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});
