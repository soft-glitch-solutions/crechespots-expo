import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Image , TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // For picking images from the gallery
import supabase from '../supabaseClient';

const AddChildModal = ({ addNewStudent, closeModal }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  const handleSubmit = async () => {
    if (!name || !age || !profilePicture) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('students')
          .insert([
            {
              user_id: user.id,
              name,
              age: parseInt(age),
              profile_picture: profilePicture,
            },
          ]);

        if (error) {
          throw error;
        }

        addNewStudent(data[0]); // Add the new student to the list
        closeModal(); // Close modal after adding the student
      }
    } catch (error) {
      console.error('Error adding new student:', error.message);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePicture(result.uri);
    }
  };

  return (
    <Modal transparent={true} animationType="slide" visible={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Child</Text>

          <TextInput
            style={styles.input}
            placeholder="Child's Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={age}
            keyboardType="numeric"
            onChangeText={setAge}
          />
          
          <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
            <Text style={styles.imagePickerText}>
              {profilePicture ? 'Change Profile Picture' : 'Pick a Profile Picture'}
            </Text>
          </TouchableOpacity>
          
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.imagePreview} />
          ) : null}

          <Button title="Add Child" onPress={handleSubmit} />

          <Button title="Cancel" onPress={closeModal} color="red" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  imagePickerButton: {
    backgroundColor: '#bd84f6',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
});

export default AddChildModal;
