import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const placeholderImage = 'https://crechespots.org.za/wp-content/uploads/2024/08/recheSpot-1.gif';
const registeredIcon = require('../../assets/images/Registered.png');

const CrecheItem = ({ creche, onSelectCreche }) => {
  const logoUri = creche.logo && creche.logo.trim() !== "" ? creche.logo : placeholderImage;

  return (
    <TouchableOpacity
      style={styles.crecheItem}
      onPress={() => onSelectCreche(creche.id)}
    >
      {/* Main Image */}
      <Image
        source={{ uri: logoUri }}
        style={styles.mainImage}
        onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
      />

      {/* Price and Availability */}
      <View style={styles.priceContainer}>
        <Text style={styles.price}>R {creche.weekly_price}</Text>
        <Text style={styles.availability}>OPEN</Text>
      </View>

      {/* Title and Location */}
      <Text style={styles.title}>{creche.name}</Text>
      <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={16} color="#666" />
        <Text style={styles.locationText}>{creche.address}</Text>
      </View>

      {/* Distance */}
      <View style={styles.distanceContainer}>
        <Ionicons name="navigate-outline" size={16} color="#666" />
        <Text style={styles.distanceText}>
          {creche.distance ? creche.distance.toFixed(2) : 'N/A'} km
        </Text>
      </View>

      {/* Registered Icon */}
      {creche.registered && (
        <Image
          source={registeredIcon}
          style={styles.registeredIcon}
        />
      )}

      {/* View Details Button */}
      <TouchableOpacity style={styles.detailsButton} onPress={() => onSelectCreche(creche.id)}>
        <Text style={styles.detailsButtonText}>View Details</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  crecheItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  availability: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  registeredIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 50,
    height: 50,
  },
  detailsButton: {
    backgroundColor: '#bd84f6',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    margin: 16,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CrecheItem;
