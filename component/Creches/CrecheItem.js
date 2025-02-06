import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';

const placeholderImage = 'https://crechespots.org.za/wp-content/uploads/2024/08/recheSpot-1.gif';
const registeredIcon = require('../../assets/images/Registered.png');

const CrecheItem = ({ creche, onSelectCreche }) => {
  const logoUri = creche.logo && creche.logo.trim() !== "" ? creche.logo : placeholderImage;

  return (
    <TouchableOpacity
      style={styles.crecheItem}
      onPress={() => onSelectCreche(creche.id)}
    >
      {/* Gallery */}
      {creche.gallery && creche.gallery.length > 0 ? (
        <Swiper style={styles.carousel} showsPagination loop>
          {creche.gallery.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.carouselImage} />
          ))}
        </Swiper>
      ) : (
        <Image source={{ uri: logoUri }} style={styles.mainImage} />
      )}

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
      <View style={styles.registeredContainer}>
        {creche.registered && (
          <Image
            source={registeredIcon}
            style={styles.registeredIcon}
          />
        )}
        <Image
          source={{ uri: logoUri }}
          style={styles.logo}
        />
      </View>

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
  carousel: {
    height: 150,
  },
  carouselImage: {
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
  registeredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  registeredIcon: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25, // Make it circular
    marginLeft: 10,
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
