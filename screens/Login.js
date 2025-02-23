import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabaseClient';

const Login = ({ navigation, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        if (authError.message.includes('invalid login credentials')) {
          setError('Incorrect password. Please try again.');
        } else if (authError.message.includes('user not found')) {
          setError('No account found with this email. Please sign up.');
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }
      await AsyncStorage.setItem('userSession', JSON.stringify(data.session));
      onLogin(navigation); // Pass navigation prop to onLogin
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' || Platform.OS === 'android' ? 'padding' : 'height'} // Adjust behavior for both iOS and Android
  style={styles.container}
>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <View style={styles.inputContainer}>
          <Image source={require('../assets/icons/email.png')} style={styles.icon} />
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
          <Image source={require('../assets/icons/padlock.png')} style={styles.icon} />
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
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.socialContainer}>
          <TouchableOpacity>
            <Image source={require('../assets/icons/google.png')} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../assets/icons/facebook.png')} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Logging In...' : 'Login'}</Text>
        </TouchableOpacity>

        <Text style={styles.signUpText}>
          Don't have an account?{' '}
          <Text style={styles.signUpLink} onPress={() => navigation.navigate('Onboarding')}>
            Sign Up
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  brandLogo: {
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  eyeIcon: {
    width: 24,
    height: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    elevation: 4,
  },
  icon: {
    width: 24,
    height: 24,
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
    fontSize: 14,
    backgroundColor: '#ffe6e6',
    padding: 10,
    borderRadius: 5,
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#bd84f6',
    textAlign: 'center',
    marginTop: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  socialIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#bd84f6',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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