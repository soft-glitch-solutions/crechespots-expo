import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MaterialIcons, Entypo } from '@expo/vector-icons'; // For icons
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabaseClient';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';

WebBrowser.maybeCompleteAuthSession();


const Login = ({ navigation, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_GOOGLE_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_GOOGLE_IOS_CLIENT_ID',
    androidClientId: 'YOUR_GOOGLE_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID',
  });

  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: 'YOUR_FACEBOOK_CLIENT_ID',
  });

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        Alert.alert('Login Error', authError.message);
        setLoading(false);
        return;
      }

      await AsyncStorage.setItem('userSession', JSON.stringify(data.session));
      onLogin(); // Call onLogin to update authentication state
    } catch (error) {
      Alert.alert('Login Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // Handle Google login with Supabase
      const signInWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: authentication.accessToken,
        });

        if (error) {
          Alert.alert('Google Login Error', error.message);
        } else {
          await AsyncStorage.setItem('userSession', JSON.stringify(data.session));
          onLogin(); // Call onLogin to update authentication state
        }
      };

      signInWithGoogle();
    }
  }, [response]);

  useEffect(() => {
    if (fbResponse?.type === 'success') {
      const { authentication } = fbResponse;
      // Handle Facebook login with Supabase
      const signInWithFacebook = async () => {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'facebook',
          token: authentication.accessToken,
        });

        if (error) {
          Alert.alert('Facebook Login Error', error.message);
        } else {
          await AsyncStorage.setItem('userSession', JSON.stringify(data.session));
          onLogin(); // Call onLogin to update authentication state
        }
      };

      signInWithFacebook();
    }
  }, [fbResponse]);

  return (
    <View style={styles.container}>
      {/* Background Shapes */}
      <View style={styles.backgroundShape1} />
      <View style={styles.backgroundShape2} />

      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.title}>Welcome Back</Text>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Entypo name="lock" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Forgot Password Link */}
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Social Login Buttons */}
        <TouchableOpacity
          style={[styles.socialButton, styles.googleButton]}
          onPress={() => promptAsync()}
          disabled={!request}
        >
          <Text style={styles.socialButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, styles.facebookButton]}
          onPress={() => fbPromptAsync()}
          disabled={!fbRequest}
        >
          <Text style={styles.socialButtonText}>Sign in with Facebook</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Logging In...' : 'Login'}</Text>
        </TouchableOpacity>

        {/* Sign-Up Link */}
        <Text style={styles.signUpText}>
          Don't have an account?{' '}
          <Text style={styles.signUpLink} onPress={() => navigation.navigate('SignUp')}>
            Sign Up
          </Text>
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  backgroundShape1: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 200,
    height: 200,
    backgroundColor: '#bd84f6',
    borderRadius: 100,
    opacity: 0.1,
  },
  backgroundShape2: {
    position: 'absolute',
    bottom: -50,
    right: -50,
    width: 200,
    height: 200,
    backgroundColor: '#DB4437',
    borderRadius: 100,
    opacity: 0.1,
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#bd84f6',
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#bd84f6',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  socialButton: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    marginTop: 10,
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  facebookButton: {
    backgroundColor: '#3b5998',
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signUpText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  signUpLink: {
    color: '#bd84f6',
    fontWeight: 'bold',
  },
});

export default Login;