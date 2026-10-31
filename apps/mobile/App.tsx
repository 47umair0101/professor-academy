import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { brandColors } from '@professor-academy/shared';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Professor Academy Mobile</Text>
      <Text style={styles.subtitle}>Scheduled for Module 9: React Native (Expo) Experience</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandColors.canvas.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: brandColors.navy.DEFAULT,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: brandColors.text.slate,
  },
});
