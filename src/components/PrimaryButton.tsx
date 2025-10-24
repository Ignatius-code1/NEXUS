import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { shadows } from "../theme/shadows";

export default function PrimaryButton({ label, onPress }: any) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
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
  text: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});