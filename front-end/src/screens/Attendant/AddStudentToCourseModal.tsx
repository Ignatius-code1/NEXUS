import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API Base URL - uses environment variable or falls back to current IP
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://172.30.39.233:3000/api";

interface Student {
  id: number;
  name: string;
  email: string;
  serial: string;
  units: string[];
}

interface AddStudentToCourseModalProps {
  visible: boolean;
  onClose: () => void;
  courseCode: string;
  onStudentAdded: () => void;
}

export default function AddStudentToCourseModal({
  visible,
  onClose,
  courseCode,
  onStudentAdded,
}: AddStudentToCourseModalProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingStudentId, setAddingStudentId] = useState<number | null>(null);

  useEffect(() => {
    if (visible) {
      loadStudents();
    }
  }, [visible]);

  useEffect(() => {
    // Filter students based on search query
    if (searchQuery.trim() === "") {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredStudents(
        students.filter(
          (student) =>
            student.name.toLowerCase().includes(query) ||
            student.email.toLowerCase().includes(query) ||
            student.serial.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, students]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/attendant/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } else {
        Alert.alert("Error", "Failed to load students");
      }
    } catch (error) {
      console.error("Failed to load students:", error);
      Alert.alert("Error", "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (studentId: number, studentName: string) => {
    setAddingStudentId(studentId);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/attendant/students/${studentId}/add-course`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            courseCode: courseCode,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Success! ✅",
          `${studentName} has been added to ${courseCode}`,
          [
            {
              text: "OK",
              onPress: () => {
                loadStudents(); // Refresh the list
                onStudentAdded();
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", data.error || "Failed to add student to course");
      }
    } catch (error) {
      console.error("Failed to add student:", error);
      Alert.alert("Error", "Failed to add student to course");
    } finally {
      setAddingStudentId(null);
    }
  };

  const isStudentEnrolled = (student: Student) => {
    return student.units.includes(courseCode);
  };

  const renderStudent = ({ item }: { item: Student }) => {
    const enrolled = isStudentEnrolled(item);
    const isAdding = addingStudentId === item.id;

    return (
      <View style={styles.studentCard}>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.studentEmail}>{item.email}</Text>
          <Text style={styles.studentSerial}>Serial: {item.serial}</Text>
          {item.units.length > 0 && (
            <Text style={styles.studentUnits}>
              Courses: {item.units.join(", ")}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.addButton,
            enrolled && styles.enrolledButton,
            isAdding && styles.addButtonDisabled,
          ]}
          onPress={() => handleAddStudent(item.id, item.name)}
          disabled={enrolled || isAdding}
        >
          {isAdding ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.addButtonText}>
              {enrolled ? "✓ Enrolled" : "+ Add"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Add Students to Course</Text>
              <Text style={styles.headerSubtitle}>Course: {courseCode}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, email, or serial..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4d88ff" />
              <Text style={styles.loadingText}>Loading students...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredStudents}
              renderItem={renderStudent}
              keyExtractor={(item) => item.id.toString()}
              style={styles.studentsList}
              contentContainerStyle={styles.studentsListContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyEmoji}>👥</Text>
                  <Text style={styles.emptyText}>No students found</Text>
                  <Text style={styles.emptySubtext}>
                    {searchQuery
                      ? "Try a different search term"
                      : "No students in the system yet"}
                  </Text>
                </View>
              }
            />
          )}

          <View style={styles.footer}>
            <TouchableOpacity style={styles.doneButton} onPress={onClose}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6E6E73",
    marginTop: 4,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#6E6E73",
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  searchInput: {
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#1C1C1E",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6E6E73",
  },
  studentsList: {
    flex: 1,
  },
  studentsListContent: {
    padding: 16,
  },
  studentCard: {
    flexDirection: "row",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  studentEmail: {
    fontSize: 14,
    color: "#6E6E73",
    marginBottom: 2,
  },
  studentSerial: {
    fontSize: 12,
    color: "#9B9BA0",
    marginBottom: 4,
  },
  studentUnits: {
    fontSize: 12,
    color: "#4d88ff",
    fontStyle: "italic",
  },
  addButton: {
    backgroundColor: "#4d88ff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  enrolledButton: {
    backgroundColor: "#10b981",
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
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
    color: "#6E6E73",
    textAlign: "center",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  doneButton: {
    backgroundColor: "#4d88ff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

