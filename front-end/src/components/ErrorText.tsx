import React from "react";
import { Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function ErrorText({ message }: { message?: string }) {
  if (!message) return null;

  return <Text style={styles.errorText}>{message}</Text>;
}

const styles = StyleSheet.create({
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});