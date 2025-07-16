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
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import Subscription from './screens/Subscription';
import Amenities from './screens/Amenities';
import CartScreen from './screens/Cart';
import ActivitiesScreen from './screens/Activities';
import PaymentHistoryScreen from './screens/PaymentHistory';
// import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();


const Routes = () => {
      const {isAuthenticated} = useSelector((state: RootState) => state.auth);
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
         <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
         <Stack.Screen name="OtpVerify" component={OtpVerification} />
         <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} />

<Stack.Screen name="MainTabs" component={isAuthenticated ? MainTabs : Login} />
<Stack.Screen name="Done" component={isAuthenticated ? DoneScreen : Login} />
<Stack.Screen name="Onboarding" component={isAuthenticated ? Onboarding : Login} />
<Stack.Screen name="Buynow" component={isAuthenticated ? BuyNow : Login} />
<Stack.Screen name="Payment" component={isAuthenticated ? Payment : Login} />
<Stack.Screen name="SlotBook" component={isAuthenticated ? SlotBook : Login} />
<Stack.Screen name="Booking" component={isAuthenticated ? Booking : Login} />
<Stack.Screen name="Subscription" component={isAuthenticated ? Amenities : Login} />
<Stack.Screen name="SubscriptionList" component={isAuthenticated ? Subscription : Login} />
<Stack.Screen name="PaymentSuccess" component={isAuthenticated ? PaymentSuccess : Login} />
<Stack.Screen name="Cart" component={isAuthenticated ? CartScreen : Login} />
<Stack.Screen name="Activities" component={isAuthenticated ? ActivitiesScreen : Login} />
<Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
