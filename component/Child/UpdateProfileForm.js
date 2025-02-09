import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import supabase from '../../supabaseClient';

const UpdateProfileForm = ({ studentId }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch the student's current profile data
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('name, age')
          .eq('id', studentId)
          .single();

        if (error) throw error;

        setName(data.name);
        setAge(data.age.toString());
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to fetch student profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [studentId]);

  const handleUpdateProfile = async () => {
    if (!name.trim() || !age.trim()) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      const { error } = await supabase
        .from('students')
        .update({ name, age: parseInt(age, 10) })
        .eq('id', studentId);

      if (error) throw error;

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#bd84f6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UpdateProfileForm;