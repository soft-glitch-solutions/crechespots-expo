import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const LogoutScreen = ({ navigation, onLogout }) => {
  useEffect(() => {
    onLogout(navigation);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Logging out...</Text>
    </View>
  );
};

export default LogoutScreen;
