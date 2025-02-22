import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';  // Importing trash icon
import supabase from '../supabaseClient';
import CrecheItem from '../component/Creches/CrecheItem';
import SearchInput from '../component/Creches/SearchInput';
import Loading from '../component/loadingComponent/loading';

const CAPE_TOWN_CENTRAL = { latitude: -33.9249, longitude: 18.4241 };

const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const CrecheList = () => {
  const [creches, setCreches] = useState([]);
  const [filteredCreches, setFilteredCreches] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [roadName, setRoadName] = useState('');
  const [savedLocations, setSavedLocations] = useState([]);
  const [manualLocation, setManualLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchLocation();
    loadSavedLocations();
  }, []);

  const fetchLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') throw new Error('Location permission denied');

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

      const url = `https://nominatim.openstreetmap.org/reverse?lat=${location.coords.latitude}&lon=${location.coords.longitude}&format=json`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.address) {
        const address = `${data.address.road || 'Unknown Road'}, ${data.address.city || 'Unknown City'}`;
        setRoadName(address);
        saveLocation(address, location.coords);
      } else {
        setRoadName('Unknown Location');
      }
    } catch (error) {
      setError(`Error fetching location: ${error.message}`);
      setUserLocation(CAPE_TOWN_CENTRAL);
      setRoadName('Cape Town Central');
    }
  };

  const saveLocation = async (name, coords) => {
    try {
      const newLocation = { name, coords };
      const existingLocations = await AsyncStorage.getItem('savedLocations');
      let locations = existingLocations ? JSON.parse(existingLocations) : [];

      if (!locations.some((loc) => loc.name === name)) {
        locations.push(newLocation);
        await AsyncStorage.setItem('savedLocations', JSON.stringify(locations));
        setSavedLocations(locations);
      }
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const loadSavedLocations = async () => {
    try {
      const existingLocations = await AsyncStorage.getItem('savedLocations');
      if (existingLocations) setSavedLocations(JSON.parse(existingLocations));
    } catch (error) {
      console.error('Error loading saved locations:', error);
    }
  };

  const handleSelectLocation = (location) => {
    setUserLocation(location.coords);
    setRoadName(location.name);
  };

  const handleDeleteLocation = async (locationName) => {
    try {
      let updatedLocations = savedLocations.filter(loc => loc.name !== locationName);
      await AsyncStorage.setItem('savedLocations', JSON.stringify(updatedLocations));
      setSavedLocations(updatedLocations);
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  const handleManualLocation = async () => {
    try {
      if (!manualLocation.trim()) return;
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${manualLocation}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newCoords = { latitude: parseFloat(lat), longitude: parseFloat(lon) };
        setUserLocation(newCoords);
        setRoadName(display_name);
        saveLocation(display_name, newCoords);
      } else {
        alert('Location not found. Try again.');
      }
    } catch (error) {
      console.error('Error fetching manual location:', error);
    }
  };

  const fetchSuggestions = async (query) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
      const response = await fetch(url);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  const handleInputChange = (text) => {
    setManualLocation(text);
    debouncedFetchSuggestions(text);
  };

  const handleSelectSuggestion = (suggestion) => {
    setManualLocation(suggestion.display_name);
    setSuggestions([]);
  };

  const fetchGalleryImages = async (crecheId) => {
    try {
      const { data, error } = await supabase
        .from('creche_gallery')
        .select('image_url')
        .eq('creche_id', crecheId);

      if (error) throw error;
      return data.map((item) => item.image_url);
    } catch (error) {
      console.error('Error fetching gallery images:', error.message);
      return [];
    }
  };

  useEffect(() => {
    const fetchCreches = async () => {
      try {
        const { data, error } = await supabase
          .from('creches')
          .select('id, name, address, phone_number, capacity, logo, latitude, longitude, registered, monthly_price, weekly_price');

        if (error) throw error;

        const crechesWithGallery = await Promise.all(data.map(async (creche) => {
          const galleryImages = await fetchGalleryImages(creche.id);
          return { ...creche, gallery: galleryImages };
        }));

        setCreches(crechesWithGallery);
        setFilteredCreches(crechesWithGallery);
      } catch (error) {
        setError(`Error fetching creches: ${error.message}`);
      }
    };

    fetchCreches();
  }, []);

  useEffect(() => {
    if (userLocation) {
      let filtered = creches.map((creche) => {
        const distance = getDistance(
          userLocation.latitude,
          userLocation.longitude,
          creche.latitude,
          creche.longitude
        );
        return { ...creche, distance };
      }).sort((a, b) => a.distance - b.distance);

      if (searchQuery) {
        filtered = filtered.filter((creche) =>
          creche.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredCreches(filtered);
    }
  }, [searchQuery, creches, userLocation]);

  const handleSelectCreche = (crecheId) => {
    navigation.navigate('CrecheDetails', { crecheId });
  };

  if (error) return <View style={styles.container}><Text>Error: {error}</Text></View>;

  return (
    <View style={styles.container}>
      <SearchInput searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />

      <TextInput
        style={styles.input}
        placeholder="Enter a road name"
        value={manualLocation}
        onChangeText={handleInputChange}
        onSubmitEditing={handleManualLocation}
      />

      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity key={index} onPress={() => handleSelectSuggestion(suggestion)} style={styles.suggestionItem}>
              <Text>{suggestion.display_name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {savedLocations.length > 0 && (
        <View style={styles.savedLocations}>
          <Text style={styles.savedTitle}>Saved Locations:</Text>
          {savedLocations.map((loc, index) => (
            <View key={index} style={styles.locationRow}>
              <TouchableOpacity onPress={() => handleSelectLocation(loc)} style={styles.locationItem}>
                <Text>{loc.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteLocation(loc.name)}>
                <Ionicons name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.nearbyText}>Centres Near: {roadName}</Text>
      <FlatList
        data={filteredCreches}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CrecheItem creche={item} onSelectCreche={handleSelectCreche} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  suggestionsContainer: {
    marginBottom: 16,
  },
  suggestionItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  savedLocations: {
    marginBottom: 16,
  },
  savedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  locationItem: {
    flex: 1,
  },
  nearbyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default CrecheList. 