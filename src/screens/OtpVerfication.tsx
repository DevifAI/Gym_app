import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
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
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<TextInput[]>([]);
   const navigation = useNavigation<any>();
  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleBackspace = (key: string, index: number) => {
    if (key === 'Backspace' && index > 0 && otp[index] === '') {
      inputs.current[index - 1].focus();
    }
  };
  const handleContinue = () => {
  const isOtpComplete = otp.every((digit) => digit !== '');

  if (!isOtpComplete) {
    Alert.alert('Please enter the complete 6-digit OTP');
    return;
  }

  // You can validate OTP from API here

  navigation.navigate('CreateNewPassword');
};


  return (
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
            We’ve sent a 6-digit code to{'\n'}yourmail@gmail.com
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

          <TouchableOpacity style={styles.continueButton}  onPress={handleContinue}>
            <Text style={styles.continueText}>CONTINUE</Text>
            <View style={styles.arrowContainer}>
              <MaterialCommunityIcons name="arrow-top-right" size={20} color="#084c3a" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    header:{
 flexDirection: 'row',
//  justifyContent:'flex-start',
 alignItems:'flex-start',
gap:8,
  },
header2:{
 flexDirection: 'column',
 alignItems:'flex-start',
 justifyContent:'flex-start',
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
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#aaa',
    textAlign: 'center',
    fontSize: 18,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: '#084c3a',
    borderRadius: 30,
    // paddingVertical: 12,
    paddingHorizontal: 20,
    height:50,
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
});
