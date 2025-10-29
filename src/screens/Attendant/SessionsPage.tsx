import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import { colors } from "../../theme/colors";
import { shadows } from "../../theme/shadows";

type Session = {
  id: string;
  title: string;
  courseCode?: string;
  instructor?: string;
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newSession, setNewSession] = useState({ title: "", courseCode: "", startTime: "", endTime: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const mock: Session[] = [
      { id: "s1", title: "Computer Science 101", courseCode: "CS101", instructor: "Jane Smith", startTime: "09:00", endTime: "10:30", isActive: true },
      { id: "s2", title: "Mathematics 201", courseCode: "MATH201", instructor: "John Doe", startTime: "11:00", endTime: "12:30", isActive: false },
    ];
    setTimeout(() => {
      setSessions(mock);
      setLoading(false);
    }, 600);
  }, []);

  const handleCreate = async () => {
    if (!newSession.title || !newSession.startTime || !newSession.endTime) {
      Alert.alert("Validation", "Please fill title, start and end times.");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const next: Session = {
        id: `s${Date.now()}`,
        title: newSession.title,
        courseCode: newSession.courseCode,
        startTime: newSession.startTime,
        endTime: newSession.endTime,
        instructor: "You (Attendant)",
        isActive: true,
      };
      setSessions([next, ...sessions]);
      setModalVisible(false);
      setNewSession({ title: "", courseCode: "", startTime: "", endTime: "" });
      setSaving(false);
      Alert.alert("Created", "Session created and started.");
    }, 800);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Session Control</Text>
      <Text style={styles.sub}>Create and manage sessions for check-ins</Text>

      <PrimaryButton label="Create New Session" onPress={() => setModalVisible(true)} />

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={{ marginTop: 12 }}>
          {sessions.map((s) => (
            <View key={s.id} style={styles.card}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.title}>{s.title}</Text>
                <Text style={[styles.status, { color: s.isActive ? "#065F46" : "#991B1B" }]}>{s.isActive ? "Active" : "Inactive"}</Text>
              </View>
              <Text style={styles.meta}>{s.courseCode} • {s.instructor}</Text>
              <Text style={styles.metaSmall}>Time: {s.startTime} - {s.endTime}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            <Text style={modalStyles.title}>Create New Session</Text>
            <TextInput
              placeholder="Session Title"
              style={modalStyles.input}
              value={newSession.title}
              onChangeText={(t) => setNewSession((p) => ({ ...p, title: t }))}
            />
            <TextInput
              placeholder="Course Code (optional)"
              style={modalStyles.input}
              value={newSession.courseCode}
              onChangeText={(t) => setNewSession((p) => ({ ...p, courseCode: t }))}
            />
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TextInput
                placeholder="Start (HH:MM)"
                style={[modalStyles.input, { flex: 1 }]}
                value={newSession.startTime}
                onChangeText={(t) => setNewSession((p) => ({ ...p, startTime: t }))}
              />
              <TextInput
                placeholder="End (HH:MM)"
                style={[modalStyles.input, { flex: 1 }]}
                value={newSession.endTime}
                onChangeText={(t) => setNewSession((p) => ({ ...p, endTime: t }))}
              />
            </View>

            <PrimaryButton label={saving ? "Creating..." : "Start Session"} onPress={handleCreate} />
            <TouchableOpacity style={{ marginTop: 8 }} onPress={() => setModalVisible(false)}>
              <Text style={{ textAlign: "center", color: colors.textSecondary }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center" },
  container: { width: "90%", backgroundColor: "white", borderRadius: 12, padding: 18 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  input: { backgroundColor: "#F3F4F6", padding: 12, borderRadius: 10, marginBottom: 10 },
});

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  header: { fontSize: 22, fontWeight: "700", color: colors.textPrimary },
  sub: { color: colors.textSecondary, marginBottom: 12 },
  card: { backgroundColor: colors.surfaceLight, padding: 14, marginBottom: 10, borderRadius: 12, ...shadows.light, ...shadows.dark },
  title: { fontSize: 16, fontWeight: "700", color: colors.textPrimary },
  meta: { color: colors.textSecondary, marginTop: 6 },
  metaSmall: { color: colors.textSecondary, marginTop: 2, fontSize: 13 },
  status: { fontWeight: "700" },
});