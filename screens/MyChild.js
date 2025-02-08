import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import supabase from '../supabaseClient';
import { Ionicons } from '@expo/vector-icons'; // For the plus icon
import AddChildModal from './AddChildModal'; // A new modal to add child profile

const MyChild = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [creches, setCreches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStudentsAndCreches();
  }, []);

  const fetchStudentsAndCreches = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', user.id);

        if (studentError) {
          throw studentError;
        }

        setStudents(studentData);

        const { data: crecheData, error: crecheError } = await supabase
          .from('creches')
          .select('*');

        if (crecheError) {
          throw crecheError;
        }

        setCreches(crecheData);
      } else {
        Alert.alert('Error', 'Unable to fetch user information');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Error fetching students and creches');
    } finally {
      setLoading(false);
    }
  };

  const addNewStudent = (newStudent) => {
    setStudents((prevStudents) => [...prevStudents, newStudent]);
    setShowModal(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#bd84f6" style={styles.loadingIndicator} />;
  }

  if (students.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noStudentsText}>Hi there, it seems you are not part of any creche or student groups.</Text>
        <Text style={styles.noStudentsText}>Maybe try applying to a creche or check your existing applications.</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Apply')}>
            <Text style={styles.buttonText}>Apply to a Creche</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Applications')}>
            <Text style={styles.buttonText}>Check Applications</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const crecheMap = creches.reduce((acc, creche) => {
    acc[creche.id] = creche.name;
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Children</Text>

        {/* Add child button at the top right */}
  <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
    <Ionicons name="add-circle" size={40} color="#bd84f6" />
  </TouchableOpacity>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.profileCard}>
            <Image
              source={{ uri: item.profile_picture || 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <View style={styles.profileDetails}>
              <Text style={styles.studentName}>{item.name}</Text>
              <Text style={styles.crecheName}>{crecheMap[item.creche_id] || 'Unknown Creche'}</Text>
              <Text style={styles.studentDetails}>Fees Owed: ${item.fees_owed}</Text>
              <Text style={styles.studentDetails}>Fees Paid: ${item.fees_paid}</Text>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => navigation.navigate('MyChildDetails', { studentId: item.id })}
              >
                <Text style={styles.detailsButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal to add new child */}
      {showModal && <AddChildModal addNewStudent={addNewStudent} />}
    </View>
  );
};

export default MyChild;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  crecheName: {
    fontSize: 16,
    color: '#bd84f6',
    marginBottom: 4,
  },
  studentDetails: {
    fontSize: 14,
    color: '#666',
  },
  detailsButton: {
    marginTop: 10,
    backgroundColor: '#bd84f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  detailsButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  noStudentsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#bd84f6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    top: 20, // Adjust for status bar
    right: 20,
    zIndex: 10,
  },
});
