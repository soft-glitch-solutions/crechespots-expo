import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
  Alert,
  Image,
  Keyboard,
  KeyboardEvent,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // For dropdown
import * as ImagePicker from 'expo-image-picker'; // For image upload
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabaseClient';

const { width: screenWidth } = Dimensions.get('window');

// List of South African provinces
const provinces = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
];

const OnboardingScreen = ({ onComplete, navigation }) => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleScroll = (event) => {
    const index = Math.floor(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < 7) {
      scrollViewRef.current.scrollTo({ x: (currentIndex + 1) * screenWidth, animated: true });
    } else {
      handleSignUp();
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !firstName || !lastName || idNumber.length !== 13 || !city || !province || !profilePicture) {
      Alert.alert('Error', 'Please fill in all fields and upload a profile picture.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      // Step 1: Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        Alert.alert('Signup Failed', authError.message);
        return;
      }

      // Step 2: Upload profile picture to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(`public/${email}-profile.jpg`, profilePicture);

      if (uploadError) {
        Alert.alert('Upload Failed', uploadError.message);
        return;
      }

      // Step 3: Insert user details into public.users table
      const { error: dbError } = await supabase.from('users').insert([
        {
          email,
          first_name: firstName,
          last_name: lastName,
          id_number: idNumber,
          city,
          province,
          profile_picture_url: uploadData?.path,
        },
      ]);

      if (dbError) {
        Alert.alert('Database Error', dbError.message);
        return;
      }

      // Step 4: Mark onboarding as complete and navigate
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      await AsyncStorage.setItem('authToken', 'dummyToken');
      onComplete();
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const handleSkipToLogin = () => {
    navigation.navigate('Login');
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePicture(result.uri);
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
        contentContainerStyle={[
          styles.scrollView,
          { paddingBottom: keyboardHeight > 0 ? 20 : 100 },
        ]}
      >
        {/* Onboarding Slide 1 */}
        <View style={styles.screen}>
          <Image source={require('../assets/images/teacher_trying_to_get_mikaeel_to_speak.png')} style={styles.image} />
          <Text style={styles.title}>Welcome to Our App!</Text>
          <Text style={styles.blurb}>We're excited to have you here. Let's get started.</Text>
        </View>

        {/* Onboarding Slide 2 */}
        <View style={styles.screen}>
          <Image source={require('../assets/images/chuckie.png')} style={styles.image} />
          <Text style={styles.title}>Learn and Grow</Text>
          <Text style={styles.blurb}>Discover new ways to achieve your goals with our platform.</Text>
        </View>

        {/* Onboarding Slide 3 */}
        <View style={styles.screen}>
          <Image source={require('../assets/images/logo.png')} style={styles.image} />
          <Text style={styles.title}>Get Started</Text>
          <Text style={styles.blurb}>Let's set up your account to unlock all features.</Text>
        </View>

        {/* Signup Slide 1 - Email */}
        <View style={styles.screen}>
          <Image source={require('../assets/icons/email.png')} style={styles.image} />
          <Text style={styles.title}>Enter your Email</Text>
          <Text style={styles.blurb}>We'll use this to create your account.</Text>
          <KeyboardAvoidingView
            style={styles.inputContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          >
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </KeyboardAvoidingView>
        </View>

        {/* Signup Slide 2 - Password and Confirm Password */}
        <View style={styles.screen}>
          <Image source={require('../assets/icons/padlock.png')} style={styles.image} />
          <Text style={styles.title}>Create a Password</Text>
          <Text style={styles.blurb}>Choose a strong password to secure your account.</Text>

          {/* Password Field */}
          <KeyboardAvoidingView
            style={styles.inputContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          >
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={
                  showPassword
                    ? require('../assets/icons/eye-open.png')
                    : require('../assets/icons/eye-closed.png')
                }
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </KeyboardAvoidingView>

          {/* Confirm Password Field */}
          <KeyboardAvoidingView
            style={styles.inputContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          >
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Image
                source={
                  showConfirmPassword
                    ? require('../assets/icons/eye-open.png')
                    : require('../assets/icons/eye-closed.png')
                }
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>

        <View style={styles.screen}>
          <Image source={require('../assets/icons/label.png')} style={styles.image} />
          <Text style={styles.title}>Your Name</Text>
          <Text style={styles.blurb}>Tell us a little about yourself.</Text>
          <KeyboardAvoidingView
            style={styles.inputContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          >
            <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
          </KeyboardAvoidingView>
          <KeyboardAvoidingView
            style={styles.inputContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          >
            <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
          </KeyboardAvoidingView>
        </View>

        {/* Signup Slide 4 - ID Number */}
        <View style={styles.screen}>
          <Image source={require('../assets/icons/card.png')} style={styles.image} />
          <Text style={styles.title}>Enter Your ID Number</Text>
          <Text style={styles.blurb}>This helps us verify your identity.</Text>
          <KeyboardAvoidingView
            style={styles.inputContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          >
            <TextInput
              style={styles.input}
              placeholder="ID Number"
              value={idNumber}
              onChangeText={setIdNumber}
              keyboardType="numeric"
              maxLength={13}
            />
          </KeyboardAvoidingView>
        </View>

        {/* Signup Slide 5 - City and Province */}
        <View style={styles.screen}>
          <Image source={require('../assets/icons/location.png')} style={styles.image} />
          <Text style={styles.title}>Your Location</Text>
          <Text style={styles.blurb}>Let us know where you're from.</Text>

          <View style={styles.inputContainer}>
            <Picker
              selectedValue={province}
              onValueChange={(itemValue) => setProvince(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Province" value="" />
              {provinces.map((province, index) => (
                <Picker.Item key={index} label={province} value={province} />
              ))}
            </Picker>
          </View>
          <KeyboardAvoidingView
            style={styles.inputContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          >
            <TextInput
              style={styles.input}
              placeholder="City"
              value={city}
              onChangeText={setCity}
            />
          </KeyboardAvoidingView>
        </View>

        {/* Signup Slide 6 - Profile Picture */}
        <View style={styles.screen}>
          <Image source={require('../assets/icons/camera.png')} style={styles.image} />
          <Text style={styles.title}>Let Us See What You Look Like</Text>
          <Text style={styles.blurb}>Upload a profile picture so we can recognize you.</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadButtonText}>Upload Profile Picture</Text>
          </TouchableOpacity>
          {profilePicture && (
            <Image source={{ uri: profilePicture }} style={styles.profileImage} />
          )}
        </View>
      </ScrollView>

      {/* Footer Navigation - Will be covered by keyboard */}
      <View style={[styles.footer, { bottom: keyboardHeight > 0 ? -keyboardHeight : 20 }]}>
        {currentIndex >= 3 && currentIndex < 7 && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkipToLogin}>
            <Text style={styles.skipText}>Skip to Login</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>{currentIndex < 8 ? 'NEXT' : 'SIGN UP'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flexGrow: 1,
  },
  screen: { width: screenWidth, justifyContent: 'center', alignItems: 'center', padding: 20 },
  image: { width: 200, height: 200, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#333', textAlign: 'center' },
  blurb: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    elevation: 4,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  pickerContainer: {
    width: '80%',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  picker: {
    width: '100%',
  },
  uploadButton: {
    backgroundColor: '#bd84f6',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  nextButton: { backgroundColor: '#bd84f6', padding: 15, borderRadius: 10, width: '80%', alignItems: 'center' },
  nextText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  skipButton: { marginBottom: 10 },
  skipText: { color: '#bd84f6', fontSize: 16, fontWeight: 'bold' },
});

export default OnboardingScreen;