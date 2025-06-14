import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Input';

const { width } = Dimensions.get('window');

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation<any>();

  const handleContinue = () => {
    if (email.trim() === '') {
      Alert.alert('Please enter your email address');
    } else {
       Alert.alert('OTP send for reset password');
       navigation.navigate('OtpVerify')
    }
  };

  return (
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
            <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 8 }}>
         <Icon name="arrow-back-ios" size={26} color="#000" />
   </TouchableOpacity>


        <View style={styles.header2}>
          <Text style={styles.title}>FORGOT PASSWORD</Text>
         <Text style={styles.subtitle}>
  Don’t worry it happens! Just enter your{'\n'}email address.
</Text>

        </View>
        </View>

          <Image
            source={require('../assets/images/forgotPassword.png')}
            style={styles.image}
            resizeMode="contain"
          />

          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>CONTINUE</Text>
            <View style={styles.arrowContainer}>
              <MaterialCommunityIcons name="arrow-top-right" size={20} color="#084c3a" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

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
    marginBottom: 30,
  },
  image: {
    width: width * 0.9,
    height: 160,
    alignSelf: 'center',
    marginBottom: 80,
    marginTop: 30,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#084c3a',
    borderRadius: 30,
    // paddingVertical: 14,
    paddingHorizontal: 20,
     height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  arrowContainer: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 6,
    marginLeft: -32,
  },
});
