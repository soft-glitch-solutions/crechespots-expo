import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Platform, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer
        fallback={<View />} // Fallback while loading
      >
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
