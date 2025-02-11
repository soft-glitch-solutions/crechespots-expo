// FeedDetails.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FeedDetails = ({ route, navigation }) => {
  const { article } = route.params;
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.hearts || 0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleAddComment = () => {
    if (comment) {
      setComments([{ text: comment, id: comments.length + 1 }, ...comments]);
      setComment('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{article.title}</Text>
      </View>
      <Image source={{ uri: article.image }} style={styles.image} />
      <Text style={styles.content}>{article.content}</Text>
      
      <View style={styles.interactionContainer}>
        <TouchableOpacity onPress={toggleLike} style={styles.interactionButton}>
          <Icon name={isLiked ? "heart" : "heart-outline"} size={24} color={isLiked ? "#e74c3c" : "#555"} />
          <Text style={styles.interactionText}>{likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.interactionButton}>
          <Icon name="comment-outline" size={24} color="#555" />
          <Text style={styles.interactionText}>Comment</Text>
        </TouchableOpacity>
      </View>
      
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
      {comments.map((comment) => (
        <View key={comment.id} style={styles.comment}>
          <Text>{comment.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  backButton: { marginRight: 16 },
  title: { fontSize: 20, fontWeight: 'bold' },
  image: { width: '100%', height: 300, resizeMode: 'cover' },
  content: { padding: 10, fontSize: 16 },
  interactionContainer: { flexDirection: 'row', padding: 10, justifyContent: 'space-between' },
  interactionButton: { flexDirection: 'row', alignItems: 'center' },
  interactionText: { marginLeft: 5 },
  commentInputContainer: { flexDirection: 'row', padding: 10, alignItems: 'center' },
  commentInput: { flex: 1, borderWidth: 1, borderRadius: 20, padding: 10 },
  postButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 20 },
  postButtonText: { color: '#fff' },
  comment: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
});

export default FeedDetails;
