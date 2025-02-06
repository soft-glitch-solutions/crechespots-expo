import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Linking } from 'react-native';
import supabase from '../supabaseClient';
import Loading from '../component/loadingComponent/loading';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

const MyCentreDetails = ({ route, navigation }) => {
  const { studentId } = route.params;
  const [student, setStudent] = useState(null);
  const [documents, setDocuments] = useState([]);  // To store the student's documents
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('details'); // Default selected tab

  useEffect(() => {
    fetchStudentDetails();
    fetchStudentDocuments();  // Fetch documents on component mount
  }, []);

  const fetchStudentDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single();

      if (error) {
        throw error;
      }

      setStudent(data);
    } catch (error) {
      Alert.alert('Error', error.message || 'Error fetching student details');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDocuments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('student_documents')
        .select('*')
        .eq('student_id', studentId);

      if (error) {
        throw error;
      }

      setDocuments(data);
    } catch (error) {
      Alert.alert('Error', error.message || 'Error fetching documents');
    } finally {
      setLoading(false);
    }
  };

  const handlePayFees = () => {
    Alert.alert('Payment', 'Redirect to payment page.');
    // Implement the actual payment logic here
  };

  const handleLessonPlan = () => {
    navigation.navigate('LessonsDetails', { crecheId: student.creche_id });
  };

  const handleDropOff = async () => {
    try {
      const { error } = await supabase
        .from('attendance_students')
        .insert({
          student_id: studentId,
          attendance_date: moment().format('YYYY-MM-DD'),
          status: 'Present',
        });

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Attendance marked as present.');
    } catch (error) {
      Alert.alert('Error', error.message || 'Error marking attendance');
    }
  };

  const handleDocumentClick = (url) => {
    Linking.openURL(url).catch((err) => Alert.alert('Error', 'Could not open document.'));
  };

  if (loading) {
    return <Loading />;
  }

  if (!student) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Student details not found.</Text>
      </View>
    );
  }

  const renderDetailsTab = () => (
    <View style={styles.card}>
      {/* Student Details */}
      <View style={styles.detailContainer}>
        <Icon name="user" size={20} color="#bd84f6" />
        <Text style={styles.detail}>Name: {student.name}</Text>
      </View>
      {/* Add other student details like age, class, etc. */}
    </View>
  );

  const renderDocumentsTab = () => (
    <View style={styles.card}>
      {documents.length === 0 ? (
        <Text style={styles.noDataText}>No documents available for this student.</Text>
      ) : (
        documents.map((doc, index) => (
          <TouchableOpacity
            key={index}
            style={styles.documentItem}
            onPress={() => handleDocumentClick(doc.url)}  // Assuming 'url' contains the document link
          >
            <Icon name="file" size={20} color="#bd84f6" />
            <Text style={styles.documentText}>{doc.document_name}</Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  const renderButtons = () => (
    <View style={styles.buttonGrid}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePayFees}
      >
        <Icon name="credit-card" size={20} color="#ffffff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Pay Fees</Text>
      </TouchableOpacity>
      {/* Other buttons */}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Icon name="arrow-left" size={20} color="#bd84f6" />
      </TouchableOpacity>

      <Text style={styles.title}>Student Details</Text>

      {/* Tabs for navigation */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setSelectedTab('details')}
          style={[styles.tab, selectedTab === 'details' && styles.activeTab]}
        >
          <Text style={[styles.tabText, selectedTab === 'details' && styles.activeTabText]}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab('actions')}
          style={[styles.tab, selectedTab === 'actions' && styles.activeTab]}
        >
          <Text style={[styles.tabText, selectedTab === 'actions' && styles.activeTabText]}>Actions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab('documents')}
          style={[styles.tab, selectedTab === 'documents' && styles.activeTab]}
        >
          <Text style={[styles.tabText, selectedTab === 'documents' && styles.activeTabText]}>Documents</Text>
        </TouchableOpacity>
      </View>

      {/* Render selected tab content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {selectedTab === 'details' && renderDetailsTab()}
        {selectedTab === 'actions' && renderButtons()}
        {selectedTab === 'documents' && renderDocumentsTab()}
      </ScrollView>
    </View>
  );
};

export default MyCentreDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    paddingTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  tab: {
    paddingVertical: 10,
    flex: 1,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#bd84f6',
  },
  tabText: {
    fontSize: 18,
    color: '#555',
  },
  activeTabText: {
    color: '#bd84f6',
    fontWeight: 'bold',
  },
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
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  documentText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#bd84f6',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
    fontSize: 18,
  },
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

