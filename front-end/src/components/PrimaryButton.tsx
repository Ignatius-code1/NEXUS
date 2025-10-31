import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { shadows } from "../theme/shadows";

export default function PrimaryButton({ label, onPress, disabled }: any) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    ...shadows.dark,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});