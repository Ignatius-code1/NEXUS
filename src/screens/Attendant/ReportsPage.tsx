import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import { colors } from "../../theme/colors";
import { shadows } from "../../theme/shadows";

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);

  const handleExport = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      Alert.alert("Export ready", "A CSV of attendance will be downloaded (placeholder).");
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reports</Text>
      <Text style={styles.sub}>Download attendance reports for your sessions.</Text>

      <View style={{ marginTop: 16 }}>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionTitle}>Select Date Range</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionTitle}>Select Session</Text>
        </TouchableOpacity>
      </View>

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
});