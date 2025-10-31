import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { adminApi, Analytics } from "../services/adminApi";

export default function AdminDashboardScreen() {
  const navigation = useNavigation();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await adminApi.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.log('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>NEXUS</Text>
        <Text style={styles.subtitle}>Because every presence matters.</Text>
      </View>

      {/* Welcome */}
      <View style={styles.welcomeBox}>
        <Text style={styles.welcomeText}>Admin Dashboard</Text>
        <Text style={styles.welcomeSub}>Welcome back 👋</Text>
      </View>

      {/* Stats Cards */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9b5cff" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      ) : (
        <View style={styles.statsContainer}>
          <LinearGradient colors={["#9b5cff", "#a83eff"]} style={styles.card}>
            <Ionicons name="people" size={28} color="white" />
            <Text style={styles.cardTitle}>Total Users</Text>
            <Text style={styles.cardValue}>{analytics?.totalUsers || 0}</Text>
            <Text style={styles.cardChange}></Text>
          </LinearGradient>

          <LinearGradient colors={["#4d88ff", "#005eff"]} style={styles.card}>
            <MaterialIcons name="school" size={28} color="white" />
            <Text style={styles.cardTitle}>Active Units</Text>
            <Text style={styles.cardValue}>{analytics?.activeUnits || 0}</Text>
            <Text style={styles.cardChange}></Text>
          </LinearGradient>

          <LinearGradient colors={["#34d399", "#059669"]} style={styles.card}>
            <FontAwesome5 name="chart-line" size={24} color="white" />
            <Text style={styles.cardTitle}>Avg. Attendance</Text>
            <Text style={styles.cardValue}>{analytics?.avgAttendance || 0}%</Text>
            <Text style={styles.cardChange}></Text>
          </LinearGradient>

          <LinearGradient colors={["#7c3aed", "#4c1d95"]} style={styles.card}>
            <Ionicons name="pulse" size={28} color="white" />
            <Text style={styles.cardTitle}>Active Sessions</Text>
            <Text style={styles.cardValue}>{analytics?.activeSessions || 0}</Text>
            <Text style={styles.cardChange}></Text>
          </LinearGradient>
        </View>
      )}

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => (navigation as any).navigate("AdminNav", { screen: "Manage Users" })}
        >
          <Ionicons name="person-add" size={28} color="#9b5cff" />
          <Text style={styles.actionTitle}>Manage Users</Text>
          <Text style={styles.actionDesc}>Add, edit or remove users</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => (navigation as any).navigate("AdminNav", { screen: "Manage Sessions" })}
        >
          <MaterialIcons name="menu-book" size={28} color="#4d88ff" />
          <Text style={styles.actionTitle}>Manage Sessions</Text>
          <Text style={styles.actionDesc}>Configure sessions and courses</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => (navigation as any).navigate("AdminNav", { screen: "View Analytics" })}
        >
          <FontAwesome5 name="chart-bar" size={28} color="#4c1d95" />
          <Text style={styles.actionTitle}>View Analytics</Text>
          <Text style={styles.actionDesc}>System-wide insights</Text>
        </TouchableOpacity>
      </View>

      {/* User Distribution */}
      {analytics && (
        <>
          <Text style={styles.sectionTitle}>User Distribution</Text>
          <View style={styles.userDist}>
            <Text style={styles.distLabel}>Attendees: {analytics.userDistribution.attendees}</Text>
            <Text style={styles.distLabel}>Attendants: {analytics.userDistribution.attendants}</Text>
            <Text style={styles.distLabel}>Administrators: {analytics.userDistribution.admins}</Text>
          </View>
        </>
      )}

      {/* Recent Activity */}
      {analytics && analytics.recentActivity.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityContainer}>
            {analytics.recentActivity.map((activity, index) => (
              <Text key={index} style={styles.activityItem}>{activity}</Text>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fc", paddingHorizontal: 15, paddingTop: 50 },
  header: { alignItems: "center", marginTop: 20 },
  logo: { fontSize: 28, fontWeight: "bold", color: "#9b5cff" },
  subtitle: { color: "#666", fontSize: 12, marginBottom: 10 },
  welcomeBox: { marginTop: 10, marginBottom: 15 },
  welcomeText: { fontSize: 20, fontWeight: "700", color: "#1f2937" },
  welcomeSub: { color: "#6b7280", fontSize: 14 },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  cardTitle: { color: "white", fontSize: 14, marginTop: 8 },
  cardValue: { color: "white", fontSize: 22, fontWeight: "bold" },
  cardChange: { color: "#f9fafb", fontSize: 12 },
  sectionTitle: { fontWeight: "600", fontSize: 16, color: "#1f2937", marginTop: 20, marginBottom: 10 },
  quickActions: { flexDirection: "column", gap: 10 },
  actionCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  actionTitle: { fontSize: 15, fontWeight: "600", marginTop: 6 },
  actionDesc: { fontSize: 12, color: "#6b7280" },
  userDist: { backgroundColor: "white", padding: 15, borderRadius: 12, marginBottom: 20 },
  distLabel: { fontSize: 13, fontWeight: "600", marginTop: 5 },
  progressBarContainer: {
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    height: 8,
    overflow: "hidden",
  },
  progressBar: {
    height: 8,
    borderRadius: 10,
  },
  activityContainer: { backgroundColor: "white", padding: 15, borderRadius: 12, marginBottom: 30 },
  activityItem: { fontSize: 13, color: "#374151", marginVertical: 3 },
  adminNavButton: {
    backgroundColor: "#9b5cff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    marginVertical: 20,
  },
  adminNavText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 10,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    color: "#6b7280",
    fontSize: 16,
  },
});