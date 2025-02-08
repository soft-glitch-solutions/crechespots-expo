import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const StudentDetailsCard = ({ student }) => (
  <View style={styles.card}>
    <View style={styles.detailContainer}>
      <Icon name="user" size={20} color="#bd84f6" />
      <Text style={styles.detail}>Name: {student.name}</Text>
    </View>
    <View style={styles.detailContainer}>
      <Icon name="calendar" size={20} color="#bd84f6" />
      <Text style={styles.detail}>Age: {student.age}</Text>
    </View>
    <View style={styles.detailContainer}>
      <Icon name="graduation-cap" size={20} color="#bd84f6" />
      <Text style={styles.detail}>Class: {student.class}</Text>
    </View>
    <View style={styles.detailContainer}>
      <Icon name="address-card" size={20} color="#bd84f6" />
      <Text style={styles.detail}>Address: {student.address}</Text>
    </View>
    <View style={styles.detailContainer}>
      <Icon name="stethoscope" size={20} color="#bd84f6" />
      <Text style={styles.detail}>Disabilities/Allergies: {student.disabilities_allergies}</Text>
    </View>
    <View style={styles.detailContainer}>
      <Icon name="phone" size={20} color="#bd84f6" />
      <Text style={styles.detail}>Parent Phone: {student.parent_phone_number}</Text>
    </View>
    <View style={styles.detailContainer}>
      <Icon name="envelope" size={20} color="#bd84f6" />
      <Text style={styles.detail}>Parent Email: {student.parent_email}</Text>
    </View>
    <View style={styles.detailContainer}>
      <Icon name="whatsapp" size={20} color="#bd84f6" />
      <Text style={styles.detail}>Parent WhatsApp: {student.parent_whatsapp}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detail: {
    marginLeft: 8,
    fontSize: 16,
    flexWrap: 'wrap',
  },
});

export default StudentDetailsCard;
