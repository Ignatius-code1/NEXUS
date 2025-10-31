import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API Base URL - uses environment variable or falls back to current IP
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://172.30.39.233:3000/api";

interface ReportSummary {
  totalSessions: number;
  activeSessions: number;
  totalAttendanceRecords: number;
  totalStudents: number;
  averageAttendance: number;
  presentCount: number;
}

interface SessionReport {
  id: number;
  title: string;
  courseCode: string;
  attendantName: string;
  schedule: string;
  isActive: boolean;
  totalAttendees: number;
  presentCount: number;
  attendanceRate: number;
  createdAt: string;
}

interface StudentReport {
  id: number;
  name: string;
  email: string;
  serial: string;
  enrolledCourses: string[];
  totalSessions: number;
  presentCount: number;
  attendanceRate: number;
}

interface FullReport {
  summary: ReportSummary;
  sessions: SessionReport[];
  students: StudentReport[];
  generatedAt: string;
}

export default function ViewReportsScreen({ navigation }: any) {
  const [report, setReport] = useState<FullReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'summary' | 'sessions' | 'students'>('summary');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/admin/reports/full`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReport(data);
      } else {
        Alert.alert("Error", "Failed to load reports");
      }
    } catch (error) {
      console.error("Failed to load reports:", error);
      Alert.alert("Error", "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9b5cff" />
        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>No report data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Full Attendance Report</Text>
        <Text style={styles.subtitle}>
          Comprehensive system analytics
        </Text>
      </View>

      {/* View Mode Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'summary' && styles.tabActive]}
          onPress={() => setViewMode('summary')}
        >
          <Text style={[styles.tabText, viewMode === 'summary' && styles.tabTextActive]}>
            Summary
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'sessions' && styles.tabActive]}
          onPress={() => setViewMode('sessions')}
        >
          <Text style={[styles.tabText, viewMode === 'sessions' && styles.tabTextActive]}>
            Sessions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'students' && styles.tabActive]}
          onPress={() => setViewMode('students')}
        >
          <Text style={[styles.tabText, viewMode === 'students' && styles.tabTextActive]}>
            Students
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Summary View */}
        {viewMode === 'summary' && (
          <>
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: "#eff6ff" }]}>
                <Text style={styles.statEmoji}>📊</Text>
                <Text style={styles.statValue}>{report.summary.totalSessions}</Text>
                <Text style={styles.statLabel}>Total Sessions</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: "#f0fdf4" }]}>
                <Text style={styles.statEmoji}>✅</Text>
                <Text style={styles.statValue}>{report.summary.presentCount}</Text>
                <Text style={styles.statLabel}>Present Records</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: "#fef3c7" }]}>
                <Text style={styles.statEmoji}>📈</Text>
                <Text style={styles.statValue}>{report.summary.averageAttendance.toFixed(1)}%</Text>
                <Text style={styles.statLabel}>Average Rate</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: "#fce7f3" }]}>
                <Text style={styles.statEmoji}>👥</Text>
                <Text style={styles.statValue}>{report.summary.totalStudents}</Text>
                <Text style={styles.statLabel}>Total Students</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: "#e0e7ff" }]}>
                <Text style={styles.statEmoji}>🎯</Text>
                <Text style={styles.statValue}>{report.summary.activeSessions}</Text>
                <Text style={styles.statLabel}>Active Sessions</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: "#fef2f2" }]}>
                <Text style={styles.statEmoji}>📝</Text>
                <Text style={styles.statValue}>{report.summary.totalAttendanceRecords}</Text>
                <Text style={styles.statLabel}>Total Records</Text>
              </View>
            </View>
          </>
        )}

        {/* Sessions View */}
        {viewMode === 'sessions' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Session Reports ({report.sessions.length})
            </Text>
            {report.sessions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>📅</Text>
                <Text style={styles.emptyText}>No sessions found</Text>
              </View>
            ) : (
              report.sessions.map((session) => (
                <View key={session.id} style={styles.reportCard}>
                  <View style={styles.reportHeader}>
                    <View style={styles.reportInfo}>
                      <Text style={styles.reportTitle}>{session.title}</Text>
                      <Text style={styles.reportSubtitle}>
                        📚 {session.courseCode} • 👤 {session.attendantName}
                      </Text>
                      <Text style={styles.reportSchedule}>
                        🕐 {session.schedule}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        session.isActive ? styles.statusActive : styles.statusEnded,
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {session.isActive ? "Active" : "Ended"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.reportStats}>
                    <View style={styles.reportStat}>
                      <Text style={styles.reportStatValue}>{session.totalAttendees}</Text>
                      <Text style={styles.reportStatLabel}>Total</Text>
                    </View>
                    <View style={styles.reportStat}>
                      <Text style={[styles.reportStatValue, { color: "#10b981" }]}>
                        {session.presentCount}
                      </Text>
                      <Text style={styles.reportStatLabel}>Present</Text>
                    </View>
                    <View style={styles.reportStat}>
                      <Text style={[styles.reportStatValue, { color: "#9b5cff" }]}>
                        {session.attendanceRate.toFixed(1)}%
                      </Text>
                      <Text style={styles.reportStatLabel}>Rate</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Students View */}
        {viewMode === 'students' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Student Reports ({report.students.length})
            </Text>
            {report.students.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>👥</Text>
                <Text style={styles.emptyText}>No students found</Text>
              </View>
            ) : (
              report.students.map((student) => (
                <View key={student.id} style={styles.reportCard}>
                  <View style={styles.reportHeader}>
                    <View style={styles.reportInfo}>
                      <Text style={styles.reportTitle}>{student.name}</Text>
                      <Text style={styles.reportSubtitle}>
                        📧 {student.email}
                      </Text>
                      <Text style={styles.reportSchedule}>
                        🎓 {student.enrolledCourses.length} course{student.enrolledCourses.length !== 1 ? 's' : ''}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.ratingBadge,
                        student.attendanceRate >= 75
                          ? styles.ratingGood
                          : student.attendanceRate >= 50
                          ? styles.ratingMedium
                          : styles.ratingPoor,
                      ]}
                    >
                      <Text style={styles.ratingText}>
                        {student.attendanceRate.toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                  <View style={styles.reportStats}>
                    <View style={styles.reportStat}>
                      <Text style={styles.reportStatValue}>{student.totalSessions}</Text>
                      <Text style={styles.reportStatLabel}>Sessions</Text>
                    </View>
                    <View style={styles.reportStat}>
                      <Text style={[styles.reportStatValue, { color: "#10b981" }]}>
                        {student.presentCount}
                      </Text>
                      <Text style={styles.reportStatLabel}>Present</Text>
                    </View>
                    <View style={styles.reportStat}>
                      <Text style={[styles.reportStatValue, { color: "#ef4444" }]}>
                        {student.totalSessions - student.presentCount}
                      </Text>
                      <Text style={styles.reportStatLabel}>Absent</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoEmoji}>💡</Text>
          <Text style={styles.infoText}>
            Reports are updated in real-time. Generated at: {new Date(report.generatedAt).toLocaleString()}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: "#9b5cff",
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#9b5cff",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  tabTextActive: {
    color: "#9b5cff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    width: "48%",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  reportCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  reportSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 2,
  },
  reportSchedule: {
    fontSize: 12,
    color: "#9ca3af",
  },
  reportStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  reportStat: {
    alignItems: "center",
  },
  reportStatValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  reportStatLabel: {
    fontSize: 11,
    color: "#9ca3af",
    textTransform: "uppercase",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusActive: {
    backgroundColor: "#10b981",
  },
  statusEnded: {
    backgroundColor: "#9ca3af",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  ratingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: "center",
  },
  ratingGood: {
    backgroundColor: "#10b981",
  },
  ratingMedium: {
    backgroundColor: "#f59e0b",
  },
  ratingPoor: {
    backgroundColor: "#ef4444",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#eff6ff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  infoEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#1e40af",
    lineHeight: 20,
  },
});

