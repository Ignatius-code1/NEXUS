import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { adminApi, User } from "../../services/adminApi";

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Attendee" as const });
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    
    setSubmitting(true);
    try {
      const createdUser = await adminApi.createUser(newUser);
      setUsers([...users, createdUser]);
      setModalVisible(false);
      setNewUser({ name: "", email: "", role: "Attendee" });
      Alert.alert("Success", "User added successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to add user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: User, index: number) => {
    Alert.alert(
      "Delete User",
      `Are you sure you want to delete ${user.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await adminApi.deleteUser(user.id);
              const updated = users.filter((_, i) => i !== index);
              setUsers(updated);
              Alert.alert("Success", "User deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to delete user");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Users</Text>
      <Text style={styles.subtitle}>Add, edit or remove users</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="person-add-outline" size={20} color="white" />
        <Text style={styles.addButtonText}>Add New User</Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          placeholder="Search users..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9b5cff" />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      ) : (
        <ScrollView>
          {users
            .filter(user => 
              user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.serial.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((user, index) => (
            <View key={user.id || index} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.userName}>{user.name}</Text>
                <TouchableOpacity onPress={() => handleDeleteUser(user, index)}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.serial}>Serial: {user.serial}</Text>
              <View style={[styles.roleTag, { backgroundColor: user.role === "Attendee" ? "#EAD9FF" : "#D6E4FF" }]}>
                <Text style={[styles.roleText, { color: user.role === "Attendee" ? "#7C3AED" : "#2563EB" }]}>
                  {user.role}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add User</Text>

            <TextInput
              placeholder="Full Name"
              style={styles.input}
              value={newUser.name}
              onChangeText={(t) => setNewUser({ ...newUser, name: t })}
            />
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={newUser.email}
              onChangeText={(t) => setNewUser({ ...newUser, email: t })}
            />
            
            <View style={styles.roleSelector}>
              <TouchableOpacity
                style={[styles.roleButton, newUser.role === "Attendee" && styles.roleButtonActive]}
                onPress={() => setNewUser({ ...newUser, role: "Attendee" })}
              >
                <Text style={[styles.roleButtonText, newUser.role === "Attendee" && styles.roleButtonTextActive]}>
                  Attendee
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, newUser.role === "Attendant" && styles.roleButtonActive]}
                onPress={() => setNewUser({ ...newUser, role: "Attendant" })}
              >
                <Text style={[styles.roleButtonText, newUser.role === "Attendant" && styles.roleButtonTextActive]}>
                  Attendant
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.saveBtn, submitting && styles.saveBtnDisabled]} 
              onPress={handleAddUser}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.saveBtnText}>Save</Text>
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
  subtitle: { color: "#6b7280", marginBottom: 10 },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#9b5cff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  addButtonText: { color: "white", fontWeight: "600", marginLeft: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  userName: { fontWeight: "700", color: "#1f2937" },
  userEmail: { color: "#6b7280" },
  serial: { color: "#9b5cff", marginTop: 4 },
  roleTag: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: { backgroundColor: "white", padding: 20, borderRadius: 15, width: "85%" },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  roleSelector: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  roleButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  roleButtonActive: {
    backgroundColor: "#9b5cff",
  },
  roleButtonText: {
    color: "#6b7280",
    fontWeight: "600",
  },
  roleButtonTextActive: {
    color: "white",
  },
  saveBtn: {
    backgroundColor: "#9b5cff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "700" },
  cancelText: { color: "#6b7280", textAlign: "center", marginTop: 10 },
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
  saveBtnDisabled: {
    opacity: 0.6,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "white",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
});