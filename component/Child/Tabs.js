import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Tabs = ({ selectedTab, setSelectedTab }) => (
  <View style={styles.tabs}>
    <TouchableOpacity
      onPress={() => setSelectedTab('details')}
      style={[styles.tab, selectedTab === 'details' && styles.activeTab]}>
      <Text style={[styles.tabText, selectedTab === 'details' && styles.activeTabText]}>Details</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => setSelectedTab('actions')}
      style={[styles.tab, selectedTab === 'actions' && styles.activeTab]}>
      <Text style={[styles.tabText, selectedTab === 'actions' && styles.activeTabText]}>Actions</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => setSelectedTab('documents')}
      style={[styles.tab, selectedTab === 'documents' && styles.activeTab]}>
      <Text style={[styles.tabText, selectedTab === 'documents' && styles.activeTabText]}>Documents</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  tab: {
    paddingVertical: 10,
    flex: 1,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#bd84f6',
  },
  tabText: {
    fontSize: 18,
    color: '#555',
  },
  activeTabText: {
    color: '#bd84f6',
    fontWeight: 'bold',
  },
});

export default Tabs;
