import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store';
import { COLORS, SUBJECTS } from '../../constants/config';
import { aiTutorService } from '../../services/ai';

export default function ChatScreen() {
  const { chatHistory, addMessage, currentSubject, setCurrentSubject, subscription } = useAppStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const subject = SUBJECTS.find(s => s.id === currentSubject) || SUBJECTS[0];

  const quickPrompts = [
    `Explain the basics of ${subject.name}`,
    `Give me a practice problem`,
    `What are common mistakes in ${subject.name}?`,
    `Create a study plan for me`,
    `Quiz me on this topic`,
    `Help me understand this concept`,
  ];

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg = { id: Date.now().toString(), role: 'user' as const, content: text.trim(), timestamp: new Date() };
    addMessage(userMsg);
    setInput('');
    setLoading(true);
    scrollRef.current?.scrollToEnd({ animated: true });

    try {
      const history = [...chatHistory, userMsg].map(m => ({ role: m.role, content: m.content }));
      const reply = await aiTutorService.chat(history, subject.name);
      addMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: reply, timestamp: new Date() });
    } catch {
      addMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: "I'm having trouble connecting. Please try again!", timestamp: new Date() });
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.subjectIcon}>{subject.icon}</Text>
          <View>
            <Text style={styles.headerTitle}>AI Tutor</Text>
            <Text style={styles.headerSubject}>{subject.name}</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectPicker}>
          {SUBJECTS.slice(0, 6).map(s => (
            <TouchableOpacity
              key={s.id}
              style={[styles.subjectChip, currentSubject === s.id && { backgroundColor: s.color + '30', borderColor: s.color }]}
              onPress={() => setCurrentSubject(s.id)}
            >
              <Text style={styles.subjectChipText}>{s.icon}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Messages */}
      <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.messagesContent} showsVerticalScrollIndicator={false}>
        {chatHistory.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>{subject.icon}</Text>
            <Text style={styles.emptyTitle}>Your {subject.name} Tutor</Text>
            <Text style={styles.emptySubtitle}>Ask me anything about {subject.name}. I can explain concepts, solve problems, create quizzes, and more!</Text>
            <View style={styles.quickPrompts}>
              {quickPrompts.map((p, i) => (
                <TouchableOpacity key={i} style={styles.promptChip} onPress={() => sendMessage(p)}>
                  <Text style={styles.promptText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {chatHistory.map((msg) => (
          <View key={msg.id} style={[styles.messageBubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
            {msg.role === 'assistant' && (
              <View style={styles.aiAvatar}>
                <Text style={styles.aiAvatarText}>{subject.icon}</Text>
              </View>
            )}
            <View style={[styles.bubbleContent, msg.role === 'user' ? styles.userBubbleContent : styles.aiBubbleContent]}>
              <Text style={[styles.messageText, msg.role === 'user' && styles.userMessageText]}>{msg.content}</Text>
            </View>
          </View>
        ))}

        {loading && (
          <View style={[styles.messageBubble, styles.aiBubble]}>
            <View style={styles.aiAvatar}><Text style={styles.aiAvatarText}>{subject.icon}</Text></View>
            <View style={styles.typingBubble}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.typingText}>Thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={`Ask about ${subject.name}...`}
          placeholderTextColor={COLORS.textSecondary}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim() || loading}
        >
          <Ionicons name="send" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 50, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 12 },
  subjectIcon: { fontSize: 28 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  headerSubject: { fontSize: 12, color: COLORS.primary },
  subjectPicker: { flex: 1 },
  subjectChip: { padding: 8, borderRadius: 10, marginRight: 6, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surfaceLight },
  subjectChipText: { fontSize: 18 },
  messages: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 8 },
  emptyState: { alignItems: 'center', paddingVertical: 32 },
  emptyIcon: { fontSize: 64, marginBottom: 12 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  quickPrompts: { gap: 8, width: '100%' },
  promptChip: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  promptText: { fontSize: 14, color: COLORS.text },
  messageBubble: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  userBubble: { justifyContent: 'flex-end' },
  aiBubble: { justifyContent: 'flex-start' },
  aiAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary + '30', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  aiAvatarText: { fontSize: 16 },
  bubbleContent: { maxWidth: '80%', borderRadius: 16, padding: 12 },
  userBubbleContent: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  aiBubbleContent: { backgroundColor: COLORS.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: COLORS.border },
  messageText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  userMessageText: { color: COLORS.white },
  typingBubble: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.surface, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: COLORS.border },
  typingText: { fontSize: 13, color: COLORS.textSecondary },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border, gap: 8 },
  input: { flex: 1, backgroundColor: COLORS.background, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: COLORS.text, fontSize: 14, maxHeight: 100, borderWidth: 1, borderColor: COLORS.border },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  sendButtonDisabled: { backgroundColor: COLORS.border },
});