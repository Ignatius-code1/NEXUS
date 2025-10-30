import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AttendantSessionsPage({ navigation }: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleCreateSession = () => {
    if (!sessionName || !sessionCode || !startTime || !endTime) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    Alert.alert("Success", "Session created successfully");
    setModalVisible(false);
    setSessionName("");
    setSessionCode("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Sessions</Text>
      
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add-circle" size={20} color="#fff" />
        <Text style={styles.createButtonText}>Create New Session</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sessionTitle}>Computer Science 101</Text>
          <View style={[styles.statusBadge, { backgroundColor: "#C8E6C9" }]}>
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>
        <Text style={styles.sessionInfo}>Code: CS101 • 09:00 - 10:30</Text>
        <TouchableOpacity 
          style={styles.manageButton}
          onPress={() => navigation.navigate("AttendantAttendance")}
        >
          <Text style={styles.manageButtonText}>Manage Attendance</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sessionTitle}>Mathematics 201</Text>
          <View style={[styles.statusBadge, { backgroundColor: "#FFCDD2" }]}>
            <Text style={styles.statusText}>Ended</Text>
          </View>
        </View>
        <Text style={styles.sessionInfo}>Code: MATH201 • 11:00 - 12:30</Text>
        <TouchableOpacity style={styles.manageButton}>
          <Text style={styles.manageButtonText}>View Report</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Session</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Session Name"
              value={sessionName}
              onChangeText={setSessionName}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Session Code"
              value={sessionCode}
              onChangeText={setSessionCode}
            />
            
            <View style={styles.timeRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 10 }]}
                placeholder="Start Time (HH:MM)"
                value={startTime}
                onChangeText={setStartTime}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="End Time (HH:MM)"
                value={endTime}
                onChangeText={setEndTime}
              />
            </View>
            
            <TouchableOpacity style={styles.createSessionButton} onPress={handleCreateSession}>
              <Text style={styles.createSessionButtonText}>Create Session</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#222", marginBottom: 20 },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#A020F0",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    justifyContent: "center",
    gap: 8,
  },
  createButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: { fontSize: 12, fontWeight: "600" },
  sessionInfo: { color: "#666", marginBottom: 12 },
  manageButton: {
    backgroundColor: "#1976D2",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  manageButtonText: { color: "#fff", fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "90%",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  timeRow: { flexDirection: "row" },
  createSessionButton: {
    backgroundColor: "#A020F0",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  createSessionButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  cancelText: { textAlign: "center", color: "#666", fontSize: 16 },
});