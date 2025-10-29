import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors,} from "../theme/colors";

export default function DashboardScreen() {
  const navigation: any = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to NEXUS Dashboard</Text>

      <TouchableOpacity
        style={styles.neuButton}
        onPress={() => navigation.navigate("MarkAttendance")}
      >
        <Text style={styles.buttonText}>Mark Attendance</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.neuButton}
        onPress={() => navigation.navigate("AttendanceRecords")}
      >
        <Text style={styles.buttonText}>View Attendance Records</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 30,
  },
  neuButton: {
    width: "100%",
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});
