import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to NEXUS Dashboard</Text>

      <TouchableOpacity style={styles.neuButton}>
        <Text style={styles.buttonText}>Mark Attendance</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.neuButton}>
        <Text style={styles.buttonText}>View Attendance Records</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F5",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 30,
  },
  neuButton: {
    width: "100%",
    backgroundColor: "#F5F5F7",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: { fontSize: 16, fontWeight: "600", color: "#1C1C1E" },
});