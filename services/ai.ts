import { CONFIG } from '../constants/config';

export interface HealthProfile {
  age: number;
  weight: number;
  height: number;
  goals: string[];
  conditions: string[];
  activityLevel: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_PROMPT = `You are an expert AI Health Coach with deep knowledge in:
- Nutrition and meal planning
- Exercise science and workout programming
- Sleep optimization
- Mental wellness and stress management
- Chronic disease prevention
- Biometric analysis

You provide personalized, evidence-based health advice. You are empathetic, motivating, and always recommend consulting a doctor for medical decisions.
Keep responses concise, actionable and encouraging. Use emojis sparingly for warmth.`;

export const aiService = {
  async chat(messages: ChatMessage[], userProfile?: HealthProfile): Promise<string> {
    try {
      const systemMessage = userProfile
        ? `${SYSTEM_PROMPT}\n\nUser Profile: Age: ${userProfile.age}, Weight: ${userProfile.weight}kg, Height: ${userProfile.height}cm, Goals: ${userProfile.goals.join(', ')}, Activity Level: ${userProfile.activityLevel}`
        : SYSTEM_PROMPT;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CONFIG.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: CONFIG.OPENAI_MODEL,
          messages: [{ role: 'system', content: systemMessage }, ...messages],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, I could not generate a response.';
    } catch (error) {
      console.error('AI Service Error:', error);
      return 'Connection error. Please check your internet and try again.';
    }
  },

  async generateMealPlan(profile: HealthProfile, days: number = 7): Promise<string> {
    const prompt = `Create a detailed ${days}-day meal plan for:
- Age: ${profile.age}, Weight: ${profile.weight}kg, Height: ${profile.height}cm
- Goals: ${profile.goals.join(', ')}
- Activity Level: ${profile.activityLevel}
- Health Conditions: ${profile.conditions.join(', ') || 'None'}

Include breakfast, lunch, dinner, and 2 snacks per day with calories and macros.`;

    return this.chat([{ role: 'user', content: prompt }], profile);
  },

  async generateWorkoutPlan(profile: HealthProfile, weeks: number = 4): Promise<string> {
    const prompt = `Create a ${weeks}-week progressive workout plan for:
- Fitness Level: ${profile.activityLevel}
- Goals: ${profile.goals.join(', ')}
- Age: ${profile.age}

Include sets, reps, rest periods, and progression strategy.`;

    return this.chat([{ role: 'user', content: prompt }], profile);
  },

  async analyzeHealthMetrics(metrics: Record<string, number>): Promise<string> {
    const prompt = `Analyze these health metrics and provide insights:
${Object.entries(metrics).map(([k, v]) => `${k}: ${v}`).join('\n')}

Provide: 1) What's good, 2) What needs attention, 3) Specific action steps.`;

    return this.chat([{ role: 'user', content: prompt }]);
  },

  async getSleepAdvice(sleepData: { hours: number; quality: number; issues: string[] }): Promise<string> {
    const prompt = `Provide personalized sleep optimization advice for:
- Average sleep: ${sleepData.hours} hours
- Sleep quality: ${sleepData.quality}/10
- Issues: ${sleepData.issues.join(', ')}

Give specific, actionable sleep hygiene tips.`;

    return this.chat([{ role: 'user', content: prompt }]);
  },
};