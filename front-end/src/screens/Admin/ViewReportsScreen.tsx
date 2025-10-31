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

interface AttendanceStats {
  totalSessions: number;
  totalAttendance: number;
  averageAttendance: number;
  todayAttendance: number;
}

export default function ViewReportsScreen({ navigation }: any) {
  const [stats, setStats] = useState<AttendanceStats>({
    totalSessions: 0,
    totalAttendance: 0,
    averageAttendance: 0,
    todayAttendance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats({
          totalSessions: data.totalSessions || 0,
          totalAttendance: data.totalAttendance || 0,
          averageAttendance: data.averageAttendance || 0,
          todayAttendance: data.todayAttendance || 0,
        });
      }
    } catch (error) {
      console.error("Failed to load reports:", error);
      Alert.alert("Error", "Failed to load attendance reports");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9b5cff" />
        <Text style={styles.loadingText}>Loading reports...</Text>
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
        <Text style={styles.title}>Attendance Reports</Text>
        <Text style={styles.subtitle}>
          System-wide attendance analytics
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: "#eff6ff" }]}>
            <Text style={styles.statEmoji}>📊</Text>
            <Text style={styles.statValue}>{stats.totalSessions}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: "#f0fdf4" }]}>
            <Text style={styles.statEmoji}>✅</Text>
            <Text style={styles.statValue}>{stats.totalAttendance}</Text>
            <Text style={styles.statLabel}>Total Attendance</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: "#fef3c7" }]}>
            <Text style={styles.statEmoji}>📈</Text>
            <Text style={styles.statValue}>{stats.averageAttendance}%</Text>
            <Text style={styles.statLabel}>Average Rate</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: "#fce7f3" }]}>
            <Text style={styles.statEmoji}>🎯</Text>
            <Text style={styles.statValue}>{stats.todayAttendance}</Text>
            <Text style={styles.statLabel}>Today's Attendance</Text>
          </View>
        </View>

        {/* Report Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Actions</Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              Alert.alert(
                "Export Report",
                "Export attendance data to CSV format",
                [{ text: "OK" }]
              )
            }
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>📥</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Export to CSV</Text>
              <Text style={styles.actionSubtitle}>
                Download attendance data
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              Alert.alert(
                "Generate Report",
                "Create a detailed attendance report",
                [{ text: "OK" }]
              )
            }
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>📄</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Generate PDF Report</Text>
              <Text style={styles.actionSubtitle}>
                Comprehensive attendance summary
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              Alert.alert(
                "Filter Reports",
                "Filter by date range, class, or user",
                [{ text: "OK" }]
              )
            }
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>🔍</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Filter Reports</Text>
              <Text style={styles.actionSubtitle}>
                Customize report criteria
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoEmoji}>💡</Text>
          <Text style={styles.infoText}>
            Reports are updated in real-time as attendance is marked across all sessions.
          </Text>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    width: "48%",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
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
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: "#6b7280",
  },
  actionArrow: {
    fontSize: 24,
    color: "#d1d5db",
    fontWeight: "300",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#eff6ff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
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

