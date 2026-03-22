import { CONFIG } from '../constants/config';

const SYSTEM_PROMPT = `You are an expert AI Financial Advisor with deep knowledge in:
- Personal finance and budgeting
- Investment strategies (stocks, ETFs, crypto, real estate)
- Tax optimization and planning
- Debt management and elimination
- Retirement planning (401k, IRA, Roth)
- Insurance and risk management
- Business financial planning
- Wealth building strategies

You provide personalized, actionable financial advice. Always remind users that this is educational and they should consult a licensed financial advisor for major decisions.
Be direct, specific, and numbers-focused. Format responses clearly with bullet points when listing strategies.`;

export const aiFinanceService = {
  async chat(messages: any[], userProfile?: any): Promise<string> {
    try {
      const systemContent = userProfile
        ? `${SYSTEM_PROMPT}\n\nUser Financial Profile: Income: $${userProfile.income}/mo, Savings: $${userProfile.savings}, Debt: $${userProfile.debt}, Goals: ${userProfile.goals?.join(', ')}`
        : SYSTEM_PROMPT;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${CONFIG.OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: CONFIG.OPENAI_MODEL,
          messages: [{ role: 'system', content: systemContent }, ...messages],
          max_tokens: 600,
          temperature: 0.5,
        }),
      });
      const data = await response.json();
      return data.choices[0]?.message?.content || 'Unable to generate response.';
    } catch (error) {
      return 'Connection error. Please try again.';
    }
  },

  async analyzeBudget(income: number, expenses: Record<string, number>): Promise<string> {
    const total = Object.values(expenses).reduce((a, b) => a + b, 0);
    const prompt = `Analyze this monthly budget and provide optimization advice:
Income: $${income}
Expenses: ${Object.entries(expenses).map(([k, v]) => `${k}: $${v}`).join(', ')}
Total expenses: $${total}
Savings rate: ${((income - total) / income * 100).toFixed(1)}%

Provide: 1) Budget health assessment, 2) Top 3 areas to cut, 3) Specific savings targets`;
    return this.chat([{ role: 'user', content: prompt }]);
  },

  async analyzeInvestments(portfolio: Record<string, number>): Promise<string> {
    const prompt = `Analyze this investment portfolio:
${Object.entries(portfolio).map(([asset, pct]) => `${asset}: ${pct}%`).join('\n')}

Provide: 1) Diversification assessment, 2) Risk level, 3) Rebalancing recommendations, 4) Missing asset classes`;
    return this.chat([{ role: 'user', content: prompt }]);
  },

  async getDebtPayoffPlan(debts: Array<{ name: string; balance: number; rate: number; minPayment: number }>, extraMonthly: number): Promise<string> {
    const prompt = `Create an optimized debt payoff plan:
Debts: ${debts.map(d => `${d.name}: $${d.balance} @ ${d.rate}% APR, min $${d.minPayment}/mo`).join('\n')}
Extra monthly budget for debt: $${extraMonthly}

Show: 1) Avalanche vs Snowball comparison, 2) Recommended strategy, 3) Month-by-month payoff timeline, 4) Total interest saved`;
    return this.chat([{ role: 'user', content: prompt }]);
  },

  async getRetirementPlan(age: number, currentSavings: number, monthlyContribution: number, targetAge: number): Promise<string> {
    const prompt = `Create a retirement plan:
Current age: ${age}, Retirement age: ${targetAge}
Current savings: $${currentSavings}
Monthly contribution: $${monthlyContribution}

Calculate: 1) Projected retirement savings (7% avg return), 2) Gap analysis, 3) Recommended adjustments, 4) Account allocation (401k/IRA/Roth/taxable)`;
    return this.chat([{ role: 'user', content: prompt }]);
  },

  async getTaxStrategies(income: number, filingStatus: string): Promise<string> {
    const prompt = `Provide tax optimization strategies for:
Annual income: $${income}
Filing status: ${filingStatus}

List top 10 legal tax reduction strategies with estimated savings for each.`;
    return this.chat([{ role: 'user', content: prompt }]);
  },
};