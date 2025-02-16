import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OpenDrawerButton = () => {
  const navigation = useNavigation();

  const handleOpenDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleOpenDrawer}>
      <Image
        source={require('../assets/icons/main-menu.png')} // Replace with your menu icon image
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  icon: {
    width: 24, // Adjust size as needed
    height: 24,
  },
});

export default OpenDrawerButton;
