import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef<TextInput[]>([]);
  const [resendTimer, setResendTimer] = useState(60);

  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const email = route.params?.email || 'yourmail@gmail.com';
const phone = route.params?.phone || 'yourmail@gmail.com';
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (key: string, index: number) => {
    if (key === 'Backspace' && index > 0 && otp[index] === '') {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleContinue = () => {
    const isOtpComplete = otp.every((digit) => digit !== '');

    if (!isOtpComplete) {
      Toast.show({
        type: 'error',
        text1: 'Enter complete 4-digit OTP',
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'OTP Verified',
    });

    navigation.navigate('Login');
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      // Replace with actual resend OTP API call here
      Toast.show({
        type: 'success',
        text1: `OTP resent to ${phone}`,
      });

      setResendTimer(60); // Reset timer
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 8 }}>
                <Icon name="arrow-back-ios" size={26} color="#000" />
              </TouchableOpacity>

              <View style={styles.header2}>
                <Text style={styles.title}>OTP VERIFICATION</Text>
                <Text style={styles.subtitle}>
                  We’ve sent a 4-digit code to{'\n'}
                  {phone}
                </Text>
              </View>
            </View>

            <Image
              source={require('../assets/images/otpVerify.png')}
              style={styles.image}
              resizeMode="contain"
            />

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref!)}
                  style={styles.otpBox}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={({ nativeEvent }) => handleBackspace(nativeEvent.key, index)}
                />
              ))}
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueText}>CONTINUE</Text>
              <View style={styles.arrowContainer}>
                <MaterialCommunityIcons name="arrow-top-right" size={20} color="#084c3a" />
              </View>
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              {resendTimer > 0 ? (
                <Text style={styles.timerText}>Resend OTP in {resendTimer}s</Text>
              ) : (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OtpVerification;

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
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  header2: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  image: {
    width: width * 0.9,
    height: 160,
    alignSelf: 'center',
    marginBottom: 80,
    marginTop: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 5,
  },
  otpBox: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    borderColor: '#aaa',
    textAlign: 'center',
    fontSize: 20,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: '#084c3a',
    borderRadius: 30,
    height: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  continueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  arrowContainer: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 8,
    marginLeft: -32,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    color: '#084c3a',
    fontWeight: 'bold',
    fontSize: 14,
  },
  timerText: {
    color: '#999',
    fontSize: 14,
  },
});
