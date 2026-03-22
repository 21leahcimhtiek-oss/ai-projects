import { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/config';
import { aiService, ChatMessage } from '../../services/ai';
import { useAppStore } from '../../store';

const QUICK_PROMPTS = [
  '💪 Create a workout plan for me',
  '🥗 Give me a healthy meal plan',
  '😴 How can I improve my sleep?',
  '🧘 Help me manage stress',
  '⚖️ How do I lose weight safely?',
  '💊 What supplements should I take?',
];

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { user, chatHistory, addChatMessage, clearChat } = useAppStore();

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const userMessage: ChatMessage & { id: string; timestamp: Date } = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };
    addChatMessage(userMessage);
    setInput('');
    setIsTyping(true);

    try {
      const messages = [...chatHistory, userMessage].map(({ role, content }) => ({ role, content }));
      const response = await aiService.chat(messages, user ? {
        age: user.age, weight: user.weight, height: user.height,
        goals: user.goals, conditions: user.conditions, activityLevel: user.activityLevel,
      } : undefined);

      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      });
    } catch (error) {
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      });
    } finally {
      setIsTyping(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [chatHistory, user, addChatMessage]);

  const renderMessage = ({ item }: { item: any }) => (
    <View style={[styles.messageContainer, item.role === 'user' ? styles.userMessage : styles.assistantMessage]}>
      {item.role === 'assistant' && (
        <View style={styles.avatarContainer}>
          <Ionicons name="sparkles" size={16} color={COLORS.primary} />
        </View>
      )}
      <View style={[styles.messageBubble, item.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.messageText, item.role === 'user' ? styles.userText : styles.assistantText]}>
          {item.content}
        </Text>
        <Text style={styles.messageTime}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <View style={styles.onlineIndicator} />
          <View>
            <Text style={styles.headerTitle}>AI Health Coach</Text>
            <Text style={styles.headerSubtitle}>Always available · Powered by GPT-4</Text>
          </View>
        </View>
        <TouchableOpacity onPress={clearChat}>
          <Ionicons name="refresh" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      {chatHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="sparkles" size={48} color={COLORS.primary} />
          <Text style={styles.emptyTitle}>Your AI Health Coach</Text>
          <Text style={styles.emptySubtitle}>Ask me anything about your health, fitness, nutrition, or wellness goals</Text>
          <View style={styles.quickPrompts}>
            {QUICK_PROMPTS.map((prompt) => (
              <TouchableOpacity key={prompt} style={styles.quickPrompt} onPress={() => sendMessage(prompt)}>
                <Text style={styles.quickPromptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={chatHistory}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      {/* Typing indicator */}
      {isTyping && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.typingText}>AI Coach is thinking...</Text>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask your AI health coach..."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerInfo: { flexDirection: 'row', alignItems: 'center' },
  onlineIndicator: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.success, marginRight: 10 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  headerSubtitle: { fontSize: 12, color: COLORS.textSecondary },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  quickPrompts: { width: '100%', marginTop: 24 },
  quickPrompt: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  quickPromptText: { fontSize: 14, color: COLORS.text },
  messagesList: { padding: 16 },
  messageContainer: { flexDirection: 'row', marginBottom: 12 },
  userMessage: { justifyContent: 'flex-end' },
  assistantMessage: { justifyContent: 'flex-start' },
  avatarContainer: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', marginRight: 8, alignSelf: 'flex-end' },
  messageBubble: { maxWidth: '80%', borderRadius: 16, padding: 12 },
  userBubble: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  assistantBubble: { backgroundColor: COLORS.surface, borderBottomLeftRadius: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  messageText: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#fff' },
  assistantText: { color: COLORS.text },
  messageTime: { fontSize: 10, marginTop: 4, opacity: 0.6, alignSelf: 'flex-end' },
  typingIndicator: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingHorizontal: 16 },
  typingText: { marginLeft: 8, fontSize: 13, color: COLORS.textSecondary },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border },
  input: { flex: 1, backgroundColor: COLORS.background, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, color: COLORS.text, maxHeight: 100, marginRight: 8 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { backgroundColor: COLORS.textSecondary },
});