import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import supabase from '../../supabaseClient';
import { ContributionGraph } from 'react-native-chart-kit';

const AttendanceHeatmap = ({ studentId }) => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance_students')
        .select('attendance_date, status')
        .eq('student_id', studentId);

      if (error) throw error;

      const formattedData = data.map((entry) => {
        let color = '#000000'; // Default color (black)
        switch (entry.status) {
          case 'Present':
            color = '#00FF00'; // Green for Present
            break;
          case 'Absent':
            color = '#FF0000'; // Red for Absent
            break;
          case 'Late':
            color = '#FFA500'; // Orange for Late
            break;
          default:
            color = '#000000'; // Default color (black)
        }

        return {
          date: entry.attendance_date,
          count: 1, // Each entry represents one attendance record
          color, // Add the color property
        };
      });

      setAttendanceData(formattedData);
    } catch (error) {
      console.error('Error fetching attendance data:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Heatmap</Text>
      <ContributionGraph
        values={attendanceData}
        endDate={new Date()}
        numDays={100}
        width={300}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default AttendanceHeatmap;