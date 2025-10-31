import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ClassSchedule {
  unit: string;
  day: string;
  time: string;
  room: string;
}

export default function ScheduleScreen({ navigation }: any) {
  const [schedule, setSchedule] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState<string[]>([]);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      const userData = user ? JSON.parse(user) : null;
      
      if (userData?.units) {
        const userUnits = userData.units.split(",").map((u: string) => u.trim());
        setUnits(userUnits);
        
        // Generate sample schedule based on user's units
        const sampleSchedule: ClassSchedule[] = userUnits.flatMap((unit: string, index: number) => {
          const days = ["Monday", "Wednesday", "Friday"];
          const times = ["08:00 AM - 10:00 AM", "10:30 AM - 12:30 PM", "02:00 PM - 04:00 PM"];
          const rooms = ["Room 101", "Room 202", "Lab 3", "Hall A"];
          
          return days.map((day, dayIndex) => ({
            unit,
            day,
            time: times[(index + dayIndex) % times.length],
            room: rooms[(index + dayIndex) % rooms.length],
          }));
        });
        
        setSchedule(sampleSchedule);
      }
    } catch (error) {
      console.error("Failed to load schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDayColor = (day: string) => {
    const colors: { [key: string]: string } = {
      Monday: "#eff6ff",
      Tuesday: "#f0fdf4",
      Wednesday: "#fef3c7",
      Thursday: "#fce7f3",
      Friday: "#f3e8ff",
      Saturday: "#fee2e2",
      Sunday: "#f5f5f5",
    };
    return colors[day] || "#f5f5f5";
  };

  const groupByDay = () => {
    const grouped: { [key: string]: ClassSchedule[] } = {};
    schedule.forEach((item) => {
      if (!grouped[item.day]) {
        grouped[item.day] = [];
      }
      grouped[item.day].push(item);
    });
    return grouped;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1C1C1E" />
        <Text style={styles.loadingText}>Loading schedule...</Text>
      </View>
    );
  }

  const groupedSchedule = groupByDay();
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

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
        <Text style={styles.title}>Class Schedule</Text>
        <Text style={styles.subtitle}>Your weekly timetable</Text>
      </View>

      <ScrollView style={styles.scheduleList}>
        {schedule.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyText}>No schedule available</Text>
            <Text style={styles.emptySubtext}>
              Your class schedule will appear here once you're registered for units
            </Text>
          </View>
        ) : (
          days.map((day) => (
            <View key={day} style={styles.daySection}>
              <Text style={styles.dayTitle}>{day}</Text>
              {groupedSchedule[day] && groupedSchedule[day].length > 0 ? (
                groupedSchedule[day].map((item, index) => (
                  <View
                    key={`${day}-${index}`}
                    style={[
                      styles.classCard,
                      { backgroundColor: getDayColor(day) },
                    ]}
                  >
                    <View style={styles.classHeader}>
                      <Text style={styles.className}>{item.unit}</Text>
                      <Text style={styles.classRoom}>📍 {item.room}</Text>
                    </View>
                    <Text style={styles.classTime}>🕐 {item.time}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.noClassCard}>
                  <Text style={styles.noClassText}>No classes scheduled</Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Info Card */}
      {schedule.length > 0 && (
        <View style={styles.infoCard}>
          <Text style={styles.infoEmoji}>💡</Text>
          <Text style={styles.infoText}>
            Make sure to attend all your scheduled classes to maintain good attendance.
          </Text>
        </View>
      )}
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
    color: "#1C1C1E",
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
  scheduleList: {
    flex: 1,
    padding: 16,
  },
  daySection: {
    marginBottom: 24,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  classCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  classHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  className: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  classRoom: {
    fontSize: 13,
    color: "#6b7280",
  },
  classTime: {
    fontSize: 14,
    color: "#4b5563",
  },
  noClassCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    alignItems: "center",
  },
  noClassText: {
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#eff6ff",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
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

