import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchProfile } from './UserOperations/fetchProfile'; // Ensure the path is correct
import supabase from '../supabaseClient';

const ProfileButton = () => {
  const navigation = useNavigation();
  const [profilePicture, setProfilePicture] = useState(null); // State to hold profile picture URL

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await fetchProfile(); // Fetch the user profile
        console.log('Fetched Profile:', profile); // Log the fetched profile

        // Set the profile picture URL if available, otherwise use a default image
        if (profile.profile_picture_url) {
          setProfilePicture(profile.profile_picture_url);
        } else {
          setProfilePicture(require('../assets/default-profile.png')); // Default image path
        }
      } catch (fetchError) {
        console.error('Error fetching profile:', fetchError.message);
        setProfilePicture(require('../assets/default-profile.png')); // Fallback to default image
      }
    };

    fetchUserProfile();
  }, []); // Empty dependency array to run only on mount

  const handleGoToProfile = () => {
    navigation.navigate('Profile'); // Navigate to the Profile screen
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleGoToProfile}>
      <View style={styles.iconContainer}>
        {profilePicture ? (
          <Image
            source={typeof profilePicture === 'string' ? { uri: profilePicture } : profilePicture}
            style={styles.profileImage}
          />
        ) : (
          <Image
            source={require('../assets/default-profile.png')} // Default image if no profile picture is set
            style={styles.profileImage}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  iconContainer: {
    position: 'relative', // Set position to relative for future adjustments
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 20, // Make it circular
  },
});

export default ProfileButton;