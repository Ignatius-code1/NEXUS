import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AttendantAttendancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [attendees, setAttendees] = useState([
    { id: 1, name: "Alice Johnson", email: "alice@example.com", serial: "A001", present: false },
    { id: 2, name: "Bob Smith", email: "bob@example.com", serial: "A002", present: true },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", serial: "A003", present: false },
    { id: 4, name: "Diana Prince", email: "diana@example.com", serial: "A004", present: true },
  ]);

  const toggleAttendance = (id: number) => {
    setAttendees(prev => 
      prev.map(attendee => 
        attendee.id === id ? { ...attendee, present: !attendee.present } : attendee
      )
    );
  };

  const filteredAttendees = attendees.filter(attendee =>
    attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attendee.serial.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mark Attendance</Text>
      <Text style={styles.subtitle}>Computer Science 101 - CS101</Text>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email, or serial..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {filteredAttendees.map((attendee) => (
        <TouchableOpacity
          key={attendee.id}
          style={styles.card}
          onPress={() => toggleAttendance(attendee.id)}
        >
          <View style={styles.attendeeInfo}>
            <Text style={styles.attendeeName}>{attendee.name}</Text>
            <Text style={styles.attendeeDetails}>{attendee.email} • #{attendee.serial}</Text>
          </View>
          
          <View style={[
            styles.statusButton,
            attendee.present ? styles.presentButton : styles.absentButton
          ]}>
            <Ionicons 
              name={attendee.present ? "checkmark-circle" : "close-circle"} 
              size={24} 
              color={attendee.present ? "#2E7D32" : "#C62828"} 
            />
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Attendance</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#222", marginBottom: 5 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 12,
    marginBottom: 20,
    elevation: 2,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    justifyContent: "space-between",
  },
  attendeeInfo: { flex: 1 },
  attendeeName: { fontSize: 16, fontWeight: "600", color: "#333" },
  attendeeDetails: { color: "#666", fontSize: 13, marginTop: 4 },
  statusButton: {
    padding: 8,
    borderRadius: 20,
  },
  presentButton: { backgroundColor: "#C8E6C9" },
  absentButton: { backgroundColor: "#FFCDD2" },
  saveButton: {
    backgroundColor: "#A020F0",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});