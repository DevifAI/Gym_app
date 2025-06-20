import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './screens/SplashScreen';
// import OnboardingScreen from './screens/OnboardingScreen';
import Login from './screens/Login';
import ForgotPassword from './screens/FrogetPassword';
import OtpVerification from './screens/OtpVerfication';
import CreateNewPassword from './screens/CreateNewPassword';
import DoneScreen from './screens/DoneScreen';
import Onboarding from './screens/Onboarding';
import MainTabs from './components/MainTabs';
import BuyNow from './screens/Buynow';
import Payment from './screens/Payment';
import SlotBook from './screens/SlotBook';
import Booking from './screens/Booking';
import PaymentSuccess from './screens/PaymentSuccess';
// import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();


const Routes = () => {

    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
         <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
         <Stack.Screen name="OtpVerify" component={OtpVerification} />
         <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} />
        <Stack.Screen name="Done" component={DoneScreen} />
         <Stack.Screen name="Onboarding" component={Onboarding} />
        {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
         <Stack.Screen name="Buynow" component={BuyNow} />
         <Stack.Screen name="Payment" component={Payment} />
         <Stack.Screen name="SlotBook" component={SlotBook} />
         <Stack.Screen name="Booking" component={Booking} />
         <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
         <Stack.Screen
          name="MainTabs"
          component={MainTabs}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
