import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image, StyleSheet } from 'react-native';
import { fetchProfile } from '../component/UserOperations/fetchProfile';

import CrecheList from '../screens/CrecheList';
import YourApplications from '../screens/YourApplications';
import NotificationsScreen from '../screens/Notifications';
import Transport from '../screens/Transport';
import FeedsList from '../screens/FeedsList';
import MyCentre from '../screens/MyCentre';
import supabase from '../supabaseClient';  // Import your supabase client

// Import your images
import HomeIcon from '../assets/images/newsfeed.png'; // Replace with your image path
import ExploreIcon from '../assets/images/magnifier.png'; // Replace with your image path
import MyCentresIcon from '../assets/images/children.png'; // Replace with your image path
import NotificationsIcon from '../assets/images/notification.png'; // Replace with your image path
import TransportIcon from '../assets/images/transport.png'; // Replace with your image path

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const profile = await fetchProfile();  // Assuming you have a function to fetch the user profile

        const { data: notificationsData, error } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', profile.id)
          .is('deleted', false);

        if (error) {
          console.error('Error fetching notification count:', error.message);
          return;
        }

        setNotificationCount(notificationsData.length);  // Update the notification count
      } catch (fetchError) {
        console.error('Error fetching notifications:', fetchError.message);
      }
    };

    fetchNotificationCount();

    const intervalId = setInterval(fetchNotificationCount, 60000); // Fetch every 60 seconds

    return () => clearInterval(intervalId); // Clean up on component unmount
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconSource;

          switch (route.name) {
            case 'FeedsList':
              iconSource = HomeIcon;
              break;
            case 'CrecheList':
              iconSource = ExploreIcon;
              break;
            case 'MyCentre':
              iconSource = MyCentresIcon;
              break;
            case 'Notifications':
              iconSource = NotificationsIcon;
              break;
            case 'Transport':
              iconSource = TransportIcon;
              break;
            default:
              iconSource = HomeIcon; // Default icon
          }

          return (
            <View>
              <Image
                source={iconSource}
                style={[
                  styles.icon,
                  { 

                  }
                ]}
                importantForAccessibility="yes"
              />
              {route.name === 'Notifications' && notificationCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    right: -10,
                    top: -3,
                    backgroundColor: 'red',
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                    {notificationCount}
                  </Text>
                </View>
              )}
            </View>
          );
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="FeedsList" component={FeedsList} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="CrecheList" component={CrecheList} options={{ tabBarLabel: 'Explore' }} />
      <Tab.Screen name="MyCentre" component={MyCentre} options={{ tabBarLabel: 'My Child' }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ tabBarLabel: 'Notifications' }} />
      <Tab.Screen name="Transport" component={Transport} options={{ tabBarLabel: 'Transport' }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    opacity: 1,
  },
});

export default HomeTabs;