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

interface Session {
  id: number;
  unit: string;
  attendant_name: string;
  start_time: string;
  end_time?: string;
  status: string;
  attendance_count: number;
}

export default function ViewSessionsScreen({ navigation }: any) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/admin/sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error("Failed to load sessions:", error);
      Alert.alert("Error", "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "#10b981";
      case "ended":
        return "#6b7280";
      default:
        return "#9b5cff";
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9b5cff" />
        <Text style={styles.loadingText}>Loading sessions...</Text>
      </View>
    );
  }

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
        <Text style={styles.title}>View Sessions</Text>
        <Text style={styles.subtitle}>
          Total Sessions: {sessions.length}
        </Text>
      </View>

      <ScrollView style={styles.sessionsList}>
        {sessions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyText}>No sessions found</Text>
            <Text style={styles.emptySubtext}>
              Sessions will appear here once attendants start them
            </Text>
          </View>
        ) : (
          sessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionUnit}>{session.unit}</Text>
                  <Text style={styles.sessionAttendant}>
                    👤 {session.attendant_name}
                  </Text>
                  <Text style={styles.sessionTime}>
                    🕐 {formatDate(session.start_time)}
                    {session.end_time && ` - ${formatDate(session.end_time)}`}
                  </Text>
                  <Text style={styles.sessionAttendance}>
                    ✅ {session.attendance_count} attendees
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(session.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{session.status}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoEmoji}>💡</Text>
        <Text style={styles.infoText}>
          Active sessions are currently accepting attendance. Ended sessions are archived.
        </Text>
      </View>
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
    color: "#9b5cff",
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
  sessionsList: {
    flex: 1,
    padding: 16,
  },
  sessionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  sessionInfo: {
    flex: 1,
  },
  sessionUnit: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 6,
  },
  sessionAttendant: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 13,
    color: "#9b5cff",
    marginBottom: 4,
  },
  sessionAttendance: {
    fontSize: 13,
    color: "#10b981",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
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

