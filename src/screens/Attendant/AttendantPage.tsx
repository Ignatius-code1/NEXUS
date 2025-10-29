import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import PrimaryButton from "../../components/PrimaryButton";
import InputField from "../../components/InputField";
import { colors } from "../../theme/colors";
import { shadows } from "../../theme/shadows";

export default function AttendantPage() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  useEffect(() => {
    const allowed = route?.params?.fromEmail === "true" || route?.params?.fromEmail === true;
    if (!allowed) {
      Alert.alert(
        "Access restricted",
        "This page is only accessible from the email link sent to attendants.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }
  }, [route?.params, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, Attendant</Text>
      <Text style={styles.sub}>Manage your sessions, check students and download reports.</Text>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("AttendantSessions", { fromEmail: "true" })}>
          <Text style={styles.actionTitle}>Sessions</Text>
          <Text style={styles.actionSubtitle}>Create or join a session</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("AttendanceList", { fromEmail: "true" })}>
          <Text style={styles.actionTitle}>Attendance</Text>
          <Text style={styles.actionSubtitle}>Open the attendance list</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("AttendantReports", { fromEmail: "true" })}>
          <Text style={styles.actionTitle}>Reports</Text>
          <Text style={styles.actionSubtitle}>Export attendance reports</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 16 }}>
        <InputField label="Search sessions or students" placeholder="Type to search..." secureTextEntry={false} />
      </View>

      <View style={{ marginTop: 16 }}>
        <PrimaryButton label="Open Last Active Session" onPress={() => navigation.navigate("AttendanceList", { fromEmail: "true", openLast: true })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  header: { fontSize: 24, fontWeight: "700", color: colors.textPrimary, marginBottom: 4 },
  sub: { color: colors.textSecondary, marginBottom: 18 },
  quickActions: { marginTop: 8 },
  actionCard: {
    backgroundColor: colors.surfaceLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...shadows.light,
    ...shadows.dark,
  },
  actionTitle: { fontSize: 16, fontWeight: "700", color: colors.textPrimary },
  actionSubtitle: { color: colors.textSecondary, marginTop: 6 },
});