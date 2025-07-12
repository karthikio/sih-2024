import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { WebView } from 'react-native-webview';

const PDFViewer = ({ route }) => {
  const { pdfUri } = route.params;
  // Resolve the asset to get a valid URI string
  const resolvedAsset = Image.resolveAssetSource(pdfUri);

  return (
    <View style={styles.container}>
      <WebView
        style={styles.webview}
        source={{ uri: resolvedAsset.uri }}
        // You can add additional WebView props (e.g., enabling JavaScript) if needed
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default PDFViewer;
