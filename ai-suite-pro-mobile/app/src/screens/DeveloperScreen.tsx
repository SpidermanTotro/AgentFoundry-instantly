import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DeveloperScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GenSpark AI Developer</Text>
      <Text style={styles.subtitle}>Live Coding • File Generation • Auto GitHub</Text>
      <Text style={styles.description}>
        The mobile Developer tab will mirror the desktop experience with live streaming
        AI, real-time code previews, and file generation that syncs to your workspace. Stay
        tuned—this view will show running tasks, generated files, and GitHub deployment
        status right from your phone.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 24,
    paddingTop: 80,
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 16,
    color: '#22D3EE',
  },
  description: {
    color: '#94A3B8',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default DeveloperScreen;
