import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, ScrollView } from 'react-native';
import supabase from '../../supabaseClient';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

const LessonsDetails = ({ route, navigation }) => {
  const { crecheId } = route.params;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events') 
        .select('*')
        .eq('creche_id', crecheId);

      if (error) {
        throw error;
      }

      setEvents(data);
    } catch (error) {
      Alert.alert('Error', error.message || 'Error fetching events');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#bd84f6" style={styles.loader} />;
  }

  // Get the current week (from Monday to Sunday)
  const startOfWeek = moment().startOf('week').format('YYYY-MM-DD');
  const endOfWeek = moment().endOf('week').format('YYYY-MM-DD');

  // Filter events for the current week
  const filteredEvents = events.filter(event => {
    const eventDate = moment(event.start).format('YYYY-MM-DD');
    return moment(eventDate).isBetween(startOfWeek, endOfWeek, 'days', '[]');
  });

  // Format events for display
  const eventsByDay = filteredEvents.reduce((acc, event) => {
    const eventDate = moment(event.start).format('YYYY-MM-DD');
    if (!acc[eventDate]) acc[eventDate] = [];
    acc[eventDate].push(event);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Icon name="arrow-left" size={20} color="#bd84f6" />
      </TouchableOpacity>
      <Text style={styles.title}>Lesson Plan for the Week</Text>

      {/* Week View Calendar */}
      <Calendar
        current={startOfWeek}
        minDate={startOfWeek}
        maxDate={endOfWeek}
        markedDates={Object.keys(eventsByDay).reduce((acc, date) => {
          acc[date] = { marked: true, dotColor: '#bd84f6' };
          return acc;
        }, {})}
        markingType="dot"
        theme={{
          calendarBackground: '#fff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#bd84f6',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#bd84f6',
          dayTextColor: '#2d4150',
          arrowColor: '#bd84f6',
          monthTextColor: '#bd84f6',
          indicatorColor: '#bd84f6',
        }}
      />

      {/* Events List for the Current Week */}
      <ScrollView style={styles.eventsContainer}>
        {Object.keys(eventsByDay).map(date => {
          const dayName = moment(date).format('dddd, MMMM D');
          return (
            <View key={date} style={styles.dayContainer}>
              <Text style={styles.dayTitle}>{dayName}</Text>
              {eventsByDay[date].map((event, index) => (
                <View key={index} style={[styles.event, { backgroundColor: event.color_code || '#e0e0e0' }]}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventTime}>
                    {moment(event.start).format('HH:mm')} - {moment(event.end_time).format('HH:mm')}
                  </Text>
                </View>
              ))}
            </View>
          );
        })}
        {filteredEvents.length === 0 && <Text style={styles.noEventsText}>No events for this week.</Text>}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  eventsContainer: {
    marginTop: 20,
  },
  dayContainer: {
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  event: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventTime: {
    fontSize: 14,
    color: '#555',
  },
  noEventsText: {
    textAlign: 'center',
    color: '#888',
  },
});

export default LessonsDetails;
