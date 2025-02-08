import React, { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Dimensions, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const OnboardingScreen = ({ onComplete }) => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle scroll to update the current index
  const handleScroll = (event) => {
    const index = Math.floor(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
    setCurrentIndex(index);
  };

  // Handle next button click
  const handleNext = () => {
    if (currentIndex < 2) {
      scrollViewRef.current.scrollTo({
        x: (currentIndex + 1) * screenWidth,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  // Handle skip button click
  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      onComplete();
    } catch (error) {
      console.error('Failed to set onboarding status:', error);
    }
  };

  // Handle get started button click
  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      onComplete();
    } catch (error) {
      console.error('Failed to set onboarding status:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollView}
      >
        {/* First Slide */}
        <View style={styles.screen}>
          <Image
            source={require('../assets/images/Background Shape.png')}
            style={[styles.backgroundShape, { height: screenHeight * 0.3 }]}
            resizeMode="cover"
          />
          <View style={styles.content}>
            <Image
              source={require('../assets/images/teacher_trying_to_get_mikaeel_to_speak 1.png')}
              style={styles.mainImage}
              resizeMode="contain"
            />
            <Text style={styles.title}>Welcome to CrecheSpots</Text>
            <Text style={styles.description}>Find a safe and trusted creche for your child</Text>
          </View>
        </View>

        {/* Second Slide */}
        <View style={styles.screen}>
          <Image
            source={require('../assets/images/BackgroundShapeob2.png')}
            style={[styles.backgroundShape, { height: screenHeight * 0.3 }]}
            resizeMode="cover"
          />
          <View style={styles.content}>
            <Image
              source={require('../assets/images/chuckie.png')}
              style={styles.mainImage}
              resizeMode="contain"
            />
            <Text style={styles.title}>Stay Connected</Text>
            <Text style={styles.description}>Keep track of what your child is doing, from playtime to learning moments.</Text>
          </View>
        </View>

        {/* Third Slide */}
        <View style={styles.screen}>
          <Image
            source={require('../assets/images/BackgroundShapeob3.png')}
            style={[styles.backgroundShape, { height: screenHeight * 0.3 }]}
            resizeMode="cover"
          />
          <View style={styles.content}>
            <Image
              source={require('../assets/images/delisha_read_to_the_ghetto.png')}
              style={styles.mainImage}
              resizeMode="contain"
            />
            <Text style={styles.title}>Peace of Mind</Text>
            <Text style={styles.description}>Get daily reports and updates, so you can feel confident about your child's care.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>SKIP</Text>
        </TouchableOpacity>
        <View style={styles.pagination}>
          {[0, 1, 2].map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentIndex && styles.activeDot]}
            />
          ))}
        </View>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>{currentIndex < 2 ? 'NEXT' : 'GET STARTED'}</Text>
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
  scrollView: {
    flexGrow: 1,
  },
  screen: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Prevent background and other elements from overflowing
  },
  backgroundShape: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1, // Ensure background is behind content
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: screenHeight * 0.25,
  },
  mainImage: {
    width: '80%',
    height: undefined,
    aspectRatio: 1,
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
    paddingHorizontal: screenWidth * 0.05,
    paddingBottom: screenHeight * 0.03,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  nextButton: {
    backgroundColor: '#6200ea',
    paddingVertical: screenHeight * 0.015,
    paddingHorizontal: screenWidth * 0.05,
    borderRadius: 5,
  },
  nextText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
