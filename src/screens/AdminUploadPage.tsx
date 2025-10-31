import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { adminApi } from "../services/adminApi";

type RootStackParamList = {
  AdminDashboard: undefined;
};
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import Papa from "papaparse";

export default function AdminUploadPage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [csvData, setCsvData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ✅ FIXED: safer upload
  const handleFileUpload = async () => {
    console.log('Starting file upload...');
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      console.log('DocumentPicker result:', result);

      if (result.canceled) {
        console.log('User canceled file selection');
        return;
      }

      const file = result.assets ? result.assets[0] : result;
      console.log('Selected file:', file);

      if (!file) {
        Alert.alert('Error', 'No file selected');
        return;
      }

      // Read file content directly
      const fileUri = result.assets ? result.assets[0].uri : (result as any).uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      console.log('File content length:', fileContent.length);

      console.log('File content preview:', fileContent.substring(0, 200));

      const parsed = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
      });

      console.log('Parsed data:', parsed);

      if (!parsed.data || parsed.data.length === 0) {
        Alert.alert("Empty File", "No valid data found in the CSV file.");
        return;
      }

      // Generate serial numbers automatically - accept any data for now
      const validRows = parsed.data
        .filter((row: any) => row.name || row.Name || Object.keys(row).length > 0)
        .map((row: any, i: number) => {
          const name = row.name || row.Name || `Person ${i + 1}`;
          const email = row.email || row.Email || `person${i + 1}@example.com`;
          const role = row.role || row.Role || "Attendee";
          
          return {
            name,
            email,
            role,
            serialNumber: role === "Attendee" ? `A-${i + 1000}` : `T-${i + 2000}`,
          };
        });

      console.log('Valid rows:', validRows);
      setCsvData(validRows);
      setIsDataLoaded(true);
      Alert.alert("Success", `Loaded ${validRows.length} records successfully. Click 'Save to Database' to add them.`);
    } catch (error) {
      console.error("CSV Upload Error:", error);
      Alert.alert("Error", "Failed to upload or parse CSV file.");
    }
  };



  const renderHeader = () => (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>NEXUS Admin Panel</Text>
      <Text style={styles.subtitle}>Upload CSV File</Text>
      
      <View style={styles.uploadContainer}>
        <TouchableOpacity style={styles.uploadBtn} onPress={handleFileUpload}>
          <Text style={styles.uploadText}>📁 Upload CSV File</Text>
        </TouchableOpacity>
      </View>
      
      {isDataLoaded && (
        <>
          <Text style={styles.sectionTitle}>Loaded Records</Text>
          <TouchableOpacity 
            style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]} 
            onPress={handleSaveToDatabase}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.saveText}>💾 Save to Database</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const handleSaveToDatabase = async () => {
    if (csvData.length === 0) {
      Alert.alert("Error", "No data to save");
      return;
    }

    setIsSaving(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const user of csvData) {
        try {
          await adminApi.createUser({
            name: user.name,
            email: user.email,
            role: user.role,
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to save user ${user.name}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        Alert.alert(
          "Success", 
          `${successCount} users saved successfully.${errorCount > 0 ? ` ${errorCount} failed.` : ''}`
        );
      } else {
        Alert.alert("Error", "Failed to save users to database");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save users to database");
    } finally {
      setIsSaving(false);
    }
  };

  const renderFooter = () => (
    <View style={styles.proceedContainer}>
      <TouchableOpacity
        style={styles.proceedBtn}
        onPress={() => {
          console.log('Navigating to AdminDashboard...');
          navigation.navigate("AdminDashboard");
        }}
      >
        <Text style={styles.proceedText}>Proceed to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F5F5F7" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={isDataLoaded ? csvData : []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardText}>{item.email}</Text>
            <Text style={styles.cardText}>Serial: {item.serialNumber}</Text>
            <Text style={styles.cardText}>Role: {item.role}</Text>
          </View>
        )}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingBottom: 60 }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    backgroundColor: "#FFFFFF",
    width: 180,
    height: 180,
    borderRadius: 90,
    padding: 20,
    marginTop: 40,
    marginBottom: 20,
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#6C63FF",
    fontFamily: "System",
  },
  subtitle: {
    fontSize: 16,
    color: "#7D7D7D",
    marginBottom: 25,
  },
  uploadContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 12,
    marginBottom: 25,
    shadowColor: "#B8B8FF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
  },
  uploadBtn: {
    backgroundColor: "#6C63FF",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 18,
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 7,
    elevation: 5,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#5B42F3",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    marginVertical: 6,
    width: "100%",
    shadowColor: "#B74FFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  cardText: {
    color: "#555",
    fontSize: 14,
  },
  proceedContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 12,
    margin: 20,
    shadowColor: "#B8B8FF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
  },
  proceedBtn: {
    backgroundColor: "#0A84FF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 14,
    alignItems: "center",
  },
  proceedText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: "#34D399",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 18,
    marginTop: 10,
    shadowColor: "#34D399",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 7,
    elevation: 5,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
