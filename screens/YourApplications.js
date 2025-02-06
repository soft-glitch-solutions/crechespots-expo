import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import supabase from '../supabaseClient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const YourApplications = () => {
  const [applications, setApplications] = useState([]);
  const [creches, setCreches] = useState({});
  const [userDetails, setUserDetails] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchUserAndApplications = useCallback(async () => {
    setRefreshing(true);
    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user || !user.user.id) throw new Error('Failed to get user.');

      const { data: userDetailsData } = await supabase.from('users').select('*').eq('id', user.user.id).single();
      setUserDetails(userDetailsData);

      const { data: applicationsData } = await supabase.from('applications').select('*').eq('user_id', user.user.id);
      setApplications(applicationsData);
    } catch (error) {
      console.error(error.message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUserAndApplications();
  }, [fetchUserAndApplications]);

  const handleDeleteApplication = async (applicationId) => {
    Alert.alert('Confirm Deletion', 'Are you sure you want to delete this application?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: async () => {
          await supabase.from('applications').delete().eq('id', applicationId);
          fetchUserAndApplications();
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Your Applications</Text>

      <FlatList
        data={applications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.applicationItem}>
            <Text style={styles.name}>Creche: {creches[item.creche_id]?.name || 'Unknown'}</Text>
            <Text style={styles.info}>Status: {item.application_status}</Text>
            <Text style={styles.info}>Applied On: {new Date(item.created_at).toLocaleDateString()}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.viewButton} onPress={() => navigation.navigate('ApplicationDetails', { applicationId: item.id })}>
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteApplication(item.id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchUserAndApplications} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 24,
  },
  applicationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 14,
    marginVertical: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  viewButton: {
    backgroundColor: '#bd84f6',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#e94e77',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default YourApplications;
