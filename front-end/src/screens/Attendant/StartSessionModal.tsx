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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://192.168.100.31:3000/api";

interface StartSessionModalProps {
  visible: boolean;
  onClose: () => void;
  unit: string;
  onSessionCreated: () => void;
}

export default function StartSessionModal({
  visible,
  onClose,
  unit,
  onSessionCreated,
}: StartSessionModalProps) {
  const [title, setTitle] = useState("");
  const [schedule, setSchedule] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStartSession = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a session title");
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
          courseCode: unit,
          schedule: schedule.trim() || new Date().toLocaleString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Session Started! 🎉",
          `Your Bluetooth session for ${unit} is now active. Students can now join!`,
          [
            {
              text: "OK",
              onPress: () => {
                setTitle("");
                setSchedule("");
                onClose();
                onSessionCreated();
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", data.error || "Failed to start session");
      }
    } catch (error) {
      console.error("Failed to start session:", error);
      Alert.alert("Error", "Failed to start session. Please try again.");
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
            <Text style={styles.headerTitle}>Start Bluetooth Session</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.infoCard}>
              <Text style={styles.infoEmoji}>📡</Text>
              <Text style={styles.infoText}>
                Starting a Bluetooth session will allow students registered for{" "}
                <Text style={styles.boldText}>{unit}</Text> to find and join
                this session to mark their attendance.
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Session Title *</Text>
              <TextInput
                style={styles.input}
                placeholder={`e.g., ${unit} - Lecture 1`}
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Schedule (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Monday 9:00 AM - 11:00 AM"
                value={schedule}
                onChangeText={setSchedule}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.courseInfo}>
              <Text style={styles.courseLabel}>Course Code:</Text>
              <Text style={styles.courseValue}>{unit}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.startButton, loading && styles.startButtonDisabled]}
              onPress={handleStartSession}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.startButtonText}>Start Session</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
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
    paddingBottom: 40,
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
    color: "#6E6E73",
    lineHeight: 20,
  },
  boldText: {
    fontWeight: "700",
    color: "#1C1C1E",
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
  courseInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    padding: 16,
  },
  courseLabel: {
    fontSize: 14,
    color: "#6E6E73",
    marginRight: 8,
  },
  courseValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
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
  startButton: {
    flex: 1,
    backgroundColor: "#34C759",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  startButtonDisabled: {
    opacity: 0.6,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

