import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { shadows } from "../../theme/shadows";
import { useNavigation } from "@react-navigation/native";

export default function LandingScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <View style={styles.neumorphicCircle}>
          <Image 
            source={require('../../images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Tagline Section */}
      <Text style={styles.title}>Attendance Management System</Text>
      <Text style={styles.subtitle}>
        Seamless, Smart, and Secure Attendance Tracking
      </Text>

      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate("Login" as never)}
        >
          <Text style={[styles.buttonText, styles.primaryButtonText]}>
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate("SignUp" as never)}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>Powered by NEXUS © 2025</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  neumorphicCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.light,
    ...shadows.dark,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
    maxWidth: 280,
  },
  subtitle: {
    ...typography.subheading,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: 260,
    marginBottom: 40,
  },
  buttonsContainer: {
    width: "100%",
    gap: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: colors.primary,
    ...shadows.dark,
  },
  secondaryButton: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.primary,
    ...shadows.light,
    ...shadows.dark,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButtonText: {
    color: "#FFFFFF",
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  footer: {
    color: colors.textSecondary,
    fontSize: 12,
    position: "absolute",
    bottom: 30,
  },
});