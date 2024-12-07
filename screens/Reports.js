import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const Reports = ({ route, navigation }) => {
  const { reports } = route.params; // Access the reports passed from the previous screen

  const renderReportItem = ({ item }) => (
    <TouchableOpacity
      style={styles.reportItem}
      onPress={() => navigation.navigate("ReportDetail", { report: item })}
    >
      <Text style={styles.reportTitle}>{item.disease_name}</Text>
      <Text style={styles.reportSubtitle}>
        Severity: {item.severity} | Detected: {item.is_disease_detected ? "Yes" : "No"}
      </Text>
      <Text style={styles.reportLocation}>
        Location: {item.latitude.toFixed(2)}, {item.longitude.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Latest Reports</Text>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={renderReportItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 20,
    color: '#2c3e50',
  },
  reportItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  reportSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  reportLocation: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
});

export default Reports;