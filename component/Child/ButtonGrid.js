import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ButtonGrid = ({ 
  setSelectedAction, 
  setIsModalVisible 
}) => (
  <View style={styles.buttonGrid}>
    <TouchableOpacity style={styles.button} onPress={() => setSelectedAction('attendance')}>
      <Icon name="check-circle" size={20} color="#ffffff" style={styles.buttonIcon} />
      <Text style={styles.buttonText}>Check Attendance</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => setSelectedAction('sendNote')}>
      <Icon name="comment" size={20} color="#ffffff" style={styles.buttonIcon} />
      <Text style={styles.buttonText}>Send a Note</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => setSelectedAction('updateProfile')}>
      <Icon name="edit" size={20} color="#ffffff" style={styles.buttonIcon} />
      <Text style={styles.buttonText}>Update Profile</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => setSelectedAction('requestMeeting')}>
      <Icon name="calendar" size={20} color="#ffffff" style={styles.buttonIcon} />
      <Text style={styles.buttonText}>Request a Meeting</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#bd84f6',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '48%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default ButtonGrid;