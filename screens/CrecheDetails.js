import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import Swiper from 'react-native-swiper-flatlist';
import supabase from '../supabaseClient';

const CrecheDetails = () => {
  const [creche, setCreche] = useState(null);
  const [crecheGalleryImages, setCrecheGalleryImages] = useState([]);
  const { services, facilities } = creche || {};
  const [tabIndex, setTabIndex] = useState(0);
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
        const { data: crecheData, error: crecheError } = await supabase
          .from('creches')
          .select('*')
          .eq('id', crecheId)
          .single();

        if (crecheError) throw crecheError;
        setCreche(crecheData);

        const { data: galleryData, error: galleryError } = await supabase
          .from('creche_gallery')
          .select('image_url')
          .eq('creche_id', crecheId);

        if (galleryError) console.error('Error fetching gallery images:', galleryError.message);
        else setCrecheGalleryImages(galleryData || []);
      } catch (error) {
        console.error('Error fetching creche details:', error.message);
      }
    };

    fetchCrecheDetails();
  }, [crecheId]);

  const handleApply = () => navigation.navigate('Apply', { crecheId });
  const openLink = (url) => url && Linking.openURL(url);
  const makePhoneCall = (phoneNumber) => phoneNumber && Linking.openURL(`tel:${phoneNumber}`);
  const sendEmail = (email) => email && Linking.openURL(`mailto:${email}`);

  const InfoTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Information</Text>
      {renderInfoRow('location-outline', creche?.address)}
      {renderInfoRow('call-outline', creche?.phone_number, makePhoneCall)}
      {renderInfoRow('mail-outline', creche?.email, sendEmail)}
      {renderInfoRow('people-outline', creche?.capacity)}
      {renderInfoRow('calendar-outline', creche?.operating_hours)}
      {renderInfoRow('document-text-outline', creche?.description)}
      {renderInfoRow('checkmark-circle-outline', creche?.registered ? 'Registered' : 'Not Registered')}
    </View>
  );

  const renderServiceRow = (serviceName, isAvailable) => {
    return (
      isAvailable && (
        <View style={styles.infoRow}>
          <Icon name="checkmark-circle-outline" size={24} color="#28a745" />
          <Text style={styles.infoValue}>{serviceName}</Text>
        </View>
      )
    );
  };

  const renderFacilityRow = (facilityName, isAvailable) => {
    return (
      isAvailable && (
        <View style={styles.infoRow}>
          <Icon name="checkmark-circle-outline" size={24} color="#28a745" />
          <Text style={styles.infoValue}>{facilityName}</Text>
        </View>
      )
    );
  };

  const ServicesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Services</Text>
      {services && (
        <>
          {renderServiceRow('Full-time care', services.full_time_care)}
          {renderServiceRow('Meals provided', services.meals_provided)}
          {renderServiceRow('Part-time care', services.part_time_care)}
          {renderServiceRow('Transportation', services.transportation)}
          {renderServiceRow('After-school care', services.after_school_care)}
          {renderServiceRow('Special education', services.special_education)}
        </>
      )}

      <Text style={styles.sectionTitle}>Facilities</Text>
      {facilities && (
        <>
          {renderFacilityRow('Kitchen', facilities.kitchen)}
          {renderFacilityRow('Parking', facilities.parking)}
          {renderFacilityRow('Toilets', facilities.toilets)}
          {renderFacilityRow('Teachers', facilities.teachers)}
          {renderFacilityRow('Classrooms', facilities.classrooms)}
          {renderFacilityRow('Playground', facilities.playground)}
        </>
      )}
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

  const renderInfoRow = (iconName, value, onPress = null, isLink = false) => {
    if (!value) return null;
    return (
      <View style={styles.infoRow}>
        <Icon name={iconName} size={24} color="#bd84f6" />
        {isLink ? (
          <TouchableOpacity onPress={() => onPress(value)}>
            <Text style={styles.link}>{value}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.infoValue}>{value}</Text>
        )}
      </View>
    );
  };

  const renderScene = SceneMap({
    info: InfoTab,
    services: ServicesTab,
    reviews: ReviewsTab,
    map: MapTab,
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={30} color="#bd84f6" />
      </TouchableOpacity>

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
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        onIndexChange={setTabIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#bd84f6' }} // Indicator color
            style={{ backgroundColor: '#9b87f5' }} // Tab background color
            labelStyle={{ color: '#333', fontWeight: 'bold', fontSize: 14 }} // Tab title text style
            renderIcon={({ route }) => (
              <MaterialCommunityIcons name={route.icon} size={20} color="#bd84f6" />
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
  applyButton: {
    backgroundColor: '#bd84f6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CrecheDetails;
