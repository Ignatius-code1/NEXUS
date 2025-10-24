import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { shadows } from "../../theme/shadows";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.neumorphicCircle}>
          <Image 
            source={require('../../images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>

      <Text style={styles.organizationName}>NEXUS</Text>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Log in to manage attendance easily</Text>

      <View style={styles.form}>
        <InputField label="Email" placeholder="Enter your email" />
        <InputField label="Password" placeholder="Enter your password" secureTextEntry />

        <PrimaryButton label="Login" onPress={() => {}} />

        <TouchableOpacity>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.textMuted}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    marginBottom: 30,
    alignItems: "center",
  },
  neumorphicCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.light,
    ...shadows.dark,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.subheading,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  form: {
    width: "100%",
    gap: 16,
  },
  link: {
    textAlign: "right",
    color: colors.primary,
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  textMuted: {
    color: colors.textSecondary,
  },
  signupText: {
    color: colors.primary,
    fontWeight: "600",
  },
});