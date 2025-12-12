import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const GenSparkScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>GenSpark 2.0</Text>
        <Text style={styles.subtitle}>100% Offline AI • 5 GGUF Models</Text>
        <Text style={styles.description}>
          This tab will let you run AI models locally on your device. You will be able to
          download GGUF models, run them offline, and switch between them on the fly. The
          interface will mirror the desktop experience with model cards, sliders, and local
          file generation.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Coming Soon</Text>
        <Text style={styles.listItem}>• Model gallery with 5 pre-configured GGUF models</Text>
        <Text style={styles.listItem}>• Offline inference with background generation</Text>
        <Text style={styles.listItem}>• GIF generator, image upscaler, audio tools</Text>
        <Text style={styles.listItem}>• Workspace integration with local files</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    gap: 16,
    backgroundColor: '#020617',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#A5B4FC',
    marginBottom: 16,
  },
  description: {
    color: '#CBD5F5',
    fontSize: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E0E7FF',
    marginBottom: 12,
  },
  listItem: {
    color: '#94A3B8',
    fontSize: 15,
    marginBottom: 8,
  },
});

export default GenSparkScreen;
