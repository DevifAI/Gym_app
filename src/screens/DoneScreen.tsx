import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
const { width } = Dimensions.get('window');
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const DoneScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar backgroundColor="#075E4D" barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Image
            source={require('../assets/images/done.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.continueText}>RETURN TO SIGNIN</Text>
          <View style={styles.arrowContainer}>
            <MaterialCommunityIcons name="arrow-top-right" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DoneScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#075E4D',
    paddingVertical:40,
  },
  container: {
    flex: 1,
    backgroundColor: '#075E4D',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.9,
    height: 160,
    alignSelf: 'center',
    marginTop: 30,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  continueText: {
    color: '#075E4D',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  arrowContainer: {
    backgroundColor: '#075E4D',
    borderRadius: 50,
    padding: 8,
    marginLeft: -32,
  },
});
