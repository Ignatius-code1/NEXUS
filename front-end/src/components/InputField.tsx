import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { shadows } from "../theme/shadows";

export default function InputField({
  label,
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize
}: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.neumorphicInput}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  label: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  neumorphicInput: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...shadows.light,
    ...shadows.dark,
  },
  input: {
    color: colors.textPrimary,
    fontSize: 14,
  },
});