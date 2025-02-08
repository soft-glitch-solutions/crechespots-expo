import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const StudentDetailsCard = ({ student }) => (
  <View style={styles.card}>
    <View style={styles.detailContainer}>
      <Icon name="user" size={20} color="#bd84f6" />
      <Text style={styles.detail}>Name: {student.name}</Text>
    </View>
    {/* Add other student details like age, class, etc. */}
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
  },
});

export default StudentDetailsCard;
