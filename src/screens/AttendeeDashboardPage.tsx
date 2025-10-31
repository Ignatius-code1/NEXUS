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

export default function AttendeeDashboardPage({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F7FB" />
      <Text style={styles.title}>Welcome back,</Text>
      <Text style={styles.subtitle}>John Doe</Text>

      {/* Stats */}
      <View style={styles.topStats}>
        <View style={[styles.statCard, { backgroundColor: "#A020F0" }]}>
          <Ionicons name="stats-chart" size={24} color="#fff" />
          <Text style={styles.statTitle}>Attendance Rate</Text>
          <Text style={styles.statValue}>87%</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#1976D2" }]}>
          <Ionicons name="calendar" size={24} color="#fff" />
          <Text style={styles.statTitle}>Sessions Attended</Text>
          <Text style={styles.statValue}>39 / 45</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => navigation.navigate("MyUnits")}
      >
        <Ionicons name="book-outline" size={22} color="#A020F0" />
        <View>
          <Text style={styles.actionTitle}>My Units</Text>
          <Text style={styles.actionDesc}>Check in to active sessions</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => navigation.navigate("AttendanceHistory")}
      >
        <Ionicons name="time-outline" size={22} color="#1976D2" />
        <View>
          <Text style={styles.actionTitle}>Attendance History</Text>
          <Text style={styles.actionDesc}>View your records</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => navigation.navigate("Messages")}
      >
        <Ionicons name="mail-outline" size={22} color="#5E35B1" />
        <View>
          <Text style={styles.actionTitle}>Messages</Text>
          <Text style={styles.actionDesc}>Check notifications</Text>
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

