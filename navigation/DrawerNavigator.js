import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import supabase from '../supabaseClient';

import HomeTabs from './HomeTabs';
import Settings from '../screens/Settings';
import YourApplications from '../screens/YourApplications';
import Help from '../screens/Help';
import Support from '../screens/Support';
import Profile from '../screens/Profile';
import DeveloperScreen from '../screens/developer/DeveloperScreen';

// Import your images
const homeIcon = require('../assets/icons/home.png');
const settingsIcon = require('../assets/icons/settings.png');
const applicationsIcon = require('../assets/icons/applications.png');
const developerIcon = require('../assets/icons/developer.png');
const helpIcon = require('../assets/icons/help.png');
const supportIcon = require('../assets/icons/support.png');

const Drawer = createDrawerNavigator();

// Define unique background colors for each menu item's icon
const menuItemIconColors = {
  Home: '#FFDDC1', // Light orange
  Settings: '#C1FFD7', // Light green
  MyApplications: '#C1D7FF', // Light blue
  Developer: '#FFC1E3', // Light pink
  Help: '#FFC1C1', // Light red
  Support: '#E3C1FF', // Light purple
};

const DrawerNavigator = () => {
  const [profile, setProfile] = useState({
    display_name: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    id_number: '',
    profile_picture_url: '',
    bio: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        // Redirect to Login if user is not authenticated
        Alert.alert('Not Signed In', 'Please log in to continue.');
        navigation.replace('Login'); 
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select(`
          display_name, email, first_name, last_name,
          phone_number, id_number, profile_picture_url, bio, roles(role_name)
        `)
        .eq('id', session.user.id)
        .single();

      if (error) {
        Alert.alert('Error', 'Error fetching profile data');
        console.error('Profile Fetch Error:', error);
      } else {
        setProfile({
          display_name: data.display_name,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          id_number: data.id_number,
          profile_picture_url: data.profile_picture_url,
          bio: data.bio,
          role: data.roles.role_name,
        });

        setIsDeveloper(data.roles.role_name === 'Developer');
      }
    } catch (error) {
      console.error('Unexpected Error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>

        <View style={styles.drawerItemsContainer}>
          <DrawerItem
            label="Home"
            icon={({ color, size }) => (
              <View style={[styles.iconContainer, { backgroundColor: menuItemIconColors.Home }]}>
                <Image source={homeIcon} style={styles.icon} />
              </View>
            )}
            onPress={() => props.navigation.navigate('Home')}
          />
          <DrawerItem
            label="Settings"
            icon={({ color, size }) => (
              <View style={[styles.iconContainer, { backgroundColor: menuItemIconColors.Settings }]}>
                <Image source={settingsIcon} style={styles.icon} />
              </View>
            )}
            onPress={() => props.navigation.navigate('Settings')}
          />
          <DrawerItem
            label="My Applications"
            icon={({ color, size }) => (
              <View style={[styles.iconContainer, { backgroundColor: menuItemIconColors.MyApplications }]}>
                <Image source={applicationsIcon} style={styles.icon} />
              </View>
            )}
            onPress={() => props.navigation.navigate('YourApplications')}
          />
          {isDeveloper && (
            <DrawerItem
              label="Developer"
              icon={({ color, size }) => (
                <View style={[styles.iconContainer, { backgroundColor: menuItemIconColors.Developer }]}>
                  <Image source={developerIcon} style={styles.icon} />
                </View>
              )}
              onPress={() => props.navigation.navigate('DeveloperScreen')}
            />
          )}
        </View>

        <View style={styles.bottomDrawerSection}>
          <DrawerItem
            label="Help"
            icon={({ color, size }) => (
              <View style={[styles.iconContainer, { backgroundColor: menuItemIconColors.Help }]}>
                <Image source={helpIcon} style={styles.icon} />
              </View>
            )}
            onPress={() => props.navigation.navigate('Help')}
          />
          <DrawerItem
            label="Support"
            icon={({ color, size }) => (
              <View style={[styles.iconContainer, { backgroundColor: menuItemIconColors.Support }]}>
                <Image source={supportIcon} style={styles.icon} />
              </View>
            )}
            onPress={() => props.navigation.navigate('Support')}
          />
        </View>
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Home" component={HomeTabs} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="YourApplications" component={YourApplications} />
      <Drawer.Screen name="Help" component={Help} />
      <Drawer.Screen name="Support" component={Support} />
      {isDeveloper && <Drawer.Screen name="DeveloperScreen" component={DeveloperScreen} />}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({
  profileContainer: {
    padding: 20,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  imagePlaceholder: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerItemsContainer: {
    flex: 1,
    marginTop: 10,
  },
  bottomDrawerSection: {
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  iconPlaceholder: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
});