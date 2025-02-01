import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import supabase from '../supabaseClient';

import HomeTabs from './HomeTabs';
import Settings from '../screens/Settings';
import Transport from '../screens/Transport';
import News from '../screens/News';
import Help from '../screens/Help'; 
import Support from '../screens/Support'; 
import Profile from '../screens/Profile'; 
import YourApplications from '../screens/YourApplications';
import ChatListScreen from '../screens/chat/ChatListScreen';
import DeveloperScreen from '../screens/developer/DeveloperScreen';

// Import your images
const homeIcon = require('../assets/icons/home.png');
const settingsIcon = require('../assets/icons/settings.png');
const applicationsIcon = require('../assets/icons/applications.png');
const developerIcon = require('../assets/icons/developer.png');
const helpIcon = require('../assets/icons/help.png');
const supportIcon = require('../assets/icons/support.png');

const Drawer = createDrawerNavigator();

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
    role: ''
  });
  const [loading, setLoading] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      Alert.alert('Error', 'Unable to fetch user session');
      setLoading(false);
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
        role: data.roles.role_name
      });

      setIsDeveloper(data.roles.role_name === 'Developer');
    }
    setLoading(false);
  };

  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={() => props.navigation.navigate('Profile')}>
            <Image
              source={{ uri: profile.profile_picture_url }} 
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{profile.display_name || 'User Name'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.drawerItemsContainer}>
          <DrawerItem
            label="Home"
            icon={({ color, size }) => (
              <Image source={homeIcon} style={styles.icon} />
            )}
            onPress={() => props.navigation.navigate('Home')}
          />
          <DrawerItem
            label="Settings"
            icon={({ color, size }) => (
              <Image source={settingsIcon} style={styles.icon} />
            )}
            onPress={() => props.navigation.navigate('Settings')}
          />
          <DrawerItem
            label="My Applications"
            icon={({ color, size }) => (
              <Image source={applicationsIcon} style={styles.icon} />
            )}
            onPress={() => props.navigation.navigate('YourApplications')}
          />
          {isDeveloper && (
            <DrawerItem
              label="Developer"
              icon={({ color, size }) => (
                <Image source={developerIcon} style={styles.icon} />
              )}
              onPress={() => props.navigation.navigate('DeveloperScreen')}
            />
          )}
        </View>

        <View style={styles.bottomDrawerSection}>
          <DrawerItem
            label="Help"
            icon={({ color, size }) => (
              <Image source={helpIcon} style={styles.icon} />
            )}
            onPress={() => props.navigation.navigate('Help')}
          />
          <DrawerItem
            label="Support"
            icon={({ color, size }) => (
              <Image source={supportIcon} style={styles.icon} />
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
      screenOptions={({ route }) => ({
        drawerIcon: ({ color, size }) => {
          let iconSource;

          switch (route.name) {
            case 'Home':
              iconSource = homeIcon;
              break;
            case 'Settings':
              iconSource = settingsIcon;
              break;
            case 'ChatListScreen':
              iconSource = messagesIcon;
              break;
            case 'Help':
              iconSource = helpIcon;
              break;
            case 'Support':
              iconSource = supportIcon;
              break;
            case 'DeveloperScreen':
              iconSource = developerIcon;
              break;
            default:
              iconSource = helpIcon;
          }

          return <Image source={iconSource} style={styles.icon} />;
        },
      })}
    >
      <Drawer.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
      <Drawer.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <Drawer.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
      <Drawer.Screen name="Help" component={Help} options={{ headerShown: false }} />
      <Drawer.Screen name="Support" component={Support} options={{ headerShown: false }} />
      <Drawer.Screen name="YourApplications" component={YourApplications} options={{ headerShown: false }} />
      {isDeveloper && (
        <Drawer.Screen name="DeveloperScreen" component={DeveloperScreen} options={{ headerShown: false }} />
      )}
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
  drawerItemsContainer: {
    flex: 1,
    marginTop: 10,
  },
  bottomDrawerSection: {
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
});