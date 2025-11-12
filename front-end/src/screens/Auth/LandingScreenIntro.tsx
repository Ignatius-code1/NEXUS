import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { shadows } from "../../theme/shadows";
import { useNavigation } from "@react-navigation/native";

export default function LandingScreenIntro() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.logoContainer}>
        <View style={styles.neumorphicCircle}>
          <Image 
            source={require('../../images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>

      <Text style={styles.title}>Smart Attendance. Simplified.</Text>
      <Text style={styles.description}>
        NEXUS is a modern Attendance Management System designed to
        simplify tracking, improve accuracy, and empower institutions with real-time insights.
      </Text>

      <View style={styles.featuresContainer}>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>🎓 Easy Tracking</Text>
          <Text style={styles.featureText}>
            Attendees check in securely with QR or location verification.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>📊 Real-Time Reports</Text>
          <Text style={styles.featureText}>
            Get attendance analytics instantly for classes, events and work shifts.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>🔒 Secure Data</Text>
          <Text style={styles.featureText}>
            Your institution's data stays private and protected.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={() => navigation.navigate("Landing" as never)}
      >
        <Text style={styles.getStartedText}>Get Started</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>© 2025 NEXUS – Attendance Made Easy</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
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
    width: 90,
    height: 90,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 16,
    marginTop: 10,
  },
  description: {
    ...typography.subheading,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
    maxWidth: 320,
  },
  featuresContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 40,
  },
  featureCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    padding: 16,
    ...shadows.light,
    ...shadows.dark,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  getStartedButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 14,
    ...shadows.dark,
  },
  getStartedText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 30,
  },
});