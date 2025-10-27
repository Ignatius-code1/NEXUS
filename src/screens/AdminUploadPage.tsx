import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import * as DocumentPicker from 'expo-document-picker';

interface ManualEntry {
  name: string;
  serialNumber: string;
  email: string;
  role: string;
}

export default function AdminUploadPage({ navigation }: any) {
  const [csvData, setCsvData] = useState<ManualEntry[]>([]);
  const [manualEntry, setManualEntry] = useState<ManualEntry>({
    name: "",
    serialNumber: "",
    email: "",
    role: "Attendee",
  });
  const [showManualForm, setShowManualForm] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(1);
  const [attendantCount, setAttendantCount] = useState(1);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const handleFileUpload = () => {
    setShowPermissionModal(true);
  };

  const handleGrantPermission = async () => {
    setShowPermissionModal(false);
    
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv',
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        setSelectedFile({
          name: file.name,
          size: file.size,
          type: file.mimeType || 'text/csv'
        });
        
        // Simulate CSV parsing
        const mockCsvData = [
          { name: "John Doe", email: "john@example.com", role: "Attendee", serialNumber: "ATD001" },
          { name: "Jane Smith", email: "jane@example.com", role: "Attendant", serialNumber: "ATT001" },
          { name: "Bob Johnson", email: "bob@example.com", role: "Attendee", serialNumber: "ATD002" },
          { name: "Alice Brown", email: "alice@example.com", role: "Attendee", serialNumber: "ATD003" },
        ];
        setCsvData(mockCsvData);
      }
    } catch (error) {
      console.log('Document picker error:', error);
    }
  };

  const addManualEntry = () => {
    if (!manualEntry.name || !manualEntry.email) {
      alert("Please fill all fields");
      return;
    }
    
    const serialNumber = manualEntry.role === "Attendee" 
      ? `ATD${attendeeCount.toString().padStart(3, '0')}`
      : `ATT${attendantCount.toString().padStart(3, '0')}`;
    
    const newEntry = { ...manualEntry, serialNumber };
    setCsvData([...csvData, newEntry]);
    
    if (manualEntry.role === "Attendee") {
      setAttendeeCount(attendeeCount + 1);
    } else {
      setAttendantCount(attendantCount + 1);
    }
    
    setManualEntry({
      name: "",
      serialNumber: "",
      email: "",
      role: "Attendee",
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.logoContainer}>
        <View style={styles.neumorphicCircle}>
          <Image 
            source={require('../images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>
      
      <Text style={styles.title}>Add Members to Your Organization</Text>
      <Text style={styles.subtitle}>
        Upload a CSV file or manually add people to your organization.
      </Text>

      <TouchableOpacity style={[styles.button, styles.shadow]} onPress={handleFileUpload}>
        <Text style={styles.buttonText}>Upload CSV File</Text>
      </TouchableOpacity>
      
      {selectedFile && (
        <View style={[styles.fileInfo, styles.shadow]}>
          <Text style={styles.fileInfoTitle}>📄 Selected File:</Text>
          <Text style={styles.fileInfoName}>{selectedFile.name}</Text>
          <Text style={styles.fileInfoSize}>{(selectedFile.size / 1024).toFixed(1)} KB</Text>
        </View>
      )}

      {csvData.length > 0 && (
        <FlatList
          data={csvData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemBox}>
              <Text style={styles.itemText}>
                {item.name} — {item.email} ({item.role})
              </Text>
            </View>
          )}
          style={styles.listContainer}
        />
      )}

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => setShowManualForm(!showManualForm)}
      >
        <Text style={styles.linkText}>
          {showManualForm ? "Hide Manual Form" : "Add Manually"}
        </Text>
      </TouchableOpacity>

      {showManualForm && (
        <View style={styles.manualForm}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#9E9E9E"
            value={manualEntry.name}
            onChangeText={(text) =>
              setManualEntry({ ...manualEntry, name: text })
            }
          />
          <View style={styles.roleSelector}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                manualEntry.role === "Attendee" && styles.roleButtonActive
              ]}
              onPress={() => setManualEntry({ ...manualEntry, role: "Attendee" })}
            >
              <Text style={[
                styles.roleButtonText,
                manualEntry.role === "Attendee" && styles.roleButtonTextActive
              ]}>Attendee</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleButton,
                manualEntry.role === "Attendant" && styles.roleButtonActive
              ]}
              onPress={() => setManualEntry({ ...manualEntry, role: "Attendant" })}
            >
              <Text style={[
                styles.roleButtonText,
                manualEntry.role === "Attendant" && styles.roleButtonTextActive
              ]}>Attendant</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#9E9E9E"
            keyboardType="email-address"
            value={manualEntry.email}
            onChangeText={(text) =>
              setManualEntry({ ...manualEntry, email: text })
            }
          />
          <TouchableOpacity
            style={[styles.addButton, styles.shadow]}
            onPress={addManualEntry}
          >
            <Text style={styles.addButtonText}>Add Person</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.proceedButton, styles.shadow]}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Text style={styles.proceedText}>Proceed to Dashboard</Text>
      </TouchableOpacity>
      
      <Modal
        visible={showPermissionModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, styles.shadow]}>
            <Text style={styles.modalTitle}>File Access Permission</Text>
            <Text style={styles.modalMessage}>
              This app needs access to your files to upload CSV documents. Please grant permission to continue.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowPermissionModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.grantButton, styles.shadow]}
                onPress={handleGrantPermission}
              >
                <Text style={styles.grantButtonText}>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F5F7",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  neumorphicCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F5F5F7",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E2E2E",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#777777",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#0A84FF",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 14,
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  listContainer: {
    marginTop: 20,
    width: "100%",
    maxHeight: 200,
  },
  itemBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    width: "100%",
  },
  itemText: {
    color: "#333333",
    fontSize: 14,
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: "#7E57C2",
    fontWeight: "600",
    fontSize: 16,
  },
  manualForm: {
    width: "100%",
    marginTop: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    fontSize: 15,
    color: "#333333",
  },
  addButton: {
    backgroundColor: "#7E57C2",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  addButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "600",
  },
  proceedButton: {
    backgroundColor: "#0A84FF",
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 30,
    width: "100%",
  },
  proceedText: {
    textAlign: "center",
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
  shadow: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  roleSelector: {
    flexDirection: "row",
    marginVertical: 6,
    gap: 10,
  },
  roleButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  roleButtonActive: {
    backgroundColor: "#0A84FF",
    borderColor: "#0A84FF",
  },
  roleButtonText: {
    color: "#333333",
    fontSize: 15,
    fontWeight: "600",
  },
  roleButtonTextActive: {
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: "#F5F5F7",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E2E2E",
    textAlign: "center",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    color: "#777777",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  grantButton: {
    backgroundColor: "#0A84FF",
  },
  cancelButtonText: {
    color: "#777777",
    fontWeight: "600",
    fontSize: 14,
  },
  grantButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  fileInfo: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  fileInfoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E2E2E",
    marginBottom: 4,
  },
  fileInfoName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A84FF",
    marginBottom: 2,
  },
  fileInfoSize: {
    fontSize: 12,
    color: "#777777",
  },
});