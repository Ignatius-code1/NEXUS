import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

export default function SignUpScreen({ navigation }: any) {
  const [fullName, setFullName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
       
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>Join the Attendance System</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.neuBox}>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#8E8E93"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.neuBox}>
          <TextInput
            placeholder="Organization Name"
            placeholderTextColor="#8E8E93"
            style={styles.input}
            value={organizationName}
            onChangeText={setOrganizationName}
          />
        </View>

        <View style={styles.neuBox}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#8E8E93"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.neuBox}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#8E8E93"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.neuBox}>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#8E8E93"
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity style={[styles.neuButton]} onPress={() => {}}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Login")}
          >
            Login
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F2F2F5",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  header: { alignItems: "center", marginBottom: 40 },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: "#F5F5F7",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  organizationName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 8,
    letterSpacing: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1C1C1E",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#4A4A4A",
    marginTop: 4,
  },
  form: { width: "100%", alignItems: "center" },
  neuBox: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#F5F5F7",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 18,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  input: { fontSize: 16, color: "#1C1C1E" },
  neuButton: {
    width: "100%",
    backgroundColor: "#F5F5F7",
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: { color: "#1C1C1E", fontSize: 16, fontWeight: "600" },
  footerText: { marginTop: 20, color: "#4A4A4A", fontSize: 13 },
  link: { color: "#1C1C1E", fontWeight: "500" },
});