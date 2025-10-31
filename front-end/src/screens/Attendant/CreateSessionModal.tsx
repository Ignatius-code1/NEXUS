import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddStudentToCourseModal from "./AddStudentToCourseModal";

// API Base URL - uses environment variable or falls back to current IP
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://172.30.39.233:3000/api";

interface CreateSessionModalProps {
  visible: boolean;
  onClose: () => void;
  onSessionCreated: () => void;
}

export default function CreateSessionModal({
  visible,
  onClose,
  onSessionCreated,
}: CreateSessionModalProps) {
  const [title, setTitle] = useState("");
  const [schedule, setSchedule] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  const handleCreateSession = async () => {
    // Validate inputs
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a session title");
      return;
    }
    if (!courseCode.trim()) {
      Alert.alert("Error", "Please enter a course code");
      return;
    }
    if (!schedule.trim()) {
      Alert.alert("Error", "Please enter a schedule");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/attendant/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          courseCode: courseCode.trim(),
          schedule: schedule.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Session Created! 🎉",
          `Your session "${title}" is now active. Students can now join!`,
          [
            {
              text: "OK",
              onPress: () => {
                setTitle("");
                setSchedule("");
                setCourseCode("");
                onClose();
                onSessionCreated();
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", data.error || "Failed to create session");
      }
    } catch (error) {
      console.error("Failed to create session:", error);
      Alert.alert("Error", "Failed to create session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Start New Session</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.infoCard}>
              <Text style={styles.infoEmoji}>📡</Text>
              <Text style={styles.infoText}>
                Create a new session that students can join to mark their attendance.
                Make sure to fill in all the details below.
              </Text>
            </View>

            {/* Session Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Session Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Introduction to Programming - Lecture 1"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#999"
              />
            </View>

            {/* Course Code */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Course Code *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., CS101, MATH201, ENG102"
                value={courseCode}
                onChangeText={setCourseCode}
                placeholderTextColor="#999"
                autoCapitalize="characters"
              />
              <Text style={styles.helperText}>
                Students registered for this course will see this session
              </Text>
              {courseCode.trim() && (
                <TouchableOpacity
                  style={styles.addStudentsButton}
                  onPress={() => setShowAddStudentModal(true)}
                >
                  <Text style={styles.addStudentsButtonText}>
                    👥 Add Students to {courseCode}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Schedule */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Schedule *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Monday 9:00 AM - 11:00 AM"
                value={schedule}
                onChangeText={setSchedule}
                placeholderTextColor="#999"
              />
              <Text style={styles.helperText}>
                When is this session taking place?
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.createButton, loading && styles.createButtonDisabled]}
              onPress={handleCreateSession}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.createButtonText}>Start Session</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Student to Course Modal */}
        {courseCode.trim() && (
          <AddStudentToCourseModal
            visible={showAddStudentModal}
            onClose={() => setShowAddStudentModal(false)}
            courseCode={courseCode.trim()}
            onStudentAdded={() => {
              // Optionally refresh or show success message
            }}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#6E6E73",
  },
  content: {
    padding: 20,
    maxHeight: 500,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  infoEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#1565C0",
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1C1C1E",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  helperText: {
    fontSize: 12,
    color: "#6E6E73",
    marginTop: 6,
    fontStyle: "italic",
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  createButton: {
    flex: 1,
    backgroundColor: "#4d88ff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  addStudentsButton: {
    backgroundColor: "#10b981",
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    alignItems: "center",
  },
  addStudentsButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

