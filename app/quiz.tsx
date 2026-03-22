import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SUBJECTS } from '../constants/config';
import { useAppStore } from '../store';
import { aiTutorService } from '../services/ai';

interface QuizQuestion { question: string; options: string[]; answer: string; explanation: string; }

export default function QuizScreen() {
  const router = useRouter();
  const { currentSubject, totalPoints } = useAppStore();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [answered, setAnswered] = useState(false);

  const subject = SUBJECTS.find(s => s.id === currentSubject) || SUBJECTS[0];

  useEffect(() => {
    generateQuiz();
  }, []);

  const generateQuiz = async () => {
    setLoading(true);
    try {
      const qs = await aiTutorService.generateQuiz(subject.name, subject.name + ' fundamentals', 5);
      if (qs.length > 0) setQuestions(qs);
      else setQuestions(sampleQuestions);
    } catch { setQuestions(sampleQuestions); }
    setLoading(false);
  };

  const sampleQuestions: QuizQuestion[] = [
    { question: `What is a fundamental concept in ${subject.name}?`, options: ['A) Option A', 'B) Option B', 'C) Option C', 'D) Option D'], answer: 'A', explanation: 'This is the correct answer because it demonstrates the core principle.' },
  ];

  const handleAnswer = (option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    if (option.startsWith(questions[current]?.answer)) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) setFinished(true);
    else { setCurrent(c => c + 1); setSelected(null); setAnswered(false); }
  };

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>🤖 Generating AI Quiz...</Text>
    </View>
  );

  if (finished) return (
    <ScrollView style={styles.container} contentContainerStyle={styles.centered}>
      <Text style={styles.resultEmoji}>{score >= questions.length * 0.8 ? '🏆' : score >= questions.length * 0.6 ? '🎯' : '📚'}</Text>
      <Text style={styles.resultTitle}>{score >= questions.length * 0.8 ? 'Excellent!' : score >= questions.length * 0.6 ? 'Good Job!' : 'Keep Studying!'}</Text>
      <Text style={styles.resultScore}>{score}/{questions.length} Correct</Text>
      <Text style={styles.resultPercent}>{Math.round((score / questions.length) * 100)}%</Text>
      <Text style={styles.pointsEarned}>+{score * 10} points earned! ⭐</Text>
      <View style={styles.resultActions}>
        <TouchableOpacity style={styles.retryButton} onPress={() => { setCurrent(0); setScore(0); setSelected(null); setAnswered(false); setFinished(false); generateQuiz(); }}>
          <Ionicons name="refresh" size={18} color={COLORS.white} />
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.doneButton} onPress={() => router.back()}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const q = questions[current];
  if (!q) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{subject.icon} {subject.name} Quiz</Text>
        <Text style={styles.headerScore}>⭐ {score * 10}</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((current + 1) / questions.length) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>Question {current + 1} of {questions.length}</Text>

      <ScrollView style={styles.content}>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{q.question}</Text>
        </View>

        <View style={styles.options}>
          {q.options.map((opt, i) => {
            const isSelected = selected === opt;
            const isCorrect = opt.startsWith(q.answer);
            let style = styles.option;
            if (answered && isCorrect) style = { ...styles.option, ...styles.optionCorrect } as any;
            else if (answered && isSelected && !isCorrect) style = { ...styles.option, ...styles.optionWrong } as any;
            else if (isSelected) style = { ...styles.option, ...styles.optionSelected } as any;

            return (
              <TouchableOpacity key={i} style={style} onPress={() => handleAnswer(opt)} disabled={answered}>
                <Text style={styles.optionText}>{opt}</Text>
                {answered && isCorrect && <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />}
                {answered && isSelected && !isCorrect && <Ionicons name="close-circle" size={20} color={COLORS.error} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {answered && (
          <View style={styles.explanationCard}>
            <Text style={styles.explanationTitle}>💡 Explanation</Text>
            <Text style={styles.explanationText}>{q.explanation}</Text>
          </View>
        )}
      </ScrollView>

      {answered && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>{current + 1 >= questions.length ? 'See Results' : 'Next Question'}</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 16, fontSize: 16, color: COLORS.textSecondary },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 50, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  headerScore: { fontSize: 14, color: COLORS.gold, fontWeight: '700' },
  progressBar: { height: 6, backgroundColor: COLORS.border, margin: 16, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  progressText: { textAlign: 'center', fontSize: 13, color: COLORS.textSecondary, marginBottom: 16 },
  content: { flex: 1, padding: 16 },
  questionCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  questionText: { fontSize: 17, color: COLORS.text, lineHeight: 26, fontWeight: '500' },
  options: { gap: 10 },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, borderWidth: 2, borderColor: COLORS.border },
  optionSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '15' },
  optionCorrect: { borderColor: COLORS.success, backgroundColor: COLORS.success + '15' },
  optionWrong: { borderColor: COLORS.error, backgroundColor: COLORS.error + '15' },
  optionText: { fontSize: 15, color: COLORS.text, flex: 1 },
  explanationCard: { marginTop: 16, backgroundColor: COLORS.primary + '15', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.primary + '40' },
  explanationTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, marginBottom: 6 },
  explanationText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  nextButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, margin: 16, borderRadius: 14, padding: 16, gap: 8 },
  nextText: { fontSize: 16, fontWeight: 'bold', color: COLORS.white },
  resultEmoji: { fontSize: 72, marginBottom: 16 },
  resultTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  resultScore: { fontSize: 18, color: COLORS.textSecondary, marginBottom: 4 },
  resultPercent: { fontSize: 48, fontWeight: 'bold', color: COLORS.primary, marginBottom: 8 },
  pointsEarned: { fontSize: 16, color: COLORS.gold, fontWeight: '600', marginBottom: 32 },
  resultActions: { flexDirection: 'row', gap: 12, width: '100%' },
  retryButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, borderRadius: 14, padding: 16, gap: 8 },
  retryText: { color: COLORS.white, fontWeight: 'bold', fontSize: 15 },
  doneButton: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  doneText: { color: COLORS.text, fontWeight: 'bold', fontSize: 15 },
});