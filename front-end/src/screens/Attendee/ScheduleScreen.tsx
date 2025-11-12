import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API Base URL - uses environment variable or falls back to current IP
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://172.30.39.233:3000/api";

interface SessionSchedule {
  id: number;
  courseCode: string;
  title: string;
  attendantName: string;
  schedule: string;
  isActive: boolean;
  createdAt: string;
}

export default function ScheduleScreen({ navigation }: any) {
  const [sessions, setSessions] = useState<SessionSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/attendee/schedule`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEnrolledCourses(data.enrolledCourses || []);
        setSessions(data.sessions || []);
      } else {
        Alert.alert("Error", "Failed to load schedule");
      }
    } catch (error) {
      console.error("Failed to load schedule:", error);
      Alert.alert("Error", "Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  const groupByCourse = () => {
    const grouped: { [key: string]: SessionSchedule[] } = {};
    sessions.forEach((session) => {
      if (!grouped[session.courseCode]) {
        grouped[session.courseCode] = [];
      }
      grouped[session.courseCode].push(session);
    });
    return grouped;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1C1C1E" />
        <Text style={styles.loadingText}>Loading schedule...</Text>
      </View>
    );
  }

  const groupedSessions = groupByCourse();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Schedule</Text>
        <Text style={styles.subtitle}>
          {enrolledCourses.length} Enrolled Course{enrolledCourses.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView style={styles.scheduleList}>
        {sessions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyText}>No sessions scheduled</Text>
            <Text style={styles.emptySubtext}>
              Sessions will appear here once you join or are enrolled in courses
            </Text>
          </View>
        ) : (
          Object.keys(groupedSessions).map((courseCode) => (
            <View key={courseCode} style={styles.courseSection}>
              <Text style={styles.courseTitle}>📚 {courseCode}</Text>
              {groupedSessions[courseCode].map((session) => (
                <View
                  key={session.id}
                  style={[
                    styles.sessionCard,
                    { backgroundColor: session.isActive ? "#E8F5E9" : "#F5F5F7" },
                  ]}
                >
                  <View style={styles.sessionHeader}>
                    <View style={styles.sessionInfo}>
                      <Text style={styles.sessionTitle}>{session.title}</Text>
                      <Text style={styles.sessionInstructor}>
                        👤 {session.attendantName}
                      </Text>
                      <Text style={styles.sessionSchedule}>
                        🕐 {session.schedule}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        session.isActive
                          ? styles.statusActive
                          : styles.statusEnded,
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {session.isActive ? "Active" : "Ended"}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* Info Card */}
      {sessions.length > 0 && (
        <View style={styles.infoCard}>
          <Text style={styles.infoEmoji}>💡</Text>
          <Text style={styles.infoText}>
            Active sessions are currently accepting attendance. Join them to mark your presence!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: "#1C1C1E",
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  scheduleList: {
    flex: 1,
    padding: 16,
  },
  courseSection: {
    marginBottom: 24,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  sessionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 6,
  },
  sessionInstructor: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  sessionSchedule: {
    fontSize: 14,
    color: "#4b5563",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusActive: {
    backgroundColor: "#10b981",
  },
  statusEnded: {
    backgroundColor: "#9ca3af",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "uppercase",
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
    color: "#6b7280",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#eff6ff",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  infoEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#1e40af",
    lineHeight: 20,
  },
});

