import { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/config';
import { aiFinanceService } from '../../services/ai';
import { useAppStore } from '../../store';

const QUICK_PROMPTS = [
  '📊 Analyze my budget & savings rate',
  '📈 Best investment strategy for beginners',
  '💳 How to pay off debt fast',
  '🏠 Should I buy or rent a home?',
  '💰 How to build a $1M portfolio',
  '🧾 Tax strategies to save money',
  '📱 Best side hustles for extra income',
  '🔒 How much emergency fund do I need?',
];

export default function FinancialChatScreen() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { profile, chatHistory, addChatMessage, clearChat } = useAppStore();

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now().toString(), role: 'user', content: text.trim(), timestamp: new Date() };
    addChatMessage(userMsg);
    setInput('');
    setIsTyping(true);
    try {
      const messages = [...chatHistory, userMsg].map(({ role, content }) => ({ role, content }));
      const response = await aiFinanceService.chat(messages, profile);
      addChatMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() });
    } catch {
      addChatMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: 'Error. Please try again.', timestamp: new Date() });
    } finally {
      setIsTyping(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [chatHistory, profile, addChatMessage]);

  const renderMessage = ({ item }: { item: any }) => (
    <View style={[styles.msgContainer, item.role === 'user' ? styles.userMsg : styles.aiMsg]}>
      {item.role === 'assistant' && (
        <View style={styles.aiAvatar}><Ionicons name="cash" size={16} color={COLORS.primary} /></View>
      )}
      <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.bubbleText, item.role === 'user' ? styles.userText : styles.aiText]}>{item.content}</Text>
        <Text style={styles.timeText}>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.onlineDot} />
          <View>
            <Text style={styles.headerTitle}>AI Financial Advisor</Text>
            <Text style={styles.headerSub}>CFP-level AI • Available 24/7</Text>
          </View>
        </View>
        <TouchableOpacity onPress={clearChat}><Ionicons name="refresh" size={22} color={COLORS.textSecondary} /></TouchableOpacity>
      </View>

      {chatHistory.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}><Ionicons name="cash" size={40} color={COLORS.primary} /></View>
          <Text style={styles.emptyTitle}>Your AI Financial Advisor</Text>
          <Text style={styles.emptySub}>Ask me anything about money, investing, taxes, and building wealth</Text>
          <View style={styles.prompts}>
            {QUICK_PROMPTS.map(p => (
              <TouchableOpacity key={p} style={styles.promptChip} onPress={() => sendMessage(p)}>
                <Text style={styles.promptText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <FlatList ref={flatListRef} data={chatHistory} renderItem={renderMessage} keyExtractor={i => i.id}
          contentContainerStyle={styles.msgList} onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })} />
      )}

      {isTyping && (
        <View style={styles.typing}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.typingText}>AI Advisor is analyzing...</Text>
        </View>
      )}

      <View style={styles.inputRow}>
        <TextInput style={styles.input} value={input} onChangeText={setInput}
          placeholder="Ask about money, investing, taxes..." placeholderTextColor={COLORS.textSecondary}
          multiline maxLength={500} />
        <TouchableOpacity style={[styles.sendBtn, !input.trim() && styles.sendBtnOff]}
          onPress={() => sendMessage(input)} disabled={!input.trim() || isTyping}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  onlineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.success },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  headerSub: { fontSize: 11, color: COLORS.textSecondary },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  prompts: { width: '100%' },
  promptChip: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  promptText: { fontSize: 13, color: COLORS.text },
  msgList: { padding: 16 },
  msgContainer: { flexDirection: 'row', marginBottom: 12 },
  userMsg: { justifyContent: 'flex-end' },
  aiMsg: { justifyContent: 'flex-start' },
  aiAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', marginRight: 8, alignSelf: 'flex-end' },
  bubble: { maxWidth: '80%', borderRadius: 16, padding: 12 },
  userBubble: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: COLORS.surface, borderBottomLeftRadius: 4, elevation: 1 },
  bubbleText: { fontSize: 14, lineHeight: 21 },
  userText: { color: '#fff' },
  aiText: { color: COLORS.text },
  timeText: { fontSize: 10, opacity: 0.6, marginTop: 4, alignSelf: 'flex-end' },
  typing: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingHorizontal: 16, gap: 8 },
  typingText: { fontSize: 13, color: COLORS.textSecondary },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border, gap: 8 },
  input: { flex: 1, backgroundColor: COLORS.background, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: COLORS.text, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  sendBtnOff: { backgroundColor: COLORS.textSecondary },
});