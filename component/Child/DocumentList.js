import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as DocumentPicker from 'react-native-document-picker'; // Use this for picking documents

const DocumentList = ({ documents, handleDocumentClick, handleDocumentUpload }) => {

  const handleUploadClick = async () => {
    try {
      // Use the Document Picker to pick a document
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // You can filter by type (e.g., PDF, Word)
      });

      // Pass the document back to the parent to upload
      handleDocumentUpload(res); // This function will handle the actual upload
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
      } else {
        Alert.alert('Error', 'Something went wrong while picking the document');
      }
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={handleUploadClick}>
        <Icon name="upload" size={20} color="#ffffff" />
        <Text style={styles.uploadButtonText}>Upload Document</Text>
      </TouchableOpacity>

      {documents.length === 0 ? (
        <Text style={styles.noDataText}>No documents available for this student.</Text>
      ) : (
        documents.map((doc, index) => (
          <TouchableOpacity
            key={index}
            style={styles.documentItem}
            onPress={() => handleDocumentClick(doc.url)}>
            <Icon name="file" size={20} color="#bd84f6" />
            <Text style={styles.documentText}>{doc.document_name}</Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  documentText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#bd84f6',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
    fontSize: 18,
  },
  uploadButton: {
    backgroundColor: '#4CAF50', // Green color for the upload button
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginLeft: 8,
  },
});

export default DocumentList;
