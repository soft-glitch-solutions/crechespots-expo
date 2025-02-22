import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../component/BackButton';

const Settings = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    console.log("Logout pressed");
    navigation.navigate('Login'); // Assuming 'Login' is the name of your login screen
  };

  return (
    <View style={styles.container}>
      {/* Back Button with Image */}
      <BackButton />
      <Text style={styles.title}>Settings</Text>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Profile')}>
          <Image source={require('../assets/icons/woman.png')} style={styles.optionIcon} />
          <Text style={styles.optionText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ChangePassword')}>
          <Image source={require('../assets/icons/padlock.png')} style={styles.optionIcon} />
          <Text style={styles.optionText}>Change Password</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  optionIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Settings;
