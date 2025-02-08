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
import LogoutScreen from '../screens/LogoutScreen';

// Import images
const homeIcon = require('../assets/icons/home.png');
const settingsIcon = require('../assets/icons/settings.png');
const applicationsIcon = require('../assets/icons/applications.png');
const developerIcon = require('../assets/icons/developer.png');
const helpIcon = require('../assets/icons/help.png');
const supportIcon = require('../assets/icons/support.png');
const logoutIcon = require('../assets/icons/logout.png');

const Drawer = createDrawerNavigator();

// Define background colors for icons
const menuItemIconColors = {
  Home: '#FFDDC1',
  Settings: '#C1FFD7',
  MyApplications: '#C1D7FF',
  Developer: '#FFC1E3',
  Help: '#FFC1C1',
  Support: '#E3C1FF',
  Logout: '#FFB6C1',
};

const DrawerNavigator = ({ onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeveloper, setIsDeveloper] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        Alert.alert('Not Signed In', 'Please log in to continue.');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select(`display_name, email, profile_picture_url, roles(role_name)`)
        .eq('id', session.user.id)
        .single();

      if (error) {
        Alert.alert('Error', 'Error fetching profile data');
        console.error(error);
      } else {
        setProfile(data);
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
            icon={() => (
              <View style={[styles.iconContainer, { backgroundColor: menuItemIconColors.Home }]}>
                <Image source={homeIcon} style={styles.icon} />
              </View>
            )}
            onPress={() => props.navigation.navigate('Home')}
          />
          <DrawerItem
            label="Settings"
            icon={() => (
              <View style={[styles.iconContainer, { backgroundColor: menuItemIconColors.Settings }]}>
                <Image source={settingsIcon} style={styles.icon} />
              </View>
            )}
            onPress={() => props.navigation.navigate('Settings')}
          />
          <DrawerItem
            label="My Applications"
            icon={() => (
              <View style={[styles.iconContainer, { backgroundColor: menuItemIconColors.MyApplications }]}>
                <Image source={applicationsIcon} style={styles.icon} />
              </View>
            )}
            onPress={() => props.navigation.navigate('YourApplications')}
          />
          {isDeveloper && (
            <DrawerItem
              label="Developer"
              icon={() => (
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
            icon={() => (
              <View style={[styles.iconContainer, { backgroundColor: menuItemIconColors.Help }]}>
                <Image source={helpIcon} style={styles.icon} />
              </View>
            )}
            onPress={() => props.navigation.navigate('Help')}
          />
          <DrawerItem
            label="Support"
            icon={() => (
              <View style={[styles.iconContainer, { backgroundColor: menuItemIconColors.Support }]}>
                <Image source={supportIcon} style={styles.icon} />
              </View>
            )}
            onPress={() => props.navigation.navigate('Support')}
          />
          <DrawerItem
            label="Logout"
            icon={() => (
              <View style={[styles.iconContainer, { backgroundColor: menuItemIconColors.Logout }]}>
                <Image source={logoutIcon} style={styles.icon} />
              </View>
            )}
            onPress={() => props.navigation.navigate('Logout')}
          />
        </View>
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Home" component={HomeTabs} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="YourApplications" component={YourApplications} />
      <Drawer.Screen name="Help" component={Help} />
      <Drawer.Screen name="Support" component={Support} />
      {isDeveloper && <Drawer.Screen name="DeveloperScreen" component={DeveloperScreen} />}
      <Drawer.Screen name="Logout">
        {props => <LogoutScreen {...props} onLogout={onLogout} />}
      </Drawer.Screen>
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
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    color: 'gray',
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
});
