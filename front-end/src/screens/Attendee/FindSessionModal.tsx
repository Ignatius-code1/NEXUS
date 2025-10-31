import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API Base URL - uses environment variable or falls back to current IP
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://172.30.39.233:3000/api";

interface Session {
  id: number;
  title: string;
  attendantName: string;
  schedule: string;
  courseCode: string;
  isActive: boolean;
  createdAt: string;
}

interface FindSessionModalProps {
  visible: boolean;
  onClose: () => void;
  unit: string;
  onAttendanceMarked: () => void;
}

export default function FindSessionModal({
  visible,
  onClose,
  unit,
  onAttendanceMarked,
}: FindSessionModalProps) {
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [joining, setJoining] = useState<number | null>(null);

  useEffect(() => {
    if (visible) {
      findSessions();
    }
  }, [visible]);

  const findSessions = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/attendee/sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Filter sessions for this specific unit
        const unitSessions = data.filter(
          (session: Session) => session.courseCode === unit
        );
        setSessions(unitSessions);
      } else {
        Alert.alert("Error", data.error || "Failed to find sessions");
      }
    } catch (error) {
      console.error("Failed to find sessions:", error);
      Alert.alert("Error", "Failed to find sessions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const joinSession = async (sessionId: number) => {
    setJoining(sessionId);
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/attendee/sessions/${sessionId}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Attendance Marked! ✅",
          data.message || "Your attendance has been successfully recorded.",
          [
            {
              text: "OK",
              onPress: () => {
                onClose();
                onAttendanceMarked();
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", data.error || "Failed to join session");
      }
    } catch (error) {
      console.error("Failed to join session:", error);
      Alert.alert("Error", "Failed to join session. Please try again.");
    } finally {
      setJoining(null);
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
            <Text style={styles.headerTitle}>Find Bluetooth Sessions</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.infoCard}>
              <Text style={styles.infoEmoji}>📡</Text>
              <Text style={styles.infoText}>
                Scanning for active Bluetooth sessions for{" "}
                <Text style={styles.boldText}>{unit}</Text>
              </Text>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Scanning for sessions...</Text>
              </View>
            ) : sessions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>🔍</Text>
                <Text style={styles.emptyTitle}>No Active Sessions</Text>
                <Text style={styles.emptyText}>
                  No active Bluetooth sessions found for {unit}. Please make
                  sure your teacher has started a session.
                </Text>
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={findSessions}
                >
                  <Text style={styles.refreshButtonText}>Scan Again</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView style={styles.sessionsList}>
                <Text style={styles.sessionsTitle}>
                  Found {sessions.length} session{sessions.length !== 1 ? "s" : ""}
                </Text>
                {sessions.map((session) => (
                  <View key={session.id} style={styles.sessionCard}>
                    <View style={styles.sessionIcon}>
                      <Text style={styles.sessionEmoji}>📖</Text>
                    </View>
                    <View style={styles.sessionContent}>
                      <Text style={styles.sessionTitle}>{session.title}</Text>
                      <Text style={styles.sessionInfo}>
                        Teacher: {session.attendantName}
                      </Text>
                      <Text style={styles.sessionInfo}>
                        {session.schedule}
                      </Text>
                      <View style={styles.activeBadge}>
                        <View style={styles.activeDot} />
                        <Text style={styles.activeText}>Active Now</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.joinButton,
                        joining === session.id && styles.joinButtonDisabled,
                      ]}
                      onPress={() => joinSession(session.id)}
                      disabled={joining === session.id}
                    >
                      {joining === session.id ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <Text style={styles.joinButtonText}>Join</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
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
    maxHeight: "80%",
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
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#4CAF50",
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
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6E6E73",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6E6E73",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  refreshButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  sessionsList: {
    maxHeight: 400,
  },
  sessionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  sessionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  sessionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sessionEmoji: {
    fontSize: 24,
  },
  sessionContent: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  sessionInfo: {
    fontSize: 13,
    color: "#6E6E73",
    marginBottom: 2,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#34C759",
    marginRight: 6,
  },
  activeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#34C759",
  },
  joinButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 70,
    alignItems: "center",
  },
  joinButtonDisabled: {
    opacity: 0.6,
  },
  joinButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

