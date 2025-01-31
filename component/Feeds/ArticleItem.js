import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Ensure correct import path

const getTypeColor = (type) => {
  switch (type) {
    case 'Events':
      return '#f68484'; // Light red for Events
    case 'Helpful':
      return '#f6cc84'; // Light green for Helpful
    case 'Donation':
      return '#84a7f6'; // Light blue for Donation
    default:
      return '#ffffff'; // Default background color
  }
};

const ArticleItem = ({ article, isHearted, onHeart, onSave, onReport }) => {
  const typeColor = getTypeColor(article.type);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave(article.id, !isSaved);
    setIsMenuVisible(false); // Close the menu after saving
  };

  const handleReport = () => {
    onReport(article.id);
    setIsMenuVisible(false); // Close the menu after reporting
  };

  return (
    <View style={[styles.article, { backgroundColor: typeColor }]}>
      <View style={styles.header}>
        <Text style={styles.articleAuthor}>{article.author.display_name}</Text>
        <Text style={styles.articleTime}>{article.time}</Text>
        <TouchableOpacity onPress={() => setIsMenuVisible(true)}>
          <Icon name="dots-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.articleTitle}>{article.title}</Text>
      <Text style={styles.articleContent}>{article.content}</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Icon name="heart" size={16} color="#ff0000" />
          <Text style={styles.statText}>{article.hearts || 0}</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="comment" size={16} color="#0000ff" />
          <Text style={styles.statText}>{article.comments || 0}</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="share" size={16} color="#00ff00" />
          <Text style={styles.statText}>{article.shares || 0}</Text>
        </View>
      </View>

      {/* Three-dot menu modal */}
      <Modal visible={isMenuVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleSave}>
              <Text>{isSaved ? 'Unsave Post' : 'Save Post'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleReport}>
              <Text>Report Post</Text>
            </TouchableOpacity>
            <Button title="Close" onPress={() => setIsMenuVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  article: {
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  articleAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  articleTime: {
    fontSize: 14,
    color: '#555555',
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  articleContent: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    width: '80%',
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default ArticleItem;