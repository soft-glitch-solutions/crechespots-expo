import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const BackButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}>
    <Icon name="arrow-left" size={20} color="#bd84f6" />
  </TouchableOpacity>
);

export default BackButton;
