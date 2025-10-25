import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function SignUpScreen({ navigation }: any) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validatePassword = (pwd: string) => {
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    const isLongEnough = pwd.length >= 8;
    return hasUpper && hasLower && hasNumber && hasSymbol && isLongEnough;
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!organizationName.trim()) newErrors.organizationName = "Organization name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Valid email is required";
    if (!validatePassword(password)) newErrors.password = "Password must be 8+ chars with uppercase, lowercase, number & symbol";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = () => {
    if (validateForm()) {
      // Proceed with sign up
      console.log("Form is valid");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardContainer} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
            placeholder="First Name"
            placeholderTextColor="#8E8E93"
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

        <View style={styles.neuBox}>
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#8E8E93"
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

        <View style={styles.neuBox}>
          <TextInput
            placeholder="Organization Name"
            placeholderTextColor="#8E8E93"
            style={styles.input}
            value={organizationName}
            onChangeText={setOrganizationName}
          />
        </View>
        {errors.organizationName && <Text style={styles.errorText}>{errors.organizationName}</Text>}

        <View style={styles.neuBox}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#8E8E93"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <View style={styles.neuBox}>
          <TextInput
            placeholder="Password (8+ chars, A-z, 0-9, symbol)"
            placeholderTextColor="#8E8E93"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

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
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

        <TouchableOpacity style={[styles.neuButton]} onPress={handleSignUp}>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#F2F2F5",
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#F2F2F5",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 800,
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
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
    paddingLeft: 16,
  },
});