import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function MessagesPage() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <View style={styles.card}>
        <Text style={styles.sender}>Admin</Text>
        <Text style={styles.message}>Your next attendance session is tomorrow at 10:00 AM.</Text>
        <Text style={styles.time}>2 hours ago</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.sender}>System</Text>
        <Text style={styles.message}>Your attendance rate has improved by 5% this week.</Text>
        <Text style={styles.time}>1 day ago</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#222", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  sender: { fontWeight: "700", fontSize: 15, color: "#A020F0" },
  message: { marginTop: 6, color: "#444", fontSize: 14 },
  time: { color: "#888", fontSize: 12, marginTop: 8 },
});

