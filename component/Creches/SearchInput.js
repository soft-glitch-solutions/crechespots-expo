import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';

const SearchInput = ({ searchQuery, onSearchQueryChange }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [weeklyPrice, setWeeklyPrice] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [distance, setDistance] = useState('');
  const [currentLocation, setCurrentLocation] = useState(''); // Allow user to set location

  const handleSearch = () => {
    console.log('Searching with filters:', {
      searchQuery,
      weeklyPrice,
      monthlyPrice,
      ageGroup,
      facilities,
      distance,
      currentLocation,  // Added location to search filters
    });
    setIsModalVisible(false); 
  };

  const handleClearFilters = () => {
    setWeeklyPrice('');
    setMonthlyPrice('');
    setAgeGroup('');
    setFacilities([]);
    setDistance('');
    setCurrentLocation(''); // Clear location
  };

  const handleSaveSearch = () => {
    console.log('Saving search:', searchQuery);
    // Add logic to save the search query or filters
  };

  return (
    <>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.searchTouchable}
          onPress={() => setIsModalVisible(true)}
        >
          <Icon name="search" size={20} color="#888" style={styles.icon} />
          <Text style={styles.searchPlaceholder}>Search creches</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSaveSearch}>
          <Icon name="save" size={20} color="#888" style={styles.saveIcon} />
        </TouchableOpacity>
      </View>

      {/* Overlay Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

          <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Adjust Your Location</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Enter your location"
                  value={currentLocation}
                  onChangeText={setCurrentLocation}
                />
              </View>
            {/* Search Bar */}
            <View style={styles.modalSearchContainer}>
              <Icon name="search" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search creches..."
                value={searchQuery}
                onChangeText={onSearchQueryChange}
              />
            </View>

            {/* Filters */}
            <ScrollView style={styles.filtersContainer}>
              {/* Weekly Price */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Weekly Price (Max)</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Enter max weekly price"
                  value={weeklyPrice}
                  onChangeText={setWeeklyPrice}
                  keyboardType="numeric"
                />
              </View>

              {/* Monthly Price */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Monthly Price (Max)</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Enter max monthly price"
                  value={monthlyPrice}
                  onChangeText={setMonthlyPrice}
                  keyboardType="numeric"
                />
              </View>

              {/* Age Group */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Age Group</Text>
                <Picker
                  selectedValue={ageGroup}
                  onValueChange={(itemValue) => setAgeGroup(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Age Group" value="" />
                  <Picker.Item label="0-1 years" value="0-1" />
                  <Picker.Item label="1-3 years" value="1-3" />
                  <Picker.Item label="3-5 years" value="3-5" />
                  <Picker.Item label="5+ years" value="5+" />
                </Picker>
              </View>

              {/* Facilities */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Facilities</Text>
                <View style={styles.checkboxContainer}>
                  {['Playground', 'Meals', 'Transport', 'Aftercare'].map((facility) => (
                    <TouchableOpacity
                      key={facility}
                      style={styles.checkbox}
                      onPress={() => {
                        if (facilities.includes(facility)) {
                          setFacilities(facilities.filter((f) => f !== facility));
                        } else {
                          setFacilities([...facilities, facility]);
                        }
                      }}
                    >
                      <Icon
                        name={facilities.includes(facility) ? 'check-square' : 'square'}
                        size={20}
                        color={facilities.includes(facility) ? '#007bff' : '#888'}
                      />
                      <Text style={styles.checkboxLabel}>{facility}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>


              {/* Location */}

            </ScrollView>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearFilters}
              >
                <Text style={styles.clearButtonText}>Clear Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  saveIcon: {
    marginLeft: 8,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    maxHeight: '80%',
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 16,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 16,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clearButton: {
    backgroundColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default SearchInput;