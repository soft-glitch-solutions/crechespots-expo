import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import supabase from '../../supabaseClient';

const RequestMeetingForm = ({ studentId }) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [purpose, setPurpose] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep the picker open on iOS
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios'); // Keep the picker open on iOS
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleRequestMeeting = async () => {
    if (!purpose.trim()) {
      Alert.alert('Error', 'Please enter the purpose of the meeting.');
      return;
    }

    const meetingDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    );

    try {
      const { error } = await supabase
        .from('meeting_requests')
        .insert([
          {
            student_id: studentId,
            meeting_date: meetingDateTime.toISOString(),
            purpose,
            status: 'pending',
          },
        ]);

      if (error) throw error;

      Alert.alert('Success', 'Meeting request submitted successfully!');
      setPurpose('');
      setDate(new Date());
      setTime(new Date());
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to submit meeting request.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request a Meeting</Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>Select Date: {date.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowTimePicker(true)}
      >
        <Text>Select Time: {time.toLocaleTimeString()}</Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Purpose of the meeting"
        value={purpose}
        onChangeText={setPurpose}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleRequestMeeting}>
        <Text style={styles.buttonText}>Submit Request</Text>
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
    justifyContent: 'center',
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

export default RequestMeetingForm;