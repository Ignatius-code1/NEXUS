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

// API Base URL - uses environment variable or falls back to current IP
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://172.30.39.233:3000/api";

export default function AdminDashboard({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAttendants: 0,
    totalAttendees: 0,
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }

      const token = await AsyncStorage.getItem("token");

      // Fetch login activity to get user counts
      const response = await fetch(`${API_BASE_URL}/bulk/login-activity`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const attendants = data.login_activity.filter(
          (u: any) => u.role === "Attendant"
        ).length;
        const attendees = data.login_activity.filter(
          (u: any) => u.role === "Attendee"
        ).length;

        setStats({
          totalUsers: data.total_users,
          totalAttendants: attendants,
          totalAttendees: attendees,
        });
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

  const navigateToCSVUpload = () => {
    navigation.navigate("CSVUpload");
  };

  const navigateToManageUsers = () => {
    navigation.navigate("ManageUsers");
  };

  const navigateToViewReports = () => {
    navigation.navigate("ViewReports");
  };

  const navigateToViewSessions = () => {
    navigation.navigate("ViewSessions");
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
          <Text style={styles.userName}>{user?.name || "Admin"}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalUsers}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalAttendants}</Text>
          <Text style={styles.statLabel}>Attendants</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalAttendees}</Text>
          <Text style={styles.statLabel}>Attendees</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={navigateToCSVUpload}
        >
          <View style={styles.actionIcon}>
            <Text style={styles.actionEmoji}>📤</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Upload CSV</Text>
            <Text style={styles.actionSubtitle}>
              Bulk upload teachers and students
            </Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={navigateToManageUsers}
        >
          <View style={styles.actionIcon}>
            <Text style={styles.actionEmoji}>👥</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Manage Users</Text>
            <Text style={styles.actionSubtitle}>
              View and edit all users
            </Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={navigateToViewReports}
        >
          <View style={styles.actionIcon}>
            <Text style={styles.actionEmoji}>📊</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>View Reports</Text>
            <Text style={styles.actionSubtitle}>
              Attendance analytics and reports
            </Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={navigateToViewSessions}
        >
          <View style={styles.actionIcon}>
            <Text style={styles.actionEmoji}>📅</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>View Sessions</Text>
            <Text style={styles.actionSubtitle}>
              All active and past sessions
            </Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoEmoji}>💡</Text>
        <Text style={styles.infoText}>
          Tip: Upload a CSV file to quickly add multiple users at once. Make
          sure your CSV includes: name, email, role, and units columns.
        </Text>
      </View>
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 24,
    paddingBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  statLabel: {
    fontSize: 12,
    color: "#6E6E73",
    marginTop: 4,
    textAlign: "center",
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
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#FFF9E6",
    borderRadius: 16,
    padding: 16,
    margin: 24,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FFD700",
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

