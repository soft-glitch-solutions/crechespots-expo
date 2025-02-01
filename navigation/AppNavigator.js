import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from './OnboardingNavigator';
import Login from '../screens/Login';
import SignUp from '../screens/Signup';
import CrecheDetails from '../screens/CrecheDetails';
import ApplicationDetails from '../screens/ApplicationDetails';
import ForgotPassword from '../screens/ForgotPassword';
import EditApplication from '../screens/EditApplication';
import MyCentreDetails from '../screens/MyCentreDetails';
import LessonsDetails from '../screens/mycreche/LessonsDetails';
import FeedDetails from '../screens/FeedDetails';
import UserProfileScreen from '../screens/chat/UserProfileScreen';
import DrawerNavigator from './DrawerNavigator';
import ChatScreen from '../screens/chat/ChatScreen';
import DeveloperScreen from '../screens/developer/DeveloperScreen';
import NewsDetails from '../screens/NewsDetails';
import ChangePassword from '../screens/ChangePassword';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const onboardingStatus = await AsyncStorage.getItem('onboardingCompleted');
        const authToken = await AsyncStorage.getItem('authToken'); // Example: Check for token
        setIsOnboardingComplete(onboardingStatus === 'true');
        setIsAuthenticated(!!authToken);
      } catch (error) {
        console.error('Error checking onboarding/auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      setIsOnboardingComplete(true);
    } catch (error) {
      console.error('Failed to set onboarding status:', error);
    }
  };

  if (isLoading) {
    return null; // Add a loading spinner here if desired
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isOnboardingComplete ? (
        <Stack.Screen name="Onboarding">
          {props => <OnboardingScreen {...props} onComplete={handleOnboardingComplete} />}
        </Stack.Screen>
      ) : !isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
        </>
      ) : (
        <>
          <Stack.Screen name="CrecheDetails" component={CrecheDetails} />
          <Stack.Screen name="ApplicationDetails" component={ApplicationDetails} />
          <Stack.Screen name="EditApplication" component={EditApplication} />
          <Stack.Screen name="MyCentreDetails" component={MyCentreDetails} />
          <Stack.Screen name="LessonsDetails" component={LessonsDetails} />
          <Stack.Screen name="FeedDetails" component={FeedDetails} />
          <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="DeveloperScreen" component={DeveloperScreen} />
          <Stack.Screen name="NewsDetails" component={NewsDetails} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
