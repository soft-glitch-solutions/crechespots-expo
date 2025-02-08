import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Import assets
const topBackground = require('../../assets/images/BackgroundShapeob2.png');
const mainImage = require('../../assets/images/chuckie.png');

const JoinScreen2 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Top Background Shape */}
      <Image
        source={topBackground}
        style={[styles.backgroundShape, { width: screenWidth, height: screenHeight * 0.3 }]}
        resizeMode="cover"
      />

      {/* Main Content */}
      <View style={styles.content}>
        <Image
          source={mainImage}
          style={styles.mainImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>This is the title of the onboarding</Text>
        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis
        </Text>
      </View>

      {/* Footer Navigation */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start', // Ensures content starts below the background
  },
  backgroundShape: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1, // Keeps the background behind content
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: screenHeight * 0.2, // Adjust paddingTop to ensure enough space for background
  },
  mainImage: {
    width: '80%', // Ensures the image is responsive and does not take up the entire screen
    height: undefined,
    aspectRatio: 1, // Maintains the aspect ratio of the image
    marginBottom: 20,
  },
  title: {
    fontSize: 18, // Adjusted font size for a better fit on smaller screens
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
    width: '80%', // Limits the title width to fit the screen
  },
  description: {
    fontSize: 14, // Reduced font size for better readability on mobile screens
    textAlign: 'center',
    color: '#555',
    lineHeight: 20,
    marginHorizontal: 20, // Adds horizontal padding to prevent text from touching the edges
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    position: 'absolute', // Ensures the footer stays at the bottom
    bottom: 0,
    width: '100%',
  },
  skipText: {
    fontSize: 14,
    color: '#888',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#6200ea',
  },
  nextText: {
    fontSize: 14,
    color: '#6200ea',
    fontWeight: 'bold',
  },
});

export default JoinScreen2;
