import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AttendantDashboardPage({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F7FB" />
      <Text style={styles.title}>Welcome back,</Text>
      <Text style={styles.subtitle}>Attendant</Text>

      {/* Stats */}
      <View style={styles.topStats}>
        <View style={[styles.statCard, { backgroundColor: "#A020F0" }]}>
          <Ionicons name="people" size={24} color="#fff" />
          <Text style={styles.statTitle}>Active Sessions</Text>
          <Text style={styles.statValue}>3</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#1976D2" }]}>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.statTitle}>Total Attendees</Text>
          <Text style={styles.statValue}>127</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => navigation.navigate("AttendantSessions")}
      >
        <Ionicons name="calendar-outline" size={22} color="#A020F0" />
        <View>
          <Text style={styles.actionTitle}>My Sessions</Text>
          <Text style={styles.actionDesc}>Create and manage sessions</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => navigation.navigate("AttendantAttendance")}
      >
        <Ionicons name="people-outline" size={22} color="#1976D2" />
        <View>
          <Text style={styles.actionTitle}>Mark Attendance</Text>
          <Text style={styles.actionDesc}>Track student attendance</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => navigation.navigate("AttendantReports")}
      >
        <Ionicons name="bar-chart-outline" size={22} color="#5E35B1" />
        <View>
          <Text style={styles.actionTitle}>Reports</Text>
          <Text style={styles.actionDesc}>View attendance statistics</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB", padding: 20, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: "700", color: "#222" },
  subtitle: { fontSize: 16, color: "#7A7A7A", marginBottom: 20 },
  topStats: { flexDirection: "row", justifyContent: "space-between" },
  statCard: { width: "48%", borderRadius: 18, padding: 15, elevation: 3 },
  statTitle: { color: "#fff", fontSize: 14, marginTop: 5 },
  statValue: { fontSize: 20, color: "#fff", fontWeight: "700", marginTop: 5 },
  sectionTitle: { marginTop: 25, fontSize: 18, fontWeight: "700", color: "#333" },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginTop: 12,
    elevation: 2,
    gap: 12,
  },
  actionTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  actionDesc: { color: "#888", fontSize: 13 },
});