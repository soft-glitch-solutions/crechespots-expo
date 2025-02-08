import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ButtonGrid = ({ handlePayFees }) => (
  <View style={styles.buttonGrid}>
    <TouchableOpacity
      style={styles.button}
      onPress={handlePayFees}>
      <Icon name="credit-card" size={20} color="#ffffff" style={styles.buttonIcon} />
      <Text style={styles.buttonText}>Pay Fees</Text>
    </TouchableOpacity>
    {/* Add other buttons */}
  </View>
);

const styles = StyleSheet.create({
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#bd84f6',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '48%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default ButtonGrid;
