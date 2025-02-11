import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; // ✅ Fixed Picker import
import supabase from '../../supabaseClient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DeveloperScreen = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      await fetchCurrentUser();
      await fetchRoles();
    };
    initializeData();
  }, []);

  // ✅ Fetch current user safely
  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setCurrentUser(user);
    } catch (error) {
      Alert.alert('Error', 'Failed to retrieve user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch roles safely
  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase.from('roles').select('role_name');
      if (error) throw error;
      setRoles(data?.map(role => role.role_name) || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch roles. Please try again.');
    }
  };

  // ✅ Switch user role with improved error handling
  const switchRole = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'No user is currently logged in.');
      return;
    }
    if (!selectedRole) {
      Alert.alert('Error', 'Please select a role.');
      return;
    }
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: selectedRole })
        .eq('id', currentUser.id);
      if (error) throw error;
      Alert.alert('Success', `User role updated to "${selectedRole}".`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update role. Please try again.');
    }
  };

  // ✅ Clear AsyncStorage safely
  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Success', 'AsyncStorage cleared successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear AsyncStorage. Please try again.');
    }
  };

  // 🔹 Placeholder Developer Functions
  const fetchLogs = () => Alert.alert('Logs', 'Fetch logs functionality not implemented.');
  const resetApp = () => Alert.alert('Reset', 'Reset app functionality not implemented.');
  const inspectAPI = () => Alert.alert('API Inspection', 'Inspect API functionality not implemented.');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Developer Functions</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <>
          {currentUser ? (
            <>
              <Text style={styles.info}>Current User: {currentUser.email}</Text>
              <Text style={styles.info}>
                Current Role: {currentUser.role || 'N/A'}
              </Text>
            </>
          ) : (
            <Text style={styles.errorText}>No user logged in</Text>
          )}
        </>
      )}

      {/* 🔹 Role Picker */}
      <Text style={styles.label}>Select Role:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedRole}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedRole(itemValue)}
        >
          <Picker.Item label="Select a role" value="" />
          {roles.map((role, index) => (
            <Picker.Item key={index} label={role} value={role} />
          ))}
        </Picker>
      </View>

      {/* 🔹 Buttons */}
      <CustomButton icon="swap-horiz" text="Switch Role" onPress={switchRole} disabled={!selectedRole} />
      <CustomButton icon="delete" text="Clear AsyncStorage" onPress={clearStorage} />
      <CustomButton icon="error" text="Fetch Logs" onPress={fetchLogs} />
      <CustomButton icon="refresh" text="Reset App" onPress={resetApp} />
      <CustomButton icon="api" text="Inspect API" onPress={inspectAPI} />
    </View>
  );
};

// ✅ Custom Button Component
const CustomButton = ({ icon, text, onPress, disabled = false }) => (
  <TouchableOpacity 
    style={[styles.button, disabled && styles.buttonDisabled]} 
    onPress={onPress} 
    disabled={disabled}
  >
    <Icon name={icon} size={20} color="#fff" />
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  info: {
    fontSize: 16,
    marginVertical: 5,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default DeveloperScreen;
