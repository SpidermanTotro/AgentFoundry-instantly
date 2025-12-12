import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addMessage, setPending } from '../store/slices/chatSlice';

const ChatScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { messages, pending } = useAppSelector((state) => state.chat);
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    dispatch(addMessage({ role: 'user', content: trimmed }));
    setInput('');

    dispatch(setPending(true));
    // Simulate assistant response (placeholder)
    setTimeout(() => {
      dispatch(
        addMessage({
          role: 'assistant',
          content: `Echo: ${trimmed}\n\n(This will connect to the real AI backend soon!)`,
        })
      );
      dispatch(setPending(false));
    }, 600);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.title}>ChatGPT 2.0 Mobile</Text>
        <Text style={styles.subtitle}>Unrestricted • Multi-engine • Offline Ready</Text>
      </View>

      <FlatList
        style={styles.messages}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.role === 'user' ? styles.userBubble : styles.assistantBubble,
            ]}
          >
            <Text style={styles.messageRole}>{item.role === 'user' ? 'You' : 'AI Assistant'}</Text>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask me anything..."
          placeholderTextColor="#94A3B8"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, pending && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={pending}
        >
          <Text style={styles.sendButtonText}>{pending ? '...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  subtitle: {
    marginTop: 4,
    color: '#94A3B8',
    fontSize: 14,
  },
  messages: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageBubble: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
    maxWidth: '90%',
  },
  userBubble: {
    backgroundColor: '#312e81',
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    backgroundColor: '#1e293b',
    alignSelf: 'flex-start',
  },
  messageRole: {
    color: '#C7D2FE',
    fontWeight: '600',
    marginBottom: 4,
    fontSize: 12,
  },
  messageText: {
    color: '#E2E8F0',
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#0f172aee',
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    gap: 12,
  },
  input: {
    minHeight: 48,
    maxHeight: 120,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#312e81',
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#F8FAFC',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ChatScreen;
