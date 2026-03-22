import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store';
import { COLORS } from '../../constants/config';
import { aiLifeCoach } from '../../services/ai';

export default function CoachScreen() {
  const { chatHistory, addMessage, tasks, habits, goals, userProfile } = useAppStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const quickPrompts = [
    '🌅 Create my perfect morning routine',
    '📅 Plan my ideal week',
    '🎯 Help me set powerful goals',
    '⚡ Build better habits for success',
    '🧠 Improve my focus and productivity',
    '🔋 How to avoid burnout',
    '💡 Give me a weekly review',
    '🚀 What should I prioritize today?',
  ];

  const context = `User: ${userProfile.name}. Goals: ${goals.map(g => g.title).join(', ')}. Active habits: ${habits.map(h => h.name).join(', ')}.`;

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg = { id: Date.now().toString(), role: 'user' as const, content: text.trim(), timestamp: new Date() };
    addMessage(userMsg);
    setInput('');
    setLoading(true);
    scrollRef.current?.scrollToEnd({ animated: true });
    try {
      const history = [...chatHistory, userMsg].map(m => ({ role: m.role, content: m.content }));
      const reply = await aiLifeCoach.chat(history, context);
      addMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: reply, timestamp: new Date() });
    } catch {
      addMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: "I'm here to help! Please try again.", timestamp: new Date() });
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤖 AI Life Coach</Text>
        <Text style={styles.headerSubtitle}>Powered by GPT-4o</Text>
      </View>

      <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.messagesContent}>
        {chatHistory.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Your Personal Life Coach</Text>
            <Text style={styles.emptySubtitle}>I help you design your ideal life, build powerful habits, and achieve your biggest goals. What shall we work on?</Text>
            <View style={styles.prompts}>
              {quickPrompts.map((p, i) => (
                <TouchableOpacity key={i} style={styles.promptChip} onPress={() => sendMessage(p)}>
                  <Text style={styles.promptText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        {chatHistory.map(msg => (
          <View key={msg.id} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
            {msg.role === 'assistant' && <View style={styles.aiAvatar}><Text>🤖</Text></View>}
            <View style={[styles.bubbleContent, msg.role === 'user' ? styles.userContent : styles.aiContent]}>
              <Text style={[styles.bubbleText, msg.role === 'user' && styles.userText]}>{msg.content}</Text>
            </View>
          </View>
        ))}
        {loading && (
          <View style={[styles.bubble, styles.aiBubble]}>
            <View style={styles.aiAvatar}><Text>🤖</Text></View>
            <View style={[styles.bubbleContent, styles.aiContent, { flexDirection: 'row', alignItems: 'center', gap: 8 }]}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.bubbleText}>Thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput style={styles.input} placeholder="Ask your life coach..." placeholderTextColor={COLORS.textSecondary} value={input} onChangeText={setInput} multiline maxLength={500} />
        <TouchableOpacity style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]} onPress={() => sendMessage(input)} disabled={!input.trim() || loading}>
          <Ionicons name="send" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { alignItems: 'center', padding: 16, paddingTop: 50, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  headerSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  messages: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 8 },
  empty: { alignItems: 'center', paddingVertical: 20 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 8, textAlign: 'center' },
  emptySubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  prompts: { gap: 8, width: '100%' },
  promptChip: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  promptText: { fontSize: 14, color: COLORS.text },
  bubble: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  userBubble: { justifyContent: 'flex-end' },
  aiBubble: { justifyContent: 'flex-start' },
  aiAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary + '30', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  bubbleContent: { maxWidth: '80%', borderRadius: 16, padding: 12 },
  userContent: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  aiContent: { backgroundColor: COLORS.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: COLORS.border },
  bubbleText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  userText: { color: COLORS.white },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border, gap: 8 },
  input: { flex: 1, backgroundColor: COLORS.background, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: COLORS.text, fontSize: 14, maxHeight: 100, borderWidth: 1, borderColor: COLORS.border },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { backgroundColor: COLORS.border },
});