import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView } from "react-native";
import { adminApi, Analytics } from "../../services/adminApi";

export default function ViewAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await adminApi.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>System Analytics</Text>
        <Text style={styles.subtitle}>View system-wide attendance statistics</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9b5cff" />
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </View>
    );
  }

  if (!analytics) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>System Analytics</Text>
        <Text style={styles.subtitle}>View system-wide attendance statistics</Text>
        <Text style={styles.emptyText}>No analytics data available</Text>
      </View>
    );
  }

  const getAttendanceRating = (percentage: number) => {
    if (percentage >= 80) return { rating: 'Good', color: '#059669' };
    if (percentage >= 60) return { rating: 'Fair', color: '#D97706' };
    return { rating: 'Poor', color: '#DC2626' };
  };

  const attendanceRating = getAttendanceRating(analytics.avgAttendance);
  const totalMembers = analytics.userDistribution.attendees + analytics.userDistribution.attendants;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>System Analytics</Text>
      <Text style={styles.subtitle}>View system-wide attendance statistics</Text>

      <View style={styles.card}>
        <Text style={styles.metricTitle}>Total Members</Text>
        <Text style={styles.metricValue}>{totalMembers}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.metricTitle}>Attendees</Text>
        <Text style={styles.metricValue}>{analytics.userDistribution.attendees}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.metricTitle}>Attendants</Text>
        <Text style={styles.metricValue}>{analytics.userDistribution.attendants}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.metricTitle}>Average Attendance</Text>
        <Text style={styles.metricValue}>{analytics.avgAttendance}%</Text>
        <View style={[styles.ratingTag, { backgroundColor: attendanceRating.color + '20' }]}>
          <Text style={[styles.ratingText, { color: attendanceRating.color }]}>
            {attendanceRating.rating}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.metricTitle}>Active Sessions</Text>
        <Text style={styles.metricValue}>{analytics.activeSessions}</Text>
      </View>

      {analytics.recentActivity.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.card}>
            {analytics.recentActivity.map((activity, index) => (
              <Text key={index} style={styles.activityItem}>{activity}</Text>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F8FC", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#1f2937" },
  subtitle: { color: "#6b7280", marginBottom: 20 },
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
  },
  metricTitle: { fontSize: 16, color: "#6b7280" },
  metricValue: { fontSize: 20, fontWeight: "700", color: "#9b5cff" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 10,
    color: "#6b7280",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 16,
    marginTop: 50,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginTop: 20,
    marginBottom: 10,
  },
  distLabel: {
    fontSize: 14,
    color: "#374151",
    marginVertical: 2,
  },
  activityItem: {
    fontSize: 14,
    color: "#374151",
    marginVertical: 2,
  },
  ratingTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
  },
});