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
import FindSessionModal from "./FindSessionModal";

// API Base URL - uses environment variable or falls back to current IP
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://172.30.39.233:3000/api";

export default function AttendeeDashboard({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [units, setUnits] = useState<string[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [attendanceStats, setAttendanceStats] = useState({
    totalSessions: 0,
    presentCount: 0,
    attendanceRate: 0,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("");

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

      // Fetch attendance records
      const attendanceResponse = await fetch(
        `${API_BASE_URL}/attendee/attendance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (attendanceResponse.ok) {
        const attendanceData = await attendanceResponse.json();
        setAttendanceRecords(attendanceData);
      }

      // Fetch profile with stats
      const profileResponse = await fetch(`${API_BASE_URL}/attendee/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (profileData.attendance_stats) {
          setAttendanceStats({
            totalSessions: profileData.attendance_stats.total_sessions,
            presentCount: profileData.attendance_stats.present_count,
            attendanceRate: profileData.attendance_stats.attendance_rate,
          });
        }
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

  const findBluetoothSessions = (unit: string) => {
    setSelectedUnit(unit);
    setModalVisible(true);
  };

  const handleAttendanceMarked = () => {
    loadDashboardData();
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
          <Text style={styles.userName}>{user?.name || "Attendee"}</Text>
          <Text style={styles.role}>Attendee</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* My Classes/Units */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Classes</Text>
        {units.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>📚</Text>
            <Text style={styles.emptyText}>
              No classes registered yet. Contact your admin to register for classes.
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
                <Text style={styles.unitSubtitle}>Tap to find session</Text>
              </View>
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => findBluetoothSessions(unit.trim())}
              >
                <Text style={styles.scanButtonText}>Scan</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Attendance Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attendance Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{attendanceStats.totalSessions}</Text>
            <Text style={styles.summaryLabel}>Total Sessions</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{attendanceStats.presentCount}</Text>
            <Text style={styles.summaryLabel}>Present</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{attendanceStats.attendanceRate}%</Text>
            <Text style={styles.summaryLabel}>Attendance Rate</Text>
          </View>
        </View>
      </View>

      {/* Recent Attendance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Attendance</Text>
        {attendanceRecords.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyText}>
              No attendance records yet. Join a Bluetooth session to mark your attendance!
            </Text>
          </View>
        ) : (
          attendanceRecords.slice(0, 5).map((record, index) => (
            <View key={index} style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <Text style={styles.recordTitle}>
                  {record.session_title || "Session"}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    record.status === "Present"
                      ? styles.statusPresent
                      : styles.statusAbsent,
                  ]}
                >
                  <Text style={styles.statusText}>{record.status}</Text>
                </View>
              </View>
              <Text style={styles.recordInfo}>
                Course: {record.session_code || "N/A"}
              </Text>
              <Text style={styles.recordInfo}>
                Date: {new Date(record.timestamp).toLocaleDateString()}
              </Text>
              <Text style={styles.recordInfo}>
                Time: {new Date(record.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.actionIcon}>
            <Text style={styles.actionEmoji}>📊</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>View Full Report</Text>
            <Text style={styles.actionSubtitle}>
              Detailed attendance history
            </Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.actionIcon}>
            <Text style={styles.actionEmoji}>📅</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>View Schedule</Text>
            <Text style={styles.actionSubtitle}>
              My class schedule
            </Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoEmoji}>💡</Text>
        <Text style={styles.infoText}>
          Tip: When your teacher starts a Bluetooth session, tap "Scan" on your
          class to find and join the session automatically.
        </Text>
      </View>

      {/* Find Session Modal */}
      <FindSessionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        unit={selectedUnit}
        onAttendanceMarked={handleAttendanceMarked}
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
    color: "#34C759",
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
    backgroundColor: "#FFF3E0",
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
  scanButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6E6E73",
    marginTop: 4,
    textAlign: "center",
  },
  summaryDivider: {
    width: 1,
    backgroundColor: "#E5E5EA",
    marginHorizontal: 8,
  },
  recordCard: {
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
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  recordTitle: {
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
  statusPresent: {
    backgroundColor: "#E8F5E9",
  },
  statusAbsent: {
    backgroundColor: "#FFEBEE",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  recordInfo: {
    fontSize: 14,
    color: "#6E6E73",
    marginTop: 4,
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
    backgroundColor: "#E8F5E9",
    borderRadius: 16,
    padding: 16,
    margin: 24,
    marginTop: 12,
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
});

