import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  RefreshControl,
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
  isEnrolled: boolean;
  createdAt: string;
}

interface ScanSessionsModalProps {
  visible: boolean;
  onClose: () => void;
  onSessionJoined: () => void;
}

export default function ScanSessionsModal({
  visible,
  onClose,
  onSessionJoined,
}: ScanSessionsModalProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [joiningSessionId, setJoiningSessionId] = useState<number | null>(null);

  useEffect(() => {
    if (visible) {
      scanSessions();
    }
  }, [visible]);

  const scanSessions = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const url = `${API_BASE_URL}/attendee/sessions/scan`;

      console.log("=".repeat(60));
      console.log("🔍 SCANNING FOR SESSIONS");
      console.log("=".repeat(60));
      console.log("📍 URL:", url);
      console.log("🔑 Token:", token ? `${token.substring(0, 20)}...` : "NO TOKEN");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Response Status:", response.status);
      console.log("📡 Response OK:", response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ SUCCESS! Sessions received:", data.length);
        console.log("📊 Sessions data:", JSON.stringify(data, null, 2));

        if (data.length === 0) {
          console.warn("⚠️  Backend returned empty array - no active sessions");
        }

        setSessions(data);
        console.log("✅ State updated with", data.length, "sessions");
      } else {
        const errorText = await response.text();
        console.error("❌ Error Status:", response.status);
        console.error("❌ Error Response:", errorText);

        try {
          const errorData = JSON.parse(errorText);
          Alert.alert("Error", errorData.error || "Failed to scan for sessions");
        } catch {
          Alert.alert("Error", `Failed to scan for sessions (${response.status})`);
        }
      }
    } catch (error) {
      console.error("❌ EXCEPTION:", error);
      console.error("❌ Error details:", JSON.stringify(error, null, 2));
      Alert.alert("Network Error", `Could not connect to server. Please check:\n1. Backend is running\n2. IP address is correct\n3. You're on the same network\n\nError: ${error}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
      console.log("=".repeat(60));
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    scanSessions();
  };

  const handleJoinSession = async (session: Session) => {
    setJoiningSessionId(session.id);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/attendee/sessions/${session.id}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        const enrollmentMsg = !session.isEnrolled
          ? ` You have been automatically enrolled in ${session.courseCode}.`
          : "";
        Alert.alert(
          "Success! ✅",
          `You have successfully joined "${session.title}". Your attendance has been marked.${enrollmentMsg}`,
          [
            {
              text: "OK",
              onPress: () => {
                onSessionJoined();
                scanSessions(); // Refresh the list
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", data.error || "Failed to join session");
      }
    } catch (error) {
      console.error("Failed to join session:", error);
      Alert.alert("Error", "Failed to join session");
    } finally {
      setJoiningSessionId(null);
    }
  };

  const renderSession = ({ item }: { item: Session }) => {
    const isJoining = joiningSessionId === item.id;

    console.log("🎨 Rendering session:", item.id, item.title);

    return (
      <View style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          <Text style={styles.sessionTitle}>{item.title}</Text>
          {!item.isEnrolled && (
            <View style={styles.autoEnrollBadge}>
              <Text style={styles.autoEnrollText}>Auto-Enroll</Text>
            </View>
          )}
        </View>

        <View style={styles.sessionDetails}>
          <Text style={styles.sessionInfo}>📚 {item.courseCode}</Text>
          <Text style={styles.sessionInfo}>👤 {item.attendantName}</Text>
          <Text style={styles.sessionInfo}>🕐 {item.schedule}</Text>
          {!item.isEnrolled && (
            <Text style={styles.autoEnrollInfo}>
              ℹ️ You'll be enrolled in {item.courseCode} when you join
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.joinButton,
            isJoining && styles.joinButtonLoading,
          ]}
          onPress={() => handleJoinSession(item)}
          disabled={isJoining}
        >
          {isJoining ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.joinButtonText}>Join Session</Text>
          )}
        </TouchableOpacity>
      </View>
    );
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
            <View>
              <Text style={styles.headerTitle}>Scan for Sessions</Text>
              <Text style={styles.headerSubtitle}>
                All active sessions ({sessions.length})
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoEmoji}>📡</Text>
            <Text style={styles.infoText}>
              Scanning for all active sessions. Join any session and you'll be automatically enrolled in the course!
            </Text>
          </View>

          {/* Active Sessions Count */}
          {!loading && sessions.length > 0 && (
            <View style={styles.activeSessionsHeader}>
              <Text style={styles.activeSessionsText}>
                ✅ {sessions.length} Active Session{sessions.length !== 1 ? 's' : ''} Found
              </Text>
            </View>
          )}

          {/* Debug Info - Hidden in production */}
          {/* Uncomment below to see debug info */}
          {/* {!loading && (
            <View style={styles.debugCard}>
              <Text style={styles.debugText}>
                🔍 Debug Info:{"\n"}
                API URL: {API_BASE_URL}/attendee/sessions/scan{"\n"}
                Sessions in state: {sessions.length}{"\n"}
                Sessions data: {JSON.stringify(sessions.map(s => ({id: s.id, title: s.title})))}{"\n"}
                {"\n"}
                Sessions array: {sessions.length > 0 ? "HAS DATA" : "EMPTY"}
              </Text>
            </View>
          )} */}

          {/* Manual Session List for Testing */}
          {!loading && sessions.length > 0 && (
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 12 }}>
                📋 Sessions List (Manual Render):
              </Text>
              {sessions.map((session, index) => (
                <View key={session.id} style={{
                  backgroundColor: "#E3F2FD",
                  padding: 12,
                  marginBottom: 8,
                  borderRadius: 8
                }}>
                  <Text style={{ fontWeight: "600" }}>
                    {index + 1}. {session.title}
                  </Text>
                  <Text>Course: {session.courseCode}</Text>
                  <Text>Attendant: {session.attendantName}</Text>
                  <Text>Schedule: {session.schedule}</Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#4d88ff",
                      padding: 10,
                      borderRadius: 8,
                      marginTop: 8,
                      alignItems: "center",
                    }}
                    onPress={() => handleJoinSession(session)}
                  >
                    <Text style={{ color: "#FFF", fontWeight: "600" }}>
                      Join Session
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4d88ff" />
              <Text style={styles.loadingText}>Scanning for sessions...</Text>
            </View>
          ) : sessions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>No active sessions found</Text>
              <Text style={styles.emptySubtext}>
                Pull down to refresh and scan again
              </Text>
            </View>
          ) : (
            <FlatList
              data={sessions}
              renderItem={renderSession}
              keyExtractor={(item) => item.id.toString()}
              style={styles.sessionsList}
              contentContainerStyle={styles.sessionsListContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={["#4d88ff"]}
                />
              }
            />
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleRefresh}
              disabled={loading}
            >
              <Text style={styles.refreshButtonText}>
                🔄 Refresh Scan
              </Text>
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
  headerSubtitle: {
    fontSize: 14,
    color: "#6E6E73",
    marginTop: 4,
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
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  infoEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#1565C0",
    lineHeight: 18,
  },
  loadingContainer: {
    padding: 60,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6E6E73",
  },
  sessionsList: {
    flex: 1,
  },
  sessionsListContent: {
    padding: 16,
  },
  sessionCard: {
    backgroundColor: "#F5F5F7",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  sessionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginRight: 8,
  },
  autoEnrollBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  autoEnrollText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  autoEnrollInfo: {
    fontSize: 12,
    color: "#10b981",
    fontStyle: "italic",
    marginTop: 4,
  },
  sessionDetails: {
    marginBottom: 12,
  },
  sessionInfo: {
    fontSize: 14,
    color: "#6E6E73",
    marginBottom: 4,
  },
  joinButton: {
    backgroundColor: "#4d88ff",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  joinButtonLoading: {
    opacity: 0.7,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6E6E73",
    textAlign: "center",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  refreshButton: {
    backgroundColor: "#4d88ff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  debugCard: {
    backgroundColor: "#FFF3CD",
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFC107",
  },
  debugText: {
    fontSize: 11,
    color: "#856404",
    fontFamily: "monospace",
  },
  activeSessionsHeader: {
    backgroundColor: "#E8F5E9",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  activeSessionsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E7D32",
  },
});

