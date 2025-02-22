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
} from 'react-native';
import { supabase } from '../supabaseClient';

const SignUp = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateId = (id) => /^[0-9]{13}$/.test(id); // Checks 13-digit numeric only

  const handleSignUp = async () => {
    setError('');

    // **Validation Checks**
    if (!userId || !displayName || !email || !phoneNumber || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (!validateId(userId)) {
      setError('User ID must be exactly 13 digits and contain only numbers.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);

    try {
      // **Check if ID already exists**
      const { data: existingUser, error: idCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (existingUser) {
        setError('This User ID is already taken.');
        setLoading(false);
        return;
      }

      if (idCheckError && idCheckError.code !== 'PGRST116') {
        setError('Error checking ID availability.');
        setLoading(false);
        return;
      }

      // **Create user in Supabase Auth**
      const { data, error: authError } = await supabase.auth.signUp({ email, password });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // **Store additional user details in the database**
        const { error: dbError } = await supabase.from('users').upsert({
          id: userId, // 13-digit User ID
          auth_id: data.user.id, // Supabase Auth-generated ID
          display_name: displayName,
          phone_number: phoneNumber,
          email,
          created_at: new Date().toISOString(),
        });

        if (dbError) {
          setError(dbError.message);
          setLoading(false);
          return;
        }

        Alert.alert('Sign Up Successful', 'Check your email to verify your account.');
        navigation.navigate('Login');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.title}>Create Account</Text>

        {/* User ID Input */}
        <View style={styles.inputContainer}>
          <Image source={require('../assets/icons/card.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="13-Digit User ID"
            value={userId}
            onChangeText={(text) => setUserId(text.replace(/\D/g, ''))} // Remove non-numeric
            keyboardType="numeric"
            maxLength={13}
          />
        </View>

        {/* Display Name Input */}
        <View style={styles.inputContainer}>
          <Image source={require('../assets/icons/woman.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
          />
        </View>

        {/* Email Input */}
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

        {/* Phone Number Input */}
        <View style={styles.inputContainer}>
          <Image source={require('../assets/icons/smartphone.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Image source={require('../assets/icons/padlock.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Image source={require('../assets/icons/padlock.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Sign Up Button */}
        <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleSignUp} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Create Account'}</Text>
        </TouchableOpacity>

        <Text style={styles.signInText}>
          Already have an account?{' '}
          <Text style={styles.signInLink} onPress={() => navigation.navigate('Login')}>
            Sign In
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
    elevation: 4,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
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
  signInText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  signInLink: {
    color: '#bd84f6',
    fontWeight: 'bold',
  },
});

export default SignUp;
