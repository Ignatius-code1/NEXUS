import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import { attendantApi } from "../../services/attendantApi";
import { colors } from "../../theme/colors";
import { shadows } from "../../theme/shadows";

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>('1'); // Default to first session
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      loadReports();
    }
  }, [selectedSession]);

  const loadSessions = async () => {
    try {
      const data = await attendantApi.getSessions();
      setSessions(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load sessions');
    }
  };

  const loadReports = async () => {
    try {
      const data = await attendantApi.getReports(selectedSession);
      setReports(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load reports');
    }
  };

  const handleExport = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      Alert.alert('Export ready', `Exported ${reports.length} attendance records.`);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reports</Text>
      <Text style={styles.sub}>Download attendance reports for your sessions.</Text>

      <ScrollView style={{ marginTop: 16 }}>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionTitle}>Select Date Range</Text>
        </TouchableOpacity>

        {sessions.map(session => (
          <TouchableOpacity 
            key={session.id} 
            style={[styles.option, selectedSession === session.id && styles.selectedOption]} 
            onPress={() => setSelectedSession(session.id)}
          >
            <Text style={styles.optionTitle}>{session.title || `Session ${session.id}`}</Text>
            <Text style={styles.optionSubtitle}>BLE: {session.ble_id}</Text>
          </TouchableOpacity>
        ))}

        {reports.length > 0 && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Attendance Summary</Text>
            <Text style={styles.statsText}>Total Records: {reports.length}</Text>
            <Text style={styles.statsText}>Present: {reports.filter(r => r.status === 'Present').length}</Text>
          </View>
        )}
      </ScrollView>

      <View style={{ marginTop: 18 }}>
        <PrimaryButton label={generating ? "Generating..." : "Export CSV"} onPress={handleExport} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  header: { fontSize: 22, fontWeight: "700", color: colors.textPrimary },
  sub: { color: colors.textSecondary, marginTop: 6 },
  option: { backgroundColor: colors.surfaceLight, padding: 14, marginTop: 12, borderRadius: 12, ...shadows.light, ...shadows.dark },
  optionTitle: { fontWeight: "600", color: colors.textPrimary },
  statsCard: { backgroundColor: colors.surfaceLight, padding: 16, marginTop: 12, borderRadius: 12, ...shadows.light, ...shadows.dark },
  statsTitle: { fontSize: 16, fontWeight: "700", color: colors.textPrimary, marginBottom: 8 },
  statsText: { color: colors.textSecondary, marginBottom: 4 },
  selectedOption: { backgroundColor: colors.primary, opacity: 0.1 },
  optionSubtitle: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
});