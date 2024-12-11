import React from 'react';
import { StyleSheet, View } from 'react-native';
// import Pdf from 'react-native-pdf';

const PDFViewer = ({ route }) => {
  const { pdfUri } = route.params;

  return (
    <View style={styles.container}>
      {/* <Pdf
        source={pdfUri}
        onLoadComplete={(numberOfPages) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        style={styles.pdf}
      /> */}
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