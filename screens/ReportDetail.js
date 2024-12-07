import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const ReportDetail = ({ route }) => {
  const { report } = route.params; // Access the selected report data

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{report.disease_name}</Text>
      <Text style={styles.info}>Reported by: {report.userName || "Anonymous"}</Text>
      <Text style={styles.info}>Severity: {report.severity}</Text>
      <Text style={styles.info}>
        Disease Detected: {report.is_disease_detected ? "Yes" : "No"}
      </Text>
      <Text style={styles.info}>
        Location: {report.latitude.toFixed(2)}, {report.longitude.toFixed(2)}
      </Text>
      <Text style={styles.sectionTitle}>Additional Information:</Text>
      <Text style={styles.description}>{report.additional_info || "N/A"}</Text>
      <Text style={styles.sectionTitle}>Remedy:</Text>
      <Text style={styles.description}>{report.remedy || "N/A"}</Text>
      <Text style={styles.sectionTitle}>Prevention Steps:</Text>
      {report.prevention_steps?.length > 0 ? (
        report.prevention_steps.map((step, index) => (
          <Text key={index} style={styles.listItem}>
            {`• ${step}`}
          </Text>
        ))
      ) : (
        <Text style={styles.description}>No prevention steps available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    color: "#555",
    marginLeft: 10,
    marginBottom: 5,
  },
});

export default ReportDetail;