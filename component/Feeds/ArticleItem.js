import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const getTypeColor = (type) => {
  switch (type) {
    case 'Events':
      return '#bd84f6';
    case 'Helpful':
      return '#9cdbc8';
    case 'Donation':
      return '#84a7f6';
    default:
      return '#ffffff';
  }
};

const ArticleItem = ({ article, onHeart, onSave, onReport }) => {
  const typeColor = getTypeColor(article.type);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isHearted, setIsHearted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleHeart = () => {
    setIsHearted(!isHearted);
    onHeart(article.id, !isHearted);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave(article.id, !isSaved);
    setIsMenuVisible(false);
  };

  const handleReport = () => {
    onReport(article.id);
    setIsMenuVisible(false);
  };

  return (
    <View style={[styles.article, { backgroundColor: typeColor }]}>
      {/* Profile & Header */}
      <View style={styles.header}>
        <Image source={{ uri: article.author.profile_pic }} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <Text style={styles.articleAuthor}>{article.author.display_name}</Text>
          <Text style={styles.articleCreche}>{article.author.creche_name || 'Unknown Creche'}</Text>
          <Text style={styles.articleTime}>{article.time}</Text>
        </View>

        {/* Menu Button */}
        <TouchableOpacity onPress={() => setIsMenuVisible(!isMenuVisible)}>
          <Text style={styles.menuDots}>⋮</Text>
        </TouchableOpacity>

        {isMenuVisible && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={handleSave}>
              <Text>{isSaved ? 'Unsave Post' : 'Save Post'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleReport}>
              <Text>Report Post</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Post Content */}
      <Text style={styles.articleTitle}>{article.title}</Text>
      <Text style={styles.articleContent}>{article.content}</Text>

      {/* Post Stats (Like, Comment, Save) */}
      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statItem} onPress={handleHeart}>
          <Image
            source={isHearted ? require('../../assets/heart-filled.png') : require('../../assets/heart-outline.png')}
            style={styles.icon}
          />
          <Text style={styles.statText}>{article.hearts + (isHearted ? 1 : 0)}</Text>
        </TouchableOpacity>

        <View style={styles.statItem}>
          <Image source={require('../../assets/custom-comment.png')} style={styles.icon} />
          <Text style={styles.statText}>{article.comments || 0}</Text>
        </View>

        <TouchableOpacity style={styles.statItem} onPress={handleSave}>
          <Image
            source={isSaved ? require('../../assets/save-filled.png') : require('../../assets/save-outline.png')}
            style={styles.icon}
          />
          <Text style={styles.statText}>{isSaved ? 'Saved' : 'Save'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  article: {
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  articleAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  articleCreche: {
    fontSize: 14,
    color: '#777',
  },
  articleTime: {
    fontSize: 12,
    color: '#999',
  },
  menuDots: {
    fontSize: 24,
    color: '#333',
    padding: 5,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  articleContent: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

export default ArticleItem;
