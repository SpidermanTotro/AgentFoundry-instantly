import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GitHubScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GitHub 2.0 Mobile</Text>
      <Text style={styles.subtitle}>Repositories • Issues • Pull Requests</Text>
      <Text style={styles.description}>
        This screen will connect directly to the GitHub 2.0 backend so you can review
        repositories, triage issues, and merge pull requests on the go. Expect a full Kanban
        board, commit diff viewer, and AI assistant to help with reviews directly from your
        phone.
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
    color: '#38BDF8',
  },
  description: {
    color: '#94A3B8',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default GitHubScreen;
