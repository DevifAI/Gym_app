import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
import Input from '../components/Input'; // ✅ Reuse Login input style

const { width } = Dimensions.get('window');

const CreateNewPassword = ({ navigation }: any) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  const handleContinue = () => {
  if (newPassword !== confirmPassword) {
    Alert.alert('Password Mismatch', 'New password and confirm password must be the same.');
    return;
  }

  if (newPassword.length < 6) {
    Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
    return;
  }

  navigation.navigate('Done'); // ✅ Navigate if valid
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 8 }}>
              <Icon name="arrow-back-ios" size={26} color="#000" />
            </TouchableOpacity>

            <View style={styles.header2}>
              <Text style={styles.title}>CREATE NEW PASSWORD</Text>
              <Text style={styles.subtitle}>
                Set a new password you haven’t used before.
              </Text>
            </View>
          </View>

          {/* Image */}
          <Image
            source={require('../assets/images/forgotPassword.png')}
            style={styles.image}
            resizeMode="contain"
          />

          {/* New Password */}
          <Input
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={hideNewPassword}
            rightIcon={
              <TouchableOpacity onPress={() => setHideNewPassword(!hideNewPassword)}>
                <MaterialCommunityIcons
                  name={hideNewPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            }
          />

          {/* Confirm Password */}
          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={hideConfirmPassword}
            rightIcon={
              <TouchableOpacity onPress={() => setHideConfirmPassword(!hideConfirmPassword)}>
                <MaterialCommunityIcons
                  name={hideConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            }
          />

          {/* Continue Button */}
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

export default CreateNewPassword;

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
    marginBottom: 30,
  },
   image: {
    width: width * 0.9,
    height: 160,
    alignSelf: 'center',
    marginBottom: 80,
    marginTop: 30,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: '#084c3a',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
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
