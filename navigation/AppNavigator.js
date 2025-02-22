import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from './OnboardingNavigator';
import Login from '../screens/Login';
import SignUp from '../screens/Signup';
import ForgotPassword from '../screens/ForgotPassword';
import DrawerNavigator from './DrawerNavigator';

import CrecheDetails from '../screens/CrecheDetails';
import ApplicationDetails from '../screens/ApplicationDetails';
import EditApplication from '../screens/EditApplication';
import MyChildDetails from '../screens/MyChildDetails';
import FeedDetails from '../screens/FeedDetails';
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
        const authToken = await AsyncStorage.getItem('authToken');
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

  const handleOnboardingComplete = useCallback(async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      setIsOnboardingComplete(true);
    } catch (error) {
      console.error('Failed to set onboarding status:', error);
    }
  }, []);

  const handleLogin = useCallback(async (navigation) => {
    try {
      await AsyncStorage.setItem('authToken', 'dummyToken'); // Replace with actual token
      setIsAuthenticated(true);
      navigation.replace('DrawerNavigator'); // Navigate to DrawerNavigator
    } catch (error) {
      console.error('Failed to set auth token:', error);
    }
  }, []);

  const handleLogout = useCallback(async (navigation) => {
    try {
      await AsyncStorage.removeItem('authToken');
      setIsAuthenticated(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], // Clears navigation history
      });
    } catch (error) {
      console.error('Failed to remove auth token:', error);
    }
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Onboarding Screen */}
      {!isOnboardingComplete && (
        <Stack.Screen name="Onboarding">
          {props => (
            <OnboardingScreen
              {...props}
              onComplete={handleOnboardingComplete}
              navigation={props.navigation} // Pass navigation prop
            />
          )}
        </Stack.Screen>
      )}

      {/* Authentication Screens (Always part of the stack) */}
      <Stack.Screen name="Login">
        {props => <Login {...props} onLogin={() => handleLogin(props.navigation)} />}
      </Stack.Screen>
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

      {/* Authenticated Screens */}
      {isAuthenticated && (
        <>
          <Stack.Screen name="DrawerNavigator">
            {props => <DrawerNavigator {...props} onLogout={handleLogout} />}
          </Stack.Screen>

          {/* Add your additional screens here */}
          <Stack.Screen name="CrecheDetails" component={CrecheDetails} />
          <Stack.Screen name="ApplicationDetails" component={ApplicationDetails} />
          <Stack.Screen name="EditApplication" component={EditApplication} />
          <Stack.Screen name="MyChildDetails" component={MyChildDetails} />
          <Stack.Screen name="FeedDetails" component={FeedDetails} />
          <Stack.Screen name="NewsDetails" component={NewsDetails} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;