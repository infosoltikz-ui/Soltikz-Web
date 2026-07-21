import { AIProvider } from '@prisma/client';

export class CostCalculator {
  /**
   * Simple cost calculation based on estimated values.
   * In a real enterprise app, you would fetch these rates from a DB or config.
   */
  public static calculate(provider: AIProvider, model: string, promptTokens: number, completionTokens: number): number {
    let rate = { prompt: 0, completion: 0 };

    switch (provider) {
      case 'OPENAI':
        if (model.includes('gpt-4o-mini')) {
          rate = { prompt: 0.00015, completion: 0.0006 };
        } else {
          rate = { prompt: 0.005, completion: 0.015 };
        }
        break;
      case 'CLAUDE':
        if (model.includes('haiku')) {
          rate = { prompt: 0.00025, completion: 0.00125 };
        } else {
          rate = { prompt: 0.003, completion: 0.015 };
        }
        break;
      case 'GEMINI':
        if (model.includes('flash')) {
          rate = { prompt: 0.000075, completion: 0.0003 };
        } else {
          rate = { prompt: 0.00125, completion: 0.00375 };
        }
        break;
    }

    const cost = (promptTokens / 1000) * rate.prompt + (completionTokens / 1000) * rate.completion;
    return cost;
  }
}
