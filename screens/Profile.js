import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useProfile } from '../component/Profile/useProfile';
import { useNavigation } from '@react-navigation/native'; // Assuming you're using React Navigation
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../supabaseClient';
import { Ionicons } from '@expo/vector-icons'; // For icons
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'; // For tab navigation

// Import your icons from assets
const aboutIcon = require('../assets/icons/about.png');
const workIcon = require('../assets/save-filled.png');
const paymentIcon = require('../assets/icons/credit-card.png');

const Profile = () => {
  const { profile, loading, updateProfile, error } = useProfile();
  const [localProfile, setLocalProfile] = useState({}); // Initialize with an empty object
  const navigation = useNavigation(); // For navigation

  // Tab navigation state
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'about', title: 'About', icon: aboutIcon },
    { key: 'work', title: 'Saved', icon: workIcon },
    { key: 'bio', title: 'Payment', icon: paymentIcon },
  ]);

  useEffect(() => {
    if (profile) {
      console.log('Profile data updated:', profile);
      setLocalProfile(profile);
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    try {
      console.log('Updating profile with data:', localProfile);
      await updateProfile(localProfile);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (err) {
      Alert.alert('Error', 'Error updating profile');
      console.error('Profile Update Error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) {
        Alert.alert('Error', 'Error logging out');
        console.error('Logout Error:', logoutError);
      } else {
        await AsyncStorage.removeItem('userSession');
        navigation.replace('Login'); // Navigate to the login screen
      }
    } catch (error) {
      Alert.alert('Error', 'Error logging out');
      console.error('Logout Error:', error);
    }
  };

  const handleProfileChange = (field, value) => {
    console.log(`Profile field changed: ${field} = ${value}`);
    setLocalProfile({ ...localProfile, [field]: value });
  };

  // Ensure localProfile is not null or undefined
  const safeProfile = localProfile || {};

  // Tab Scenes
  const AboutScene = () => (
    <View style={styles.tabContent}>
      <View style={styles.detailSection}>
        <Text style={styles.detailLabel}>Email</Text>
        <Text style={styles.detailValue}>{safeProfile.email || 'emily.n@hotmail.com'}</Text>
      </View>
      <View style={styles.detailSection}>
        <Text style={styles.detailLabel}>Date of Birth</Text>
        <Text style={styles.detailValue}>{safeProfile.dob || 'December 07, 2020'}</Text>
      </View>
      <View style={styles.detailSection}>
        <Text style={styles.detailLabel}>Address</Text>
        <Text style={styles.detailValue}>{safeProfile.address || 'Pasadena, California'}</Text>
      </View>
    </View>
  );

  const WorkScene = () => (
    <View style={styles.tabContent}>
      <View style={styles.activityRow}>
        <View style={styles.activityItem}>
          <Text style={styles.activityValue}>17</Text>
          <Text style={styles.activityLabel}>Projects Done</Text>
        </View>
        <View style={styles.activityItem}>
          <Text style={styles.activityValue}>92%</Text>
          <Text style={styles.activityLabel}>Success Rate</Text>
        </View>
      </View>
      <View style={styles.activityRow}>
        <View style={styles.activityItem}>
          <Text style={styles.activityValue}>5</Text>
          <Text style={styles.activityLabel}>Teams</Text>
        </View>
        <View style={styles.activityItem}>
          <Text style={styles.activityValue}>243</Text>
          <Text style={styles.activityLabel}>Client Reports</Text>
        </View>
      </View>
    </View>
  );

  const BioScene = () => (
    <View style={styles.tabContent}>
      <Text style={styles.bioText}>
        {safeProfile.bio ||
          'Lorem Ipsum Dolor Sit Amet, Connecticut Adipi Scing Elit. Tortor Turpis Sodales Nulla Velit. Nunc Cum Vitae, Rhoncus Leo Id. Volutpat Duis Tinunt Prettum Luctus Pulvinar Pretium.'}
      </Text>
    </View>
  );

  const renderScene = SceneMap({
    about: AboutScene,
    work: WorkScene,
    bio: BioScene,
  });

  // Custom renderLabel for TabBar with icons
  const renderLabel = ({ route, focused, color }) => (
    <View style={styles.tabLabelContainer}>
      <Image
        source={route.icon}
        style={[styles.tabIcon, { tintColor: focused ? '#007bff' : '#666' }]}
      />
      <Text style={[styles.tabLabel, { color }]}>{route.title}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: safeProfile.profile_picture_url || 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.profileName}>{safeProfile.name || 'Emily Nelson'}</Text>
        <Text style={styles.profileRole}>{safeProfile.role || 'Software Engineer'}</Text>
      </View>

      {/* Tab Navigation */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={styles.tabBar}
            indicatorStyle={styles.tabIndicator}
            renderLabel={renderLabel}
            activeColor="#007bff"
            inactiveColor="#666"
          />
        )}
      />

      {/* Edit Profile Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  profileRole: {
    fontSize: 16,
    color: '#666',
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabIndicator: {
    backgroundColor: '#007bff',
    height: 2,
  },
  tabLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  tabLabel: {
    fontWeight: 'bold',
  },
  tabContent: {
    padding: 16,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  activityItem: {
    alignItems: 'center',
  },
  activityValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  activityLabel: {
    fontSize: 14,
    color: '#666',
  },
  bioText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  editButton: {
    backgroundColor: '#bd84f6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  editButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Profile;