import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, Linking , StyleSheet } from 'react-native';
import supabase from '../supabaseClient';
import Loading from '../component/loadingComponent/loading';
import BackButton from '../component/BackButton';
import Tabs from '../component/Child/Tabs';
import StudentDetailsCard from '../component/Child/StudentDetailsCard';
import DocumentList from '../component/Child/DocumentList';
import ButtonGrid from '../component/Child/ButtonGrid';
import AttendanceHeatmap from '../component/Child/AttendanceHeatmap'; // New component for attendance heatmap
import SendNoteForm from '../component/Child/SendNoteForm'; // New component for sending notes
import UpdateProfileForm from '../component/Child/UpdateProfileForm'; // New component for updating profile
import RequestMeetingForm from '../component/Child/RequestMeetingForm'; // New component for requesting a meeting

const MyChildDetails = ({ route, navigation }) => {
  const { studentId } = route.params;
  const [student, setStudent] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('details');
  const [selectedAction, setSelectedAction] = useState(null); // Track selected action

  useEffect(() => {
    fetchStudentDetails();
    fetchStudentDocuments();
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
  };

  const handleDocumentClick = (url) => {
    Linking.openURL(url).catch((err) => Alert.alert('Error', 'Could not open document.'));
  };

  if (loading) {
    return <Loading />;
  }

  if (!student) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Student details not found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <BackButton onPress={() => navigation.goBack()} />
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
        Student Details
      </Text>

      <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {selectedTab === 'details' && <StudentDetailsCard student={student} />}
        {selectedTab === 'actions' && (
          <>
            {selectedAction === null && (
              <ButtonGrid setSelectedAction={setSelectedAction} />
            )}
            {selectedAction === 'attendance' && <AttendanceHeatmap studentId={studentId} />}
            {selectedAction === 'sendNote' && <SendNoteForm studentId={studentId} />}
            {selectedAction === 'updateProfile' && <UpdateProfileForm studentId={studentId} />}
            {selectedAction === 'requestMeeting' && <RequestMeetingForm studentId={studentId} />}
          </>
        )}
        {selectedTab === 'documents' && <DocumentList documents={documents} handleDocumentClick={handleDocumentClick} />}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  carousel: {
    height: 250,
  },
  carouselImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  noImagesText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 18,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoValue: {
    marginLeft: 8,
    color: '#555',
  },
  link: {
    color: '#007bff',
  },
  tabContent: {
    padding: 16,
  },
  applyButtonContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  applyButton: {
    backgroundColor: '#bd84f6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MyChildDetails;
