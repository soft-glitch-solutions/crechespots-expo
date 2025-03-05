import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper-flatlist';

const CrecheItem = ({ creche, onSelectCreche }) => {
  const { name, gallery, address, phone_number, capacity, logo, weekly_price, monthly_price, services, facilities } = creche;
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onSelectCreche(creche.id)}>
      {/* Favorite Button */}
      <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
        <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color={isFavorite ? '#ff4d4d' : '#fff'} />
      </TouchableOpacity>

      {/* Image Gallery */}
      {gallery && gallery.length > 0 && (
        <Swiper style={styles.swiper} showsPagination loop>
          {gallery.map((imageUrl, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: imageUrl }} style={styles.image} />
            </View>
          ))}
        </Swiper>
      )}

      {/* Creche Details */}
      <View style={styles.cardBody}>
        {name && <Text style={styles.name}>{name}</Text>}
        {address && <Text style={styles.address}>{address}</Text>}

        {/* Pricing */}
        <View style={styles.priceContainer}>
          {weekly_price && <Text style={styles.price}>R {weekly_price}/week</Text>}
          {monthly_price && <Text style={styles.price}>R {monthly_price}/month</Text>}
        </View>

        {/* Facilities & Services */}
        <View style={styles.iconRow}>
          {facilities?.kitchen && <MaterialCommunityIcons name="stove" size={20} color="#666" />}
          {facilities?.parking && <MaterialCommunityIcons name="car" size={20} color="#666" />}
          {facilities?.playground && <MaterialCommunityIcons name="swing" size={20} color="#666" />}
          {facilities?.toilets && <MaterialCommunityIcons name="toilet" size={20} color="#666" />}
        </View>

        <View style={styles.iconRow}>
          {services?.meals_provided && <MaterialCommunityIcons name="food" size={20} color="#666" />}
          {services?.transportation && <MaterialCommunityIcons name="bus" size={20} color="#666" />}
          {services?.special_education && <MaterialCommunityIcons name="school" size={20} color="#666" />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 6,
    borderRadius: 50,
  },
  swiper: {
    height: 200,
  },
  imageWrapper: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardBody: {
    padding: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    color: '#777',
  },
  details: {
    fontSize: 14,
    color: '#555',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#bd84f6',
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
});

export default CrecheItem;
