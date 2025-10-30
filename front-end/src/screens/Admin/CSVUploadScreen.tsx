import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://192.168.100.31:3000/api";

export default function CSVUploadScreen({ navigation }: any) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploadResults, setUploadResults] = useState<any>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "text/comma-separated-values", "application/vnd.ms-excel"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile(file);
        Alert.alert("File Selected", `${file.name} is ready to upload`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick file");
      console.error("File picker error:", error);
    }
  };

  const uploadCSV = async () => {
    if (!selectedFile) {
      Alert.alert("No File", "Please select a CSV file first");
      return;
    }

    setUploading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      // Create FormData
      const formData = new FormData();
      formData.append("file", {
        uri: selectedFile.uri,
        type: "text/csv",
        name: selectedFile.name,
      } as any);

      const response = await fetch(`${API_BASE_URL}/bulk/upload-mixed`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // Store results to display passwords
      setUploadResults(data);

      // Show success message
      Alert.alert(
        "Upload Successful! 🎉",
        `Created ${data.attendees_created} attendees and ${data.attendants_created} attendants.\n\nWelcome emails sent with login credentials!`,
        [
          {
            text: "View Credentials",
            onPress: () => {
              // Results will be shown below
            },
          },
        ]
      );

      setSelectedFile(null);
    } catch (error: any) {
      Alert.alert("Upload Failed", error.message || "Please try again");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const skipUpload = () => {
    Alert.alert(
      "Skip Upload?",
      "You can upload users later from the Admin Dashboard",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Skip",
          onPress: () => navigation.replace("AdminDashboard"),
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upload Users</Text>
        <Text style={styles.subtitle}>
          Upload a CSV file with your attendants and attendees
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📋 CSV Format Required:</Text>
        <Text style={styles.infoText}>name, email, role, units</Text>
        <Text style={styles.infoExample}>
          Example:{"\n"}
          John Teacher,john@school.com,Attendant,"Math 101, Physics 202"{"\n"}
          Jane Student,jane@school.com,Attendee,"Math 101, Chemistry 303"
        </Text>
        <Text style={styles.infoNote}>
          • Role: "Attendant" (teacher) or "Attendee" (student){"\n"}
          • Units: Comma-separated list in quotes{"\n"}
          • System will auto-generate passwords & send welcome emails
        </Text>
      </View>

      {selectedFile && (
        <View style={styles.fileCard}>
          <Text style={styles.fileName}>📄 {selectedFile.name}</Text>
          <Text style={styles.fileSize}>
            {(selectedFile.size / 1024).toFixed(2)} KB
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.pickButton}
        onPress={pickDocument}
        disabled={uploading}
      >
        <Text style={styles.pickButtonText}>
          {selectedFile ? "Change File" : "Select CSV File"}
        </Text>
      </TouchableOpacity>

      {selectedFile && (
        <TouchableOpacity
          style={[styles.uploadButton, uploading && styles.buttonDisabled]}
          onPress={uploadCSV}
          disabled={uploading}
        >
          <Text style={styles.uploadButtonText}>
            {uploading ? "Uploading..." : "Upload & Create Users"}
          </Text>
        </TouchableOpacity>
      )}

      {uploading && (
        <ActivityIndicator
          size="large"
          color="#1C1C1E"
          style={{ marginTop: 20 }}
        />
      )}

      {/* Display Upload Results with Passwords */}
      {uploadResults && (
        <View style={styles.resultsCard}>
          <Text style={styles.resultsTitle}>✅ Users Created Successfully!</Text>
          <Text style={styles.resultsSubtitle}>
            📧 Welcome emails sent with these credentials:
          </Text>

          {uploadResults.created_attendants?.length > 0 && (
            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>
                👨‍🏫 Attendants ({uploadResults.created_attendants.length}):
              </Text>
              {uploadResults.created_attendants.map((user: any, index: number) => (
                <View key={index} style={styles.userCredential}>
                  <Text style={styles.credentialName}>• {user.name}</Text>
                  <Text style={styles.credentialEmail}>  Email: {user.email}</Text>
                  <Text style={styles.credentialPassword}>  Password: {user.password}</Text>
                  <Text style={styles.credentialUnits}>  Units: {user.units || "None"}</Text>
                </View>
              ))}
            </View>
          )}

          {uploadResults.created_attendees?.length > 0 && (
            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>
                👨‍🎓 Attendees ({uploadResults.created_attendees.length}):
              </Text>
              {uploadResults.created_attendees.map((user: any, index: number) => (
                <View key={index} style={styles.userCredential}>
                  <Text style={styles.credentialName}>• {user.name}</Text>
                  <Text style={styles.credentialEmail}>  Email: {user.email}</Text>
                  <Text style={styles.credentialPassword}>  Password: {user.password}</Text>
                  <Text style={styles.credentialUnits}>  Units: {user.units || "None"}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.dashboardButton}
            onPress={() => navigation.replace("AdminDashboard")}
          >
            <Text style={styles.dashboardButtonText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}

      {!uploadResults && (
        <>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={skipUpload}
            disabled={uploading}
          >
            <Text style={styles.skipButtonText}>Skip for Now</Text>
          </TouchableOpacity>

          <View style={styles.helpCard}>
            <Text style={styles.helpText}>
              💡 Tip: You can also upload users later from the Admin Dashboard
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F2F2F5",
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6E6E73",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: "monospace",
    color: "#007AFF",
    marginBottom: 12,
    backgroundColor: "#F5F5F7",
    padding: 8,
    borderRadius: 8,
  },
  infoExample: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#6E6E73",
    backgroundColor: "#F5F5F7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoNote: {
    fontSize: 13,
    color: "#6E6E73",
    lineHeight: 20,
  },
  fileCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  fileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 14,
    color: "#6E6E73",
  },
  pickButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#1C1C1E",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  pickButtonText: {
    color: "#1C1C1E",
    fontWeight: "600",
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: "#1C1C1E",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  skipButtonText: {
    color: "#6E6E73",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  helpCard: {
    backgroundColor: "#FFF9E6",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  helpText: {
    fontSize: 14,
    color: "#6E6E73",
    textAlign: "center",
  },
  resultsCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 14,
    padding: 20,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 8,
    textAlign: "center",
  },
  resultsSubtitle: {
    fontSize: 14,
    color: "#558B2F",
    marginBottom: 16,
    textAlign: "center",
  },
  resultSection: {
    marginBottom: 20,
  },
  resultSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  userCredential: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  credentialName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  credentialEmail: {
    fontSize: 13,
    color: "#424242",
    marginBottom: 2,
  },
  credentialPassword: {
    fontSize: 13,
    color: "#D32F2F",
    fontWeight: "600",
    marginBottom: 2,
  },
  credentialUnits: {
    fontSize: 12,
    color: "#757575",
  },
  dashboardButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  dashboardButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});

