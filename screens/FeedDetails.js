import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FeedDetails = ({ route, navigation }) => {
  const { article } = route.params; // Get the article data from route params

  const handleDonate = async () => {
    Alert.alert('Donation', 'Donation functionality is not implemented yet.');
  };

  const handleBookEvent = async () => {
    Alert.alert('Booking', 'Event booking functionality is not implemented yet.');
  };

  const [comment, setComment] = React.useState('');
  const [comments, setComments] = React.useState([]); // Example comment array

  const handleAddComment = () => {
    if (comment) {
      setComments([{ text: comment, id: comments.length + 1 }, ...comments]);
      setComment('');
    }
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

      {/* Like, Comment, Share Section */}
      <View style={styles.interactionContainer}>
        <TouchableOpacity style={styles.interactionButton}>
          <Icon name="thumb-up-outline" size={24} color="#555" />
          <Text style={styles.interactionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.interactionButton} onPress={() => {}}>
          <Icon name="comment-outline" size={24} color="#555" />
          <Text style={styles.interactionText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.interactionButton}>
          <Icon name="share-outline" size={24} color="#555" />
          <Text style={styles.interactionText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Comment Input */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity style={styles.postButton} onPress={handleAddComment}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      {comments.length > 0 && (
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsHeader}>Comments</Text>
          {comments.map((comment) => (
            <View key={comment.id} style={styles.comment}>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
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
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#555',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingLeft: 16,
    fontSize: 16,
  },
  postButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 10,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  commentsContainer: {
    marginTop: 20,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  comment: {
    marginBottom: 12,
  },
  commentText: {
    fontSize: 16,
    color: '#444',
  },
});

export default FeedDetails;
