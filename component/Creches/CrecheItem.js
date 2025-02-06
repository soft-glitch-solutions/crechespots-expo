import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper'; // Import Swiper for image carousel

const CrecheItem = ({ creche, onSelectCreche }) => {
  const { name, gallery, address, phone_number, capacity, logo } = creche;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onSelectCreche(creche.id)}
    >
      <View style={styles.cardHeader}>
        <Image
          source={{ uri: logo || placeholderImage }}
          style={styles.logo}
        />
        <Text style={styles.name}>{name}</Text>
      </View>

      <Swiper style={styles.swiper} showsButtons loop>
        {gallery.map((imageUrl, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
          </View>
        ))}
      </Swiper>

      <View style={styles.cardBody}>
        <Text style={styles.address}>{address}</Text>
        <Text style={styles.details}>Capacity: {capacity}</Text>
        <Text style={styles.details}>Phone: {phone_number}</Text>
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
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  swiper: {
    height: 200, // Adjust the height of the image carousel
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
  address: {
    fontSize: 14,
    color: '#555',
  },
  details: {
    fontSize: 14,
    color: '#777',
  },
});

export default CrecheItem;
