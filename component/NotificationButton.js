import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image } from 'react-native'; // Import Image
import { useNavigation } from '@react-navigation/native';
import { fetchProfile } from './UserOperations/fetchProfile'; // Make sure the path is correct
import supabase from '../supabaseClient';

const NotificationButton = () => {
  const navigation = useNavigation();
  const [notificationCount, setNotificationCount] = useState(0);

  const handleGoToNotifications = () => {
    navigation.navigate('NotificationsScreen');
  };

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const profile = await fetchProfile();
        console.log('Fetched Profile:', profile);

        const { data: notificationsData, error } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', profile.id)
          .is('deleted', false);

        if (error) {
          console.error('Error fetching notification count:', error.message);
          return;
        }

        console.log('Fetched Notifications Data:', notificationsData);
        setNotificationCount(notificationsData.length);
      } catch (fetchError) {
        console.error('Error fetching notifications:', fetchError.message);
      }
    };

    fetchNotificationCount();

    const intervalId = setInterval(fetchNotificationCount, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <TouchableOpacity style={styles.container} onPress={handleGoToNotifications}>
      <View style={styles.iconContainer}>
        <Image source={require('../assets/icons/notification.png')} style={styles.imageIcon} /> {/* Replace with your image path */}
        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notificationCount}</Text>
          </View>
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
    position: 'relative',
  },
  imageIcon: {
    width: 30,
    height: 30,
  },
  badge: {
    position: 'absolute',
    right: -10,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default NotificationButton;