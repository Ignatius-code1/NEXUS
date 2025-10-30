import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function AttendanceHistoryPage() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Attendance History</Text>
      <View style={styles.card}>
        <Text style={styles.course}>Math 201</Text>
        <Text style={styles.date}>Oct 25, 2025</Text>
        <Text style={styles.statusPresent}>Present</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.course}>Physics 101</Text>
        <Text style={styles.date}>Oct 24, 2025</Text>
        <Text style={styles.statusAbsent}>Absent</Text>
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
  course: { fontWeight: "600", fontSize: 16 },
  date: { color: "#777", marginTop: 3 },
  statusPresent: {
    color: "#2E7D32",
    backgroundColor: "#C8E6C9",
    alignSelf: "flex-start",
    marginTop: 5,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    fontWeight: "600",
  },
  statusAbsent: {
    color: "#C62828",
    backgroundColor: "#FFCDD2",
    alignSelf: "flex-start",
    marginTop: 5,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    fontWeight: "600",
  },
});

