import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Ensure the correct import path

const FeedDetails = ({ route, navigation }) => {
  const { article } = route.params; // Get the article data from route params

  const handleDonate = async () => {
    // Implement donation logic here
    Alert.alert('Donation', 'Donation functionality is not implemented yet.');
  };

  const handleBookEvent = async () => {
    // Implement event booking logic here
    Alert.alert('Booking', 'Event booking functionality is not implemented yet.');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#007bff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.date}>{new Date(article.created_at).toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Article Content */}
      <Text style={styles.content}>{article.content}</Text>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {article.type === 'Donation' && (
          <TouchableOpacity style={styles.actionButton} onPress={handleDonate}>
            <Icon name="hand-heart" size={24} color="#fff" />
            <Text style={styles.actionText}>Donate</Text>
          </TouchableOpacity>
        )}
        {article.type === 'Events' && (
          <TouchableOpacity style={styles.actionButton} onPress={handleBookEvent}>
            <Icon name="calendar-check" size={24} color="#fff" />
            <Text style={styles.actionText}>Book Event</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  content: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 28,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    elevation: 4, // Shadow effect for modern look
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
});

export default FeedDetails;
