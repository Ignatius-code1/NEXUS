import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AttendantReportsPage() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      
      {/* Summary Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: "#A020F0" }]}>
          <Ionicons name="people" size={24} color="#fff" />
          <Text style={styles.statTitle}>Total Students</Text>
          <Text style={styles.statValue}>127</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#1976D2" }]}>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.statTitle}>Present Today</Text>
          <Text style={styles.statValue}>98</Text>
        </View>
      </View>

      {/* Session Reports */}
      <Text style={styles.sectionTitle}>Session Reports</Text>
      
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sessionTitle}>Computer Science 101</Text>
          <Text style={styles.attendanceRate}>87%</Text>
        </View>
        <Text style={styles.sessionInfo}>Oct 25, 2025 • 39/45 present</Text>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={[styles.statusText, { color: "#2E7D32" }]}>Present: 39</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={[styles.statusText, { color: "#C62828" }]}>Absent: 6</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sessionTitle}>Mathematics 201</Text>
          <Text style={styles.attendanceRate}>92%</Text>
        </View>
        <Text style={styles.sessionInfo}>Oct 24, 2025 • 35/38 present</Text>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={[styles.statusText, { color: "#2E7D32" }]}>Present: 35</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={[styles.statusText, { color: "#C62828" }]}>Absent: 3</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.exportButton}>
        <Ionicons name="download-outline" size={20} color="#fff" />
        <Text style={styles.exportButtonText}>Export All Reports</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#222", marginBottom: 20 },
  statsContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    marginBottom: 25,
  },
  statCard: { 
    width: "48%", 
    borderRadius: 18, 
    padding: 15, 
    elevation: 3,
    alignItems: "center",
  },
  statTitle: { color: "#fff", fontSize: 14, marginTop: 5, textAlign: "center" },
  statValue: { fontSize: 20, color: "#fff", fontWeight: "700", marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 15 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sessionTitle: { fontSize: 16, fontWeight: "600", flex: 1 },
  attendanceRate: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#A020F0",
  },
  sessionInfo: { color: "#666", marginBottom: 12 },
  statusRow: { 
    flexDirection: "row", 
    justifyContent: "space-between",
  },
  statusItem: { flex: 1 },
  statusText: { fontWeight: "600", fontSize: 14 },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5E35B1",
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    marginBottom: 30,
    justifyContent: "center",
    gap: 8,
  },
  exportButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});