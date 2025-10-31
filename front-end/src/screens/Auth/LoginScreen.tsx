import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { shadows } from "../../theme/shadows";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Base URL - uses environment variable or falls back to current IP
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.39.233:3000/api';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save token and user data
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      Alert.alert("Success", `Welcome back, ${data.user.name}!`);

      // Navigate based on role
      if (data.user.role === 'Admin') {
        navigation.replace('AdminDashboard');
      } else if (data.user.role === 'Attendant') {
        navigation.replace('AttendantDashboard');
      } else {
        navigation.replace('AttendeeDashboard');
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Invalid email or password");
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <InputField
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <InputField
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <PrimaryButton
          label={loading ? "Logging in..." : "Login"}
          onPress={handleLogin}
          disabled={loading}
        />

        {loading && <ActivityIndicator size="small" color={colors.primary} />}

        <TouchableOpacity>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.textMuted}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
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