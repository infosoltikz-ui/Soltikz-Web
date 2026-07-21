import { GoogleGenAI } from '@google/genai';
import { AIProvider, GenerateParams, GenerateResponse, StreamParams } from './AIProvider.interface';

export class GeminiProvider implements AIProvider {
  private client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || 'AIza-placeholder',
    });
  }

  async generate(params: GenerateParams): Promise<GenerateResponse> {
    const startTime = Date.now();
    const model = params.model || 'gemini-2.5-flash';

    try {
      const response = await this.client.models.generateContent({
        model,
        contents: params.userPrompt,
        config: {
          systemInstruction: params.systemPrompt,
          temperature: params.temperature ?? 0.7,
          maxOutputTokens: params.maxTokens ?? 1000,
        },
      });

      const latency = Date.now() - startTime;
      const content = response.text || '';
      const promptTokens = response.usageMetadata?.promptTokenCount || this.estimateTokens(params.systemPrompt + params.userPrompt);
      const completionTokens = response.usageMetadata?.candidatesTokenCount || this.estimateTokens(content);
      const totalTokens = response.usageMetadata?.totalTokenCount || (promptTokens + completionTokens);
      const cost = this.estimateCost(model, promptTokens, completionTokens);

      return {
        success: true,
        provider: 'GEMINI',
        model,
        message: 'Generation successful',
        tokens: {
          prompt: promptTokens,
          completion: completionTokens,
          total: totalTokens,
        },
        latency,
        cost,
        response: content,
      };
    } catch (error: any) {
      console.error('[GeminiProvider] Generate error:', error);
      throw new Error(`Gemini generation failed: ${error.message}`);
    }
  }

  async stream(params: StreamParams): Promise<void> {
    const model = params.model || 'gemini-2.5-flash';

    try {
      const stream = await this.client.models.generateContentStream({
        model,
        contents: params.userPrompt,
        config: {
          systemInstruction: params.systemPrompt,
          temperature: params.temperature ?? 0.7,
          maxOutputTokens: params.maxTokens ?? 1000,
        },
      });

      for await (const chunk of stream) {
        if (params.abortSignal?.aborted) break;
        if (chunk.text) {
          params.onChunk(chunk.text);
        }
      }

      if (params.onComplete) {
        params.onComplete();
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('[GeminiProvider] Stream aborted by user');
      } else {
        console.error('[GeminiProvider] Stream error:', error);
        if (params.onError) params.onError(error);
      }
    }
  }

  estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  estimateCost(model: string, promptTokens: number, completionTokens: number): number {
    const pricing: Record<string, { prompt: number; completion: number }> = {
      'gemini-1.5-pro': { prompt: 0.00125, completion: 0.00375 },
      'gemini-2.5-flash': { prompt: 0.000075, completion: 0.0003 },
    };
    const rate = pricing[model] || pricing['gemini-2.5-flash'];
    return (promptTokens / 1000) * rate.prompt + (completionTokens / 1000) * rate.completion;
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Fast check to see if the provider is reachable
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY || ''}`);
      return res.status !== 500 && res.status !== 503;
    } catch {
      return false;
    }
  }
}
