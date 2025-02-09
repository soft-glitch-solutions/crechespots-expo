import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import supabase from '../../supabaseClient';

const SendNoteForm = ({ studentId }) => {
  const [note, setNote] = useState('');

  const handleSendNote = async () => {
    if (!note.trim()) {
      Alert.alert('Error', 'Please enter a note.');
      return;
    }

    try {
      const { error } = await supabase
        .from('student_notes')
        .insert([{ student_id: studentId, note, created_at: new Date() }]);

      if (error) throw error;

      Alert.alert('Success', 'Note sent successfully!');
      setNote('');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send note.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send a Note</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your note"
        value={note}
        onChangeText={setNote}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSendNote}>
        <Text style={styles.buttonText}>Send</Text>
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
    minHeight: 100,
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

export default SendNoteForm;