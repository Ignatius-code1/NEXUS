import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function MyUnitsPage() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Units</Text>
      <View style={styles.card}>
        <Text style={styles.unitTitle}>Computer Science 101</Text>
        <Text style={styles.unitInfo}>Instructor: Dr. Smith</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.unitTitle}>Data Structures 202</Text>
        <Text style={styles.unitInfo}>Instructor: Prof. Kamau</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#222", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  unitTitle: { fontSize: 16, fontWeight: "600" },
  unitInfo: { color: "#666", marginTop: 4 },
});

