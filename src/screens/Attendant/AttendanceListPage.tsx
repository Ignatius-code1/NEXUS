import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../../components/PrimaryButton";
import SearchBar from "../../components/SearchBar";
import { attendantApi, Attendee, Session } from "../../services/attendantApi";
import ErrorMessage from "../../components/ErrorMessage";
import { colors } from "../../theme/colors";
import { shadows } from "../../theme/shadows";



export default function AttendanceListPage({ route }: any) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [students, setStudents] = useState<Attendee[]>([]);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [route?.params]);

  const loadData = async () => {
    try {
      const [attendeesData, sessionsData] = await Promise.all([
        attendantApi.getAttendees(),
        attendantApi.getSessions()
      ]);
      
      setStudents(attendeesData.map(a => ({ ...a, present: false })));
      
      if (sessionsData.length > 0) {
        const activeSession = sessionsData.find(s => !s.ended_at) || sessionsData[0];
        setSession({
          id: activeSession.id,
          title: activeSession.title || `Session ${activeSession.id}`,
          courseCode: activeSession.ble_id,
          date: new Date(activeSession.started_at || new Date()).toISOString().split('T')[0]
        });
      }
    } catch (error) {
      setError('Failed to load data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id: string) => {
    setStudents((prev) => prev.map(s => s.id === id ? { ...s, present: !s.present } : s));
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.id.toLowerCase().includes(query.toLowerCase()) ||
    (s.email && s.email.toLowerCase().includes(query.toLowerCase()))
  );

  const handleSave = async () => {
    if (!session) return;
    
    setSaving(true);
    try {
      const promises = students
        .filter(s => s.present)
        .map(s => attendantApi.markAttendance(s.id, session.id, 'Present'));
      
      await Promise.all(promises);
      Alert.alert('Saved', 'Attendance records updated.');
    } catch (error) {
      setError('Failed to save attendance. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Attendance — {session?.title}</Text>
      <Text style={styles.sub}>Date: {session?.date} • Code: {session?.courseCode}</Text>

      <SearchBar query={query} onChange={setQuery} />
      
      {error && <ErrorMessage message={error} />}

      <ScrollView style={{ marginTop: 12 }}>
        {filteredStudents.length === 0 ? (
          <Text style={styles.empty}>No attendees found.</Text>
        ) : (
          filteredStudents.map((s) => (
            <View key={s.id} style={styles.card}>
              <View style={styles.row}>
                <View>
                  <Text style={styles.name}>{s.name}</Text>
                  <Text style={styles.serial}>ID: {s.id} • {s.role}</Text>
                  {s.email && <Text style={styles.email}>{s.email}</Text>}
                </View>

                <TouchableOpacity style={[styles.toggle, s.present ? styles.present : styles.absent]} onPress={() => toggle(s.id)}>
                  <Ionicons name={s.present ? "checkmark" : "close"} size={20} color={s.present ? "#065F46" : "#991B1B"} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
  email: { color: colors.textSecondary, marginTop: 2, fontSize: 12 },
  empty: { textAlign: "center", color: colors.textSecondary, marginTop: 20 },
});