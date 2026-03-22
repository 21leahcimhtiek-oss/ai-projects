import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/config';

const PRESETS = [
  { label: 'Pomodoro', minutes: 25, icon: '🍅' },
  { label: 'Deep Work', minutes: 90, icon: '🧠' },
  { label: 'Quick Focus', minutes: 15, icon: ⚡' },
  { label: 'Custom', minutes: 45, icon: '⚙️' },
];

export default function FocusScreen() {
  const router = useRouter();
  const [preset, setPreset] = useState(PRESETS[0]);
  const [seconds, setSeconds] = useState(PRESETS[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setCompleted(c => c + 1);
            Alert.alert('🎉 Focus Session Complete!', `Great work! You completed a ${preset.label} session.`, [{ text: 'Start Another', onPress: () => reset() }, { text: 'Done', onPress: () => router.back() }]);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  const reset = () => { setRunning(false); setSeconds(preset.minutes * 60); };
  const selectPreset = (p: typeof PRESETS[0]) => { setPreset(p); setSeconds(p.minutes * 60); setRunning(false); };

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const totalSeconds = preset.minutes * 60;
  const progress = 1 - seconds / totalSeconds;
  const circumference = 2 * Math.PI * 120;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Focus Timer</Text>
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>🍅 x{completed}</Text>
        </View>
      </View>

      {/* Presets */}
      <View style={styles.presets}>
        {PRESETS.map((p, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.presetBtn, preset.label === p.label && styles.presetBtnActive]}
            onPress={() => selectPreset(p)}
          >
            <Text style={styles.presetIcon}>{p.icon}</Text>
            <Text style={[styles.presetLabel, preset.label === p.label && styles.presetLabelActive]}>{p.label}</Text>
            <Text style={[styles.presetMin, preset.label === p.label && styles.presetMinActive]}>{p.minutes}m</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timer Circle */}
      <View style={styles.timerContainer}>
        <View style={styles.timerCircleOuter}>
          <View style={[styles.timerCircleInner, running && { borderColor: COLORS.primary }]}>
            <Text style={styles.timerEmoji}>{preset.icon}</Text>
            <Text style={styles.timerText}>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</Text>
            <Text style={styles.timerLabel}>{preset.label}</Text>
          </View>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.resetBtn} onPress={reset}>
          <Ionicons name="refresh" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.playBtn, running && styles.pauseBtn]} onPress={() => setRunning(!running)}>
          <Ionicons name={running ? 'pause' : 'play'} size={32} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipBtn} onPress={() => { setCompleted(c => c + 1); reset(); }}>
          <Ionicons name="play-skip-forward" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Tips */}
      <View style={styles.tip}>
        <Text style={styles.tipIcon}>💡</Text>
        <Text style={styles.tipText}>Put your phone face down and eliminate distractions. You've got this!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 50 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  completedBadge: { backgroundColor: COLORS.surface, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  completedText: { fontSize: 14, color: COLORS.text, fontWeight: '600' },
  presets: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 32 },
  presetBtn: { flex: 1, alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, padding: 10, borderWidth: 1, borderColor: COLORS.border },
  presetBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '20' },
  presetIcon: { fontSize: 18, marginBottom: 2 },
  presetLabel: { fontSize: 10, color: COLORS.textSecondary, fontWeight: '600' },
  presetLabelActive: { color: COLORS.primary },
  presetMin: { fontSize: 12, color: COLORS.textSecondary },
  presetMinActive: { color: COLORS.primary, fontWeight: '700' },
  timerContainer: { alignItems: 'center', marginBottom: 40 },
  timerCircleOuter: { width: 260, height: 260, borderRadius: 130, borderWidth: 3, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  timerCircleInner: { width: 230, height: 230, borderRadius: 115, borderWidth: 6, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.surface },
  timerEmoji: { fontSize: 36, marginBottom: 8 },
  timerText: { fontSize: 52, fontWeight: 'bold', color: COLORS.text, fontVariant: ['tabular-nums'] },
  timerLabel: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 40 },
  resetBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  playBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
  pauseBtn: { backgroundColor: COLORS.secondary },
  skipBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  tip: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 24, backgroundColor: COLORS.surface, borderRadius: 14, padding: 14, gap: 10, borderWidth: 1, borderColor: COLORS.border },
  tipIcon: { fontSize: 20 },
  tipText: { fontSize: 13, color: COLORS.textSecondary, flex: 1, lineHeight: 18 },
});