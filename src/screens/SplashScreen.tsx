import React from 'react';
import { View, StyleSheet, StatusBar, Image } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#075E4D" barStyle="light-content" />
      <Image
        source={require('../assets/images/Logo.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#075E4D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
  width: 270,
    height: 200,
  },
});

export default SplashScreen;
