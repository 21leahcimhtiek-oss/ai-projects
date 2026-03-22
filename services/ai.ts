import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../constants/config';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });

export const aiLifeCoach = {
  async chat(messages: { role: 'user' | 'assistant'; content: string }[], context: string) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: `You are an elite AI life coach and productivity expert. You help users design their ideal life, build powerful habits, achieve ambitious goals, and maximize their potential. Context: ${context}. Be motivating, practical, and specific. Use frameworks like OKRs, time-blocking, habit stacking, and the Eisenhower matrix.` },
        ...messages,
      ],
      temperature: 0.7, max_tokens: 800,
    });
    return response.choices[0].message.content || '';
  },

  async generateDailyPlan(tasks: string[], goals: string[], energy: string) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: `Create an optimized daily schedule. Tasks: ${tasks.join(', ')}. Goals: ${goals.join(', ')}. Energy level: ${energy}. Use time-blocking and prioritize high-impact tasks. Return a structured plan with time slots.` }],
      temperature: 0.6, max_tokens: 800,
    });
    return response.choices[0].message.content || '';
  },

  async analyzeJournal(entry: string) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: `Analyze this journal entry and provide: 1) Key themes, 2) Emotional patterns, 3) Action items, 4) Encouraging insight. Entry: "${entry}"` }],
      temperature: 0.6, max_tokens: 600,
    });
    return response.choices[0].message.content || '';
  },

  async generateHabits(goals: string[], currentHabits: string[]) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: `Suggest 5 powerful daily habits based on these goals: ${goals.join(', ')}. Current habits: ${currentHabits.join(', ')}. Focus on habit stacking and implementation intentions.` }],
      temperature: 0.7, max_tokens: 600,
    });
    return response.choices[0].message.content || '';
  },

  async generateWeeklyReview(completedTasks: number, habits: string[], goals: string[]) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: `Generate a weekly review. Completed tasks: ${completedTasks}. Active habits: ${habits.join(', ')}. Current goals: ${goals.join(', ')}. Provide wins, lessons, and next week's focus areas.` }],
      temperature: 0.6, max_tokens: 800,
    });
    return response.choices[0].message.content || '';
  },

  async generateLifeScore(areas: { name: string; score: number }[]) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: `Based on these life area scores: ${areas.map(a => `${a.name}: ${a.score}/10`).join(', ')}. Provide: 1) Overall assessment, 2) Biggest leverage point, 3) 30-day action plan to improve balance.` }],
      temperature: 0.6, max_tokens: 600,
    });
    return response.choices[0].message.content || '';
  },
};