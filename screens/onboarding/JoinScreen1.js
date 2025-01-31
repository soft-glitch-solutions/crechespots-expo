import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Import assets
const topBackground = require('../../assets/images/Background Shape.png');
const mainImage = require('../../assets/images/teacher_trying_to_get_mikaeel_to_speak 1.png');

const JoinScreen1 = () => {
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
});

export default JoinScreen1;
