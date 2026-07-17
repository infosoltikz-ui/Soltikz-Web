import OpenAI from 'openai';
import { AIProvider, GenerateParams, GenerateResponse, StreamParams } from './AIProvider.interface';

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
    });
  }

  async generate(params: GenerateParams): Promise<GenerateResponse> {
    const startTime = Date.now();
    const model = params.model || 'gpt-4o-mini';

    try {
      const response = await this.client.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: params.systemPrompt },
          { role: 'user', content: params.userPrompt },
        ],
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 1000,
      });

      const latency = Date.now() - startTime;
      const content = response.choices[0]?.message?.content || '';
      const promptTokens = response.usage?.prompt_tokens || this.estimateTokens(params.systemPrompt + params.userPrompt);
      const completionTokens = response.usage?.completion_tokens || this.estimateTokens(content);
      const totalTokens = response.usage?.total_tokens || (promptTokens + completionTokens);
      const cost = this.estimateCost(model, promptTokens, completionTokens);

      return {
        success: true,
        provider: 'OPENAI',
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
      console.error('[OpenAIProvider] Generate error:', error);
      throw new Error(`OpenAI generation failed: ${error.message}`);
    }
  }

  async stream(params: StreamParams): Promise<void> {
    const model = params.model || 'gpt-4o-mini';

    try {
      const stream = await this.client.chat.completions.create(
        {
          model: model,
          messages: [
            { role: 'system', content: params.systemPrompt },
            { role: 'user', content: params.userPrompt },
          ],
          temperature: params.temperature ?? 0.7,
          max_tokens: params.maxTokens ?? 1000,
          stream: true,
        },
        { signal: params.abortSignal }
      );

      for await (const chunk of stream) {
        if (params.abortSignal?.aborted) break;
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          params.onChunk(content);
        }
      }

      if (params.onComplete) {
        params.onComplete();
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('[OpenAIProvider] Stream aborted by user');
      } else {
        console.error('[OpenAIProvider] Stream error:', error);
        if (params.onError) params.onError(error);
      }
    }
  }

  estimateTokens(text: string): number {
    // Rough estimation: 1 token ~= 4 characters in English
    return Math.ceil(text.length / 4);
  }

  estimateCost(model: string, promptTokens: number, completionTokens: number): number {
    // Simple cost estimation (prices as of late 2024 per 1k tokens)
    const pricing: Record<string, { prompt: number; completion: number }> = {
      'gpt-4o': { prompt: 0.005, completion: 0.015 },
      'gpt-4o-mini': { prompt: 0.00015, completion: 0.0006 },
    };
    const rate = pricing[model] || pricing['gpt-4o-mini'];
    return (promptTokens / 1000) * rate.prompt + (completionTokens / 1000) * rate.completion;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY || ''}` }
      });
      return res.status !== 500 && res.status !== 503;
    } catch {
      return false;
    }
  }
}
