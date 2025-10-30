import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import { attendantApi, Session } from "../../services/attendantApi";
import ErrorMessage from "../../components/ErrorMessage";
import { colors } from "../../theme/colors";
import { shadows } from "../../theme/shadows";



export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newSession, setNewSession] = useState({ title: "", courseCode: "", startTime: "", endTime: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await attendantApi.getSessions();
      setSessions(data);
    } catch (error) {
      setError('Failed to load sessions. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newSession.title || !newSession.startTime || !newSession.endTime) {
      Alert.alert('Validation', 'Please fill title, start and end times.');
      return;
    }
    setSaving(true);
    try {
      const created = await attendantApi.createSession({
        title: newSession.title,
        courseCode: newSession.courseCode,
        startTime: newSession.startTime,
        endTime: newSession.endTime
      });
      setSessions([created, ...sessions]);
      setModalVisible(false);
      setNewSession({ title: '', courseCode: '', startTime: '', endTime: '' });
      Alert.alert('Created', 'Session created and started.');
    } catch (error) {
      setError('Failed to create session. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Session Control</Text>
      <Text style={styles.sub}>Create and manage sessions for check-ins</Text>

      <PrimaryButton label="Create New Session" onPress={() => setModalVisible(true)} />
      
      {error && <ErrorMessage message={error} />}

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={{ marginTop: 12 }}>
          {sessions.map((s) => (
            <View key={s.id} style={styles.card}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.title}>{s.title || `Session ${s.id}`}</Text>
                <Text style={[styles.status, { color: s.ended_at ? "#991B1B" : "#065F46" }]}>{s.ended_at ? "Ended" : "Active"}</Text>
              </View>
              <Text style={styles.meta}>BLE ID: {s.ble_id}</Text>
              <Text style={styles.metaSmall}>Started: {s.started_at ? new Date(s.started_at).toLocaleString() : 'Not started'}</Text>
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