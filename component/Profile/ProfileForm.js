import React from 'react';
import { View, TextInput, StyleSheet, Picker } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

// List of South African provinces
const southAfricanProvinces = [
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

const ProfileForm = ({ profile, onChange }) => {
  const safeProfile = profile || {};

  return (
    <>
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#bd84f6" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={safeProfile.name || ''}
          onChangeText={(text) => onChange('name', text)}
          accessibilityLabel="Name"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#bd84f6" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={safeProfile.email || ''}
          onChangeText={(text) => onChange('email', text)}
          accessibilityLabel="Email"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="id-card" size={20} color="#bd84f6" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="ID Number"
          value={safeProfile.id_number || ''}
          onChangeText={(text) => onChange('id_number', text)}
          accessibilityLabel="ID Number"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="map-marker" size={20} color="#bd84f6" style={styles.icon} />
        <Picker
          style={styles.picker}
          selectedValue={safeProfile.province || ''}
          onValueChange={(itemValue) => onChange('province', itemValue)}
          accessibilityLabel="Province"
        >
          <Picker.Item label="Select Province" value="" />
          {southAfricanProvinces.map((province, index) => (
            <Picker.Item key={index} label={province} value={province} />
          ))}
        </Picker>
      </View>
      <View style={styles.inputContainer}>
        <Icon name="map-marker" size={20} color="#bd84f6" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="City"
          value={safeProfile.city || ''}
          onChangeText={(text) => onChange('city', text)}
          accessibilityLabel="City"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="info-circle" size={20} color="#bd84f6" style={styles.icon} />
        <TextInput
          style={styles.bioInput}
          placeholder="Bio"
          value={safeProfile.bio || ''}
          onChangeText={(text) => onChange('bio', text)}
          multiline
          accessibilityLabel="Bio"
        />
      </View>
    </>
  );
};

ProfileForm.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    id_number: PropTypes.string,
    province: PropTypes.string,
    city: PropTypes.string,
    bio: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  bioInput: {
    flex: 1,
    height: 100,
    paddingHorizontal: 10,
    borderRadius: 4,
    textAlignVertical: 'top',
  },
  picker: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
});

export default ProfileForm;