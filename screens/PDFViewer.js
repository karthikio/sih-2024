import React from 'react';
import { StyleSheet, View } from 'react-native';


const PDFViewer = ({ route }) => {
  const { pdfUri } = route.params;

  return (
    <View style={styles.container}>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
});

export default PDFViewer;