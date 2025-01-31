import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddArticleButton = () => {
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [placeholder, setPlaceholder] = useState('');

  // Array of placeholder options
  const placeholders = [
    "Post a helpful tip to parents",
    "Post for donations",
    "Post an event for Families"
  ];

  // Randomly select a placeholder on component mount
  useEffect(() => {
    const randomPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];
    setPlaceholder(randomPlaceholder);
  }, []);

  const handlePost = () => {
    if (text.trim()) {
      // Handle the post action (e.g., submit text, navigate, etc.)
      console.log('Post:', text);
      setText(''); // Clear the text after posting
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor="#888"
        multiline
      />
      <TouchableOpacity style={styles.postButton} onPress={handlePost}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
  },
  postButton: {
    marginLeft: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddArticleButton;
