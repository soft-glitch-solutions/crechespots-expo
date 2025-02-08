import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, Linking } from 'react-native';
import supabase from '../supabaseClient';
import Loading from '../component/loadingComponent/loading';
import BackButton from '../component/BackButton';
import Tabs from '../component/Child/Tabs';
import StudentDetailsCard from '../component/Child/StudentDetailsCard';
import DocumentList from '../component/Child/DocumentList';
import ButtonGrid from '../component/Child/ButtonGrid';
import moment from 'moment';

const MyChildDetails = ({ route, navigation }) => {
  const { studentId } = route.params;
  const [student, setStudent] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('details');

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
        {selectedTab === 'actions' && <ButtonGrid handlePayFees={handlePayFees} />}
        {selectedTab === 'documents' && <DocumentList documents={documents} handleDocumentClick={handleDocumentClick} />}
      </ScrollView>
    </View>
  );
};

export default MyChildDetails;
