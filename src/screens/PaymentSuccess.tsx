import React from 'react';
import { View, StyleSheet, StatusBar, Image, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type PaymentSuccessParams = {
  PaymentSuccess: {
    message: string;
  };
};

const PaymentSuccess = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<PaymentSuccessParams, 'PaymentSuccess'>>();

  const formatMessage = (message: string): string => {
  return message.toUpperCase();
};
const message = formatMessage(route.params?.message || 'PAYMENT SUCCESS');

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#075E4D" barStyle="light-content" />
      <Image
        source={require('../assets/payments/Success.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>{message}</Text>

<View style={styles.fixedBottom}>
       <TouchableOpacity
                style={styles.continueButton}
                onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
              >
                <Text style={styles.continueText}>RETURN TO HOME</Text>
                <View style={styles.arrowContainer}>
                  <MaterialCommunityIcons name="arrow-top-right" size={20} color="#fff" />
                </View>
        </TouchableOpacity>
</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#075E4D',
    justifyContent: 'center',
    alignItems: 'center',
     paddingHorizontal: 16,
  },
  image: {
  width: 200,
    height: 150,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
    color:'#ffff'
  },

    fixedBottom: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: '#075E4D',
    padding: 16,
  },
   continueButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
     borderRadius: 30,
    // paddingVertical: 8,
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

export default PaymentSuccess;
