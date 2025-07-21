import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Input from '../components/Input';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const { width } = Dimensions.get('window');

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const navigation = useNavigation<any>();

       useEffect(() => {
      changeNavigationBarColor('#ffffff', true); // White nav bar with dark icons
    }, []);

  const { loginUser, loading } = useAuth();

  const validate = () => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number');
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (validate()) {
      const result = await loginUser({ phone, password });
      if (result.success) {
        navigation.navigate('MainTabs');
      } else {
        Alert.alert('Login Failed', (result as any).message || 'Invalid credentials');
      }
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
          <Text style={styles.title}>LET’S SIGN YOU IN</Text>
          <Text style={styles.subtitle}>Hello there, sign in to continue</Text>

          <Image
            source={require('../assets/images/Login.png')}
            style={styles.image}
            resizeMode="contain"
          />

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
            autoCapitalize="none"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={hidePassword}
            rightIcon={
              <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
                <MaterialCommunityIcons
                  name={hidePassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            }
          />

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotText}>Forgot Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.signInText}>SIGN IN</Text>
            <View style={styles.arrowContainer}>
              <MaterialCommunityIcons name="arrow-top-right" size={20} color="#084c3a" />
            </View>
          </TouchableOpacity>

          {/* 👇 Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don’t have an account?{' '}
              <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
                Register
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

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
  image: {
    width: width * 0.9,
    height: 160,
    alignSelf: 'center',
    marginBottom: 60,
    marginTop: 20,
  },
  forgotText: {
    color: '#007bff',
    alignSelf: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  signInButton: {
    flexDirection: 'row',
    backgroundColor: '#084c3a',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  signInText: {
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
  registerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
    color: '#000',
  },
  registerLink: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});
