import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Import assets
const topBackground = require('../../assets/images/BackgroundShapeob3.png');
const mainImage = require('../../assets/images/delisha_read_to_the_ghetto.png');

const JoinScreen3 = ({ navigation }) => {
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
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => console.log('Skip')}>
          <Text style={styles.skipText}>SKIP</Text>
        </TouchableOpacity>
        <View style={styles.pagination}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <TouchableOpacity onPress={() => console.log('Next')}>
          <Text style={styles.nextText}>NEXT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundShape: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: '10%',
  },
  mainImage: {
    width: '100%',
    height: '40%',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
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

export default JoinScreen3;
