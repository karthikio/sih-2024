import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';

const pdfFiles = [
  { id: '1', name: 'Anthrax', uri: require('../assets/pdfs/Anthrax.pdf') },
  { id: '2', name: 'Black Quarter(BQ)', uri: require('../assets/pdfs/Black Quarter(BQ).pdf') },
  { id: '3', name: 'Bovine Viral Diarrhoea (BVD)', uri: require('../assets/pdfs/Bovine Viral Diarrhoea (BVD).pdf') },
  { id: '4', name: 'Gastrointestinal parasitism', uri: require('../assets/pdfs/Gastrointestinal parasitism.pdf') },
  { id: '5', name: 'Ketosis(Acetonemia)', uri: require('../assets/pdfs/Ketosis(Acetonemia).pdf') },
  { id: '6', name: 'Mastitis', uri: require('../assets/pdfs/Mastitis.pdf') },
];

const PDFList = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={pdfFiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.pdfItem}
            onPress={() => navigation.navigate('PDFViewer', { pdfUri: item.uri })}
          >
            <Text style={styles.pdfText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  pdfItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  pdfText: {
    fontSize: 16,
    color: '#333',
  },
});

export default PDFList;
