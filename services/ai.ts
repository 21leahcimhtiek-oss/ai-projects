import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../constants/config';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });

export const aiTutorService = {
  async chat(messages: { role: 'user' | 'assistant'; content: string }[], subject: string) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert AI tutor specializing in ${subject}. You explain concepts clearly, use examples, break down complex problems step-by-step, and adapt to the student's level. Be encouraging, patient, and educational. Use emojis occasionally to make learning fun.`,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    return response.choices[0].message.content || '';
  },

  async explainConcept(concept: string, subject: string, level: string) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: `Explain "${concept}" in ${subject} for a ${level} student. Include: 1) Simple definition, 2) Real-world example, 3) Key points to remember, 4) Common mistakes to avoid.`,
      }],
      temperature: 0.7,
      max_tokens: 800,
    });
    return response.choices[0].message.content || '';
  },

  async generateQuiz(subject: string, topic: string, numQuestions: number = 5) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: `Generate a ${numQuestions}-question multiple choice quiz on "${topic}" in ${subject}. Return JSON array: [{"question": "...", "options": ["A)...", "B)...", "C)...", "D)..."], "answer": "A", "explanation": "..."}]`,
      }],
      temperature: 0.5,
      max_tokens: 1500,
    });
    try {
      const text = response.choices[0].message.content || '[]';
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch { return []; }
  },

  async generateFlashCards(subject: string, topic: string, count: number = 10) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: `Create ${count} flashcards for "${topic}" in ${subject}. Return JSON: [{"front": "question/term", "back": "answer/definition"}]`,
      }],
      temperature: 0.6,
      max_tokens: 1200,
    });
    try {
      const text = response.choices[0].message.content || '[]';
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch { return []; }
  },

  async gradeEssay(essay: string, prompt: string, rubric: string) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: `Grade this essay and provide detailed feedback.\nPrompt: ${prompt}\nRubric: ${rubric}\nEssay: ${essay}\n\nProvide: 1) Overall grade (A-F), 2) Score out of 100, 3) Strengths, 4) Areas for improvement, 5) Specific suggestions.`,
      }],
      temperature: 0.4,
      max_tokens: 1000,
    });
    return response.choices[0].message.content || '';
  },

  async createStudyPlan(subject: string, goal: string, timeAvailable: string, weakAreas: string[]) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: `Create a personalized study plan for ${subject}. Goal: ${goal}. Time available: ${timeAvailable}. Weak areas: ${weakAreas.join(', ')}. Include daily schedule, resources, and milestones.`,
      }],
      temperature: 0.6,
      max_tokens: 1000,
    });
    return response.choices[0].message.content || '';
  },

  async solveProblem(problem: string, subject: string, showSteps: boolean = true) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: `${showSteps ? 'Solve step-by-step' : 'Solve'}: ${problem} (Subject: ${subject})${showSteps ? '. Show all work clearly.' : ''}`,
      }],
      temperature: 0.3,
      max_tokens: 800,
    });
    return response.choices[0].message.content || '';
  },
};