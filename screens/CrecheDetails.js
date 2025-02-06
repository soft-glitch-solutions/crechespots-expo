import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import supabase from '../supabaseClient';
import Icon from 'react-native-vector-icons/Ionicons';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import Loading from '../component/loadingComponent/loading';
import Swiper from 'react-native-swiper'; // Ensure you have this package installed for the carousel

const CrecheDetails = () => {
  const [creche, setCreche] = useState(null);
  const [crecheGalleryImages, setCrecheGalleryImages] = useState([]);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'info', title: 'Info', icon: 'information-circle' },
    { key: 'services', title: 'Services', icon: 'business' },
    { key: 'reviews', title: 'Reviews', icon: 'star' },
    { key: 'map', title: 'Map', icon: 'map' },
  ]);
  const route = useRoute();
  const navigation = useNavigation();
  const { crecheId } = route.params;

  useEffect(() => {
    const fetchCrecheDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('creches')
          .select('*')
          .eq('id', crecheId)
          .single();

        if (error) {
          throw error;
        }

        setCreche(data);

        // Fetch gallery images related to this creche
        const { data: galleryData, error: galleryError } = await supabase
          .from('creche_gallery')
          .select('image_url')
          .eq('creche_id', crecheId);

        if (galleryError) {
          console.error('Error fetching gallery images:', galleryError.message);
        } else {
          setCrecheGalleryImages(galleryData || []);
        }
      } catch (error) {
        console.error('Error fetching creche details:', error.message);
      }
    };

    fetchCrecheDetails();
  }, [crecheId]);

  const handleApply = () => {
    navigation.navigate('Apply', { crecheId });
  };

  const openLink = (url) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const makePhoneCall = (phoneNumber) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const sendEmail = (email) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const InfoTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Information</Text>
      {creche?.address && (
        <View style={styles.infoRow}>
          <Icon name="location-outline" size={24} color="#4a90e2" />
          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoValue}>{creche.address}</Text>
        </View>
      )}
      {creche?.phone_number && (
        <View style={styles.infoRow}>
          <Icon name="call-outline" size={24} color="#4a90e2" />
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{creche.phone_number}</Text>
        </View>
      )}
      {creche?.email && (
        <View style={styles.infoRow}>
          <Icon name="mail-outline" size={24} color="#4a90e2" />
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{creche.email}</Text>
        </View>
      )}
      {creche?.capacity && (
        <View style={styles.infoRow}>
          <Icon name="people-outline" size={24} color="#4a90e2" />
          <Text style={styles.infoLabel}>Capacity:</Text>
          <Text style={styles.infoValue}>{creche.capacity}</Text>
        </View>
      )}
      {creche?.operating_hours && (
        <View style={styles.infoRow}>
          <Icon name="calendar-outline" size={24} color="#4a90e2" />
          <Text style={styles.infoLabel}>Operating Hours:</Text>
          <Text style={styles.infoValue}>{creche.operating_hours}</Text>
        </View>
      )}
      {creche?.website_url && (
        <View style={styles.infoRow}>
          <Icon name="globe-outline" size={24} color="#4a90e2" />
          <Text style={styles.infoLabel}>Website:</Text>
          <TouchableOpacity onPress={() => openLink(creche.website_url)}>
            <Text style={styles.link}>{creche.website_url}</Text>
          </TouchableOpacity>
        </View>
      )}
      {creche?.description && (
        <View style={styles.infoRow}>
          <Icon name="document-text-outline" size={24} color="#4a90e2" />
          <Text style={styles.infoLabel}>Description:</Text>
          <Text style={styles.infoValue}>{creche.description}</Text>
        </View>
      )}
      {creche?.registered !== undefined && (
        <View style={styles.infoRow}>
          <Icon name="checkmark-circle-outline" size={24} color="#4a90e2" />
          <Text style={styles.infoLabel}>Registered:</Text>
          <Text style={styles.infoValue}>{creche.registered ? 'Yes' : 'No'}</Text>
        </View>
      )}
    </View>
  );

  const ServicesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Services</Text>
      <Text>No services listed</Text>
    </View>
  );

  const ReviewsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Reviews</Text>
      <Text>No reviews available</Text>
    </View>
  );

  const MapTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Map</Text>
      <Text>Map content goes here.</Text>
    </View>
  );

  const renderScene = SceneMap({
    info: InfoTab,
    services: ServicesTab,
    reviews: ReviewsTab,
    map: MapTab,
  });

  if (!creche) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={30} color="#4a90e2" />
      </TouchableOpacity>

      {/* Gallery */}
      {crecheGalleryImages.length > 0 ? (
        <Swiper style={styles.carousel} showsPagination loop>
          {crecheGalleryImages.map((image, index) => (
            <Image key={index} source={{ uri: image.image_url }} style={styles.carouselImage} />
          ))}
        </Swiper>
      ) : (
        <Text style={styles.noImagesText}>No gallery images available</Text>
      )}

      <Text style={styles.name}>{creche?.name}</Text>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#4a90e2' }}
            style={{ backgroundColor: '#fff' }}
            labelStyle={{ color: '#000' }}
            renderIcon={({ route }) => (
              <MaterialCommunityIcons name={route.icon} size={20} color="#4a90e2" />
            )}
          />
        )}
      />

      <View style={styles.applyButtonContainer}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  carousel: {
    height: 250,
  },
  carouselImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  noImagesText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 18,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoValue: {
    marginLeft: 8,
    color: '#555',
  },
  link: {
    color: '#007bff',
  },
  tabContent: {
    padding: 16,
  },
  applyButtonContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  applyButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
  },
});

export default CrecheDetails;
