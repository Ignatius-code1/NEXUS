import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StartSessionModal from "./StartSessionModal";
import CreateSessionModal from "./CreateSessionModal";

// API Base URL - uses environment variable or falls back to current IP
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://172.30.39.233:3000/api";

export default function AttendantDashboard({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [units, setUnits] = useState<string[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [createModalVisible, setCreateModalVisible] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setUnits(parsedUser.units || []);
      }

      const token = await AsyncStorage.getItem("token");

      // Fetch sessions created by this attendant
      const response = await fetch(`${API_BASE_URL}/attendant/sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("user");
          navigation.replace("Login");
        },
      },
    ]);
  };

  const startBluetoothSession = (unit: string) => {
    setSelectedUnit(unit);
    setModalVisible(true);
  };

  const handleSessionCreated = () => {
    loadDashboardData();
  };

  const handleEndSession = (sessionId: number, sessionTitle: string) => {
    Alert.alert(
      "End Session",
      `Are you sure you want to end "${sessionTitle}"? Students will no longer be able to join.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Session",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              const response = await fetch(
                `${API_BASE_URL}/attendant/sessions/${sessionId}/end`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.ok) {
                Alert.alert("Success", "Session ended successfully");
                loadDashboardData();
              } else {
                Alert.alert("Error", "Failed to end session");
              }
            } catch (error) {
              console.error("Failed to end session:", error);
              Alert.alert("Error", "Failed to end session");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1C1C1E" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || "Attendant"}</Text>
          <Text style={styles.role}>Attendant</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Start Session Button */}
      <View style={styles.startSessionContainer}>
        <TouchableOpacity
          style={styles.startSessionButton}
          onPress={() => setCreateModalVisible(true)}
        >
          <View style={styles.startSessionIcon}>
            <Text style={styles.startSessionEmoji}>📡</Text>
          </View>
          <View style={styles.startSessionContent}>
            <Text style={styles.startSessionTitle}>Start New Session</Text>
            <Text style={styles.startSessionSubtitle}>
              Create a session for students to join
            </Text>
          </View>
          <Text style={styles.startSessionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* My Classes/Units */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Classes</Text>
        {units.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>📚</Text>
            <Text style={styles.emptyText}>
              No classes assigned yet. Contact your admin to assign classes.
            </Text>
          </View>
        ) : (
          units.map((unit, index) => (
            <View key={index} style={styles.unitCard}>
              <View style={styles.unitIcon}>
                <Text style={styles.unitEmoji}>📖</Text>
              </View>
              <View style={styles.unitContent}>
                <Text style={styles.unitTitle}>{unit.trim()}</Text>
                <Text style={styles.unitSubtitle}>Tap to start session</Text>
              </View>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => startBluetoothSession(unit.trim())}
              >
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Active Sessions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Sessions</Text>
        {sessions.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyText}>
              No sessions yet. Start a Bluetooth session for your class!
            </Text>
          </View>
        ) : (
          sessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionTitle}>{session.title}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    session.isActive
                      ? styles.statusActive
                      : styles.statusInactive,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {session.isActive ? "Active" : "Ended"}
                  </Text>
                </View>
              </View>
              <Text style={styles.sessionInfo}>
                Course: {session.courseCode}
              </Text>
              <Text style={styles.sessionInfo}>
                Schedule: {session.schedule}
              </Text>
              <View style={styles.attendanceInfo}>
                <Text style={styles.sessionInfo}>
                  👥 Total Joined: {session.attendanceCount || 0}
                </Text>
                <Text style={[styles.sessionInfo, { color: "#34C759", fontWeight: "600" }]}>
                  ✅ Present: {session.presentCount || 0}
                </Text>
              </View>
              {session.isActive && (
                <TouchableOpacity
                  style={styles.endSessionButton}
                  onPress={() => handleEndSession(session.id, session.title)}
                >
                  <Text style={styles.endSessionButtonText}>End Session</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate("AttendantSchedule")}
        >
          <View style={styles.actionIcon}>
            <Text style={styles.actionEmoji}>📅</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>My Schedule</Text>
            <Text style={styles.actionSubtitle}>
              View my teaching schedule
            </Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate("ViewSessions")}
        >
          <View style={styles.actionIcon}>
            <Text style={styles.actionEmoji}>📊</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>View All Sessions</Text>
            <Text style={styles.actionSubtitle}>
              See all sessions and attendance
            </Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate("ViewReports")}
        >
          <View style={styles.actionIcon}>
            <Text style={styles.actionEmoji}>📈</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>View Reports</Text>
            <Text style={styles.actionSubtitle}>
              Attendance analytics and reports
            </Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoEmoji}>💡</Text>
        <Text style={styles.infoText}>
          Tip: Start a Bluetooth session for your class. Students can then join
          the session from their devices to mark attendance automatically.
        </Text>
      </View>

      {/* Start Session Modal (for unit-specific sessions) */}
      <StartSessionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        unit={selectedUnit}
        onSessionCreated={handleSessionCreated}
      />

      {/* Create Session Modal (for general sessions) */}
      <CreateSessionModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSessionCreated={handleSessionCreated}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F5",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F2F2F5",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6E6E73",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  greeting: {
    fontSize: 16,
    color: "#6E6E73",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C1C1E",
    marginTop: 4,
  },
  role: {
    fontSize: 14,
    color: "#007AFF",
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  section: {
    padding: 24,
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  unitCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  unitIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  unitEmoji: {
    fontSize: 24,
  },
  unitContent: {
    flex: 1,
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  unitSubtitle: {
    fontSize: 13,
    color: "#6E6E73",
    marginTop: 2,
  },
  startButton: {
    backgroundColor: "#34C759",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  sessionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: "#E8F5E9",
  },
  statusInactive: {
    backgroundColor: "#F5F5F7",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  sessionInfo: {
    fontSize: 14,
    color: "#6E6E73",
    marginTop: 4,
  },
  attendanceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F7",
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  actionSubtitle: {
    fontSize: 13,
    color: "#6E6E73",
    marginTop: 2,
  },
  actionArrow: {
    fontSize: 24,
    color: "#C7C7CC",
    fontWeight: "300",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#6E6E73",
    textAlign: "center",
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    borderRadius: 16,
    padding: 16,
    margin: 24,
    marginTop: 12,
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
  startSessionContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  startSessionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4d88ff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#4d88ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startSessionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  startSessionEmoji: {
    fontSize: 28,
  },
  startSessionContent: {
    flex: 1,
  },
  startSessionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  startSessionSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
  },
  startSessionArrow: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "300",
  },
  endSessionButton: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    alignItems: "center",
  },
  endSessionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

