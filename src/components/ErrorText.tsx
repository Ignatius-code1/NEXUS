import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface ErrorTextProps {
  message?: string;
}

export const ErrorText: React.FC<ErrorTextProps> = ({ message }) => {
  if (!message) return null;

  return <Text style={styles.errorText}>{message}</Text>;
};

const styles = StyleSheet.create({
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    marginTop: 4,
  },
});