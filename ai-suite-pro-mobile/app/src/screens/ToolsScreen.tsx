import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ToolsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Tools Suite</Text>
      <Text style={styles.subtitle}>Reverse Engineering • Binary Analysis • Media Tools</Text>
      <Text style={styles.description}>
        The Tools tab will provide quick access to the Forge Spark reverse engineering
        suite, binary analysis helpers, AI media tools, and teardown utilities. Soon you will
        be able to trigger extractors, review analysis output, and download generated files
        directly from your mobile device.
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
    color: '#FACC15',
  },
  description: {
    color: '#94A3B8',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default ToolsScreen;
