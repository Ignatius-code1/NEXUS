import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../../components/PrimaryButton";
import { colors } from "../../theme/colors";
import { shadows } from "../../theme/shadows";

type User = { id: string; name: string; serial: string; role: "attendee" | "attendant"; present?: boolean };
type Session = { id: string; title: string; courseCode?: string; date?: string };

export default function AttendanceListPage({ route }: any) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSession({ id: "s1", title: "Computer Science 101", courseCode: "CS101", date: "2025-10-29" });
      setStudents([
        { id: "u1", name: "Alice Johnson", serial: "001", role: "attendee", present: true },
        { id: "u2", name: "Bob Smith", serial: "002", role: "attendant", present: false },
        { id: "u3", name: "Charlie Brown", serial: "003", role: "attendee", present: false },
      ]);
      setLoading(false);
    }, 600);
  }, [route?.params]);

  const toggle = (id: string) => {
    setStudents((prev) => prev.map(s => s.id === id ? { ...s, present: !s.present } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Alert.alert("Saved", "Attendance records updated.");
    }, 800);
  };

  if (loading) return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Attendance — {session?.title}</Text>
      <Text style={styles.sub}>Date: {session?.date} • Code: {session?.courseCode}</Text>

      <ScrollView style={{ marginTop: 12 }}>
        {students.map((s) => (
          <View key={s.id} style={styles.card}>
            <View style={styles.row}>
              <View>
                <Text style={styles.name}>{s.name}</Text>
                <Text style={styles.serial}>#{s.serial} • {s.role}</Text>
              </View>

              <TouchableOpacity style={[styles.toggle, s.present ? styles.present : styles.absent]} onPress={() => toggle(s.id)}>
                <Ionicons name={s.present ? "checkmark" : "close"} size={20} color={s.present ? "#065F46" : "#991B1B"} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <PrimaryButton label={saving ? "Saving..." : "Save Attendance"} onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  heading: { fontSize: 20, fontWeight: "700", color: colors.textPrimary },
  sub: { color: colors.textSecondary, marginTop: 4 },
  card: { backgroundColor: colors.surfaceLight, padding: 12, borderRadius: 12, marginBottom: 10, ...shadows.light, ...shadows.dark },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontWeight: "700", color: colors.textPrimary },
  serial: { color: colors.textSecondary, marginTop: 4 },
  toggle: { padding: 10, borderRadius: 10, minWidth: 56, alignItems: "center", justifyContent: "center" },
  present: { backgroundColor: "#D1FAE5" },
  absent: { backgroundColor: "#FEE2E2" },
});