import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { adminApi, Session, User } from "../../services/adminApi";

export default function ManageSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newSession, setNewSession] = useState({
    title: "",
    instructor: "",
    schedule: "",
    courseCode: "",
    members: [] as string[],
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadSessions();
    loadUsers();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await adminApi.getSessions();
      setSessions(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await adminApi.getUsers();
      setUsers(data.filter(user => user.role !== 'Admin'));
    } catch (error) {
      console.log('Failed to load users');
    }
  };

  const handleCreateSession = () => {
    setModalVisible(true);
  };

  const handleSaveSession = async () => {
    if (!newSession.title || !newSession.instructor || !newSession.schedule || !newSession.courseCode) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const sessionData = {
        ...newSession,
        isActive: true,
      };
      const createdSession = await adminApi.createSession(sessionData);
      setSessions([...sessions, createdSession]);
      setModalVisible(false);
      setNewSession({ title: "", instructor: "", schedule: "", courseCode: "", members: [] });
      Alert.alert("Success", "Session created successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to create session");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMember = (userId: string) => {
    const updatedMembers = newSession.members.includes(userId)
      ? newSession.members.filter(id => id !== userId)
      : [...newSession.members, userId];
    setNewSession({ ...newSession, members: updatedMembers });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Sessions</Text>
      <Text style={styles.subtitle}>Configure courses and attendance sessions</Text>

      <TouchableOpacity style={styles.button} onPress={handleCreateSession}>
        <Ionicons name="add-circle-outline" size={20} color="white" />
        <Text style={styles.btnText}>Create New Session</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9b5cff" />
          <Text style={styles.loadingText}>Loading sessions...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {sessions.length === 0 ? (
            <Text style={styles.emptyText}>No sessions found</Text>
          ) : (
            sessions.map((session) => (
              <View key={session.id} style={styles.card}>
                <Text style={styles.sessionTitle}>{session.title} - {session.courseCode}</Text>
                <Text style={styles.sessionDetails}>Instructor: {session.instructor}</Text>
                <Text style={styles.sessionDetails}>Schedule: {session.schedule}</Text>
                <View style={[styles.statusTag, { backgroundColor: session.isActive ? "#D1FAE5" : "#FEE2E2" }]}>
                  <Text style={[styles.statusText, { color: session.isActive ? "#065F46" : "#991B1B" }]}>
                    {session.isActive ? "Active" : "Inactive"}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create New Session</Text>

            <TextInput
              placeholder="Session Name *"
              style={styles.input}
              value={newSession.title}
              onChangeText={(text) => setNewSession({ ...newSession, title: text })}
            />

            <TextInput
              placeholder="Session Code *"
              style={styles.input}
              value={newSession.courseCode}
              onChangeText={(text) => setNewSession({ ...newSession, courseCode: text })}
            />

            <TextInput
              placeholder="Instructor *"
              style={styles.input}
              value={newSession.instructor}
              onChangeText={(text) => setNewSession({ ...newSession, instructor: text })}
            />

            <TextInput
              placeholder="Schedule (e.g., Mon & Wed 10:00 AM - 12:00 PM) *"
              style={styles.input}
              value={newSession.schedule}
              onChangeText={(text) => setNewSession({ ...newSession, schedule: text })}
            />

            <Text style={styles.sectionLabel}>Select Members</Text>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
              <TextInput
                placeholder="Search members..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <ScrollView style={styles.membersList}>
              {users
                .filter(user => 
                  user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((user) => (
                <TouchableOpacity
                  key={user.id}
                  style={[
                    styles.memberItem,
                    newSession.members.includes(user.id) && styles.memberItemSelected
                  ]}
                  onPress={() => toggleMember(user.id)}
                >
                  <Text style={[
                    styles.memberName,
                    newSession.members.includes(user.id) && styles.memberNameSelected
                  ]}>
                    {user.name}
                  </Text>
                  <Text style={[
                    styles.memberEmail,
                    newSession.members.includes(user.id) && styles.memberEmailSelected
                  ]}>
                    {user.email}
                  </Text>
                  {newSession.members.includes(user.id) && (
                    <Ionicons name="checkmark-circle" size={20} color="#9b5cff" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={[styles.saveBtn, submitting && styles.saveBtnDisabled]} 
              onPress={handleSaveSession}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.saveBtnText}>Create Session</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F8FC", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#1f2937" },
  subtitle: { color: "#6b7280", marginBottom: 15 },
  button: {
    flexDirection: "row",
    backgroundColor: "#9b5cff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  btnText: { color: "white", fontWeight: "600", marginLeft: 8 },
  card: { backgroundColor: "white", borderRadius: 14, padding: 15, elevation: 2 },
  sessionTitle: { fontWeight: "700", fontSize: 16, color: "#1f2937" },
  sessionDetails: { color: "#6b7280", marginTop: 4 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 10,
    color: "#6b7280",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 16,
    marginTop: 50,
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginTop: 10,
    marginBottom: 10,
  },
  membersList: {
    maxHeight: 200,
    marginBottom: 15,
  },
  scrollView: {
    flex: 1,
  },
  memberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 8,
  },
  memberItemSelected: {
    backgroundColor: "#EAD9FF",
    borderColor: "#9b5cff",
    borderWidth: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
  },
  memberNameSelected: {
    color: "#7C3AED",
  },
  memberEmail: {
    fontSize: 12,
    color: "#6b7280",
    flex: 1,
  },
  memberEmailSelected: {
    color: "#7C3AED",
  },
  saveBtn: {
    backgroundColor: "#9b5cff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelText: {
    color: "#6b7280",
    textAlign: "center",
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
});