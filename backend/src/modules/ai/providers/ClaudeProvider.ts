import Anthropic from '@anthropic-ai/sdk';
import { AIProvider, GenerateParams, GenerateResponse, StreamParams } from './AIProvider.interface';

export class ClaudeProvider implements AIProvider {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || 'sk-ant-placeholder',
    });
  }

  async generate(params: GenerateParams): Promise<GenerateResponse> {
    const startTime = Date.now();
    const model = params.model || 'claude-3-haiku-20240307';

    try {
      const response = await this.client.messages.create({
        model,
        system: params.systemPrompt,
        messages: [{ role: 'user', content: params.userPrompt }],
        max_tokens: params.maxTokens ?? 1000,
        temperature: params.temperature ?? 0.7,
      });

      const latency = Date.now() - startTime;
      
      const content = response.content.map(block => block.type === 'text' ? block.text : '').join('');
      
      const promptTokens = response.usage?.input_tokens || this.estimateTokens(params.systemPrompt + params.userPrompt);
      const completionTokens = response.usage?.output_tokens || this.estimateTokens(content);
      const totalTokens = promptTokens + completionTokens;
      const cost = this.estimateCost(model, promptTokens, completionTokens);

      return {
        success: true,
        provider: 'CLAUDE',
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
      console.error('[ClaudeProvider] Generate error:', error);
      throw new Error(`Claude generation failed: ${error.message}`);
    }
  }

  async stream(params: StreamParams): Promise<void> {
    const model = params.model || 'claude-3-haiku-20240307';

    try {
      const stream = await this.client.messages.create({
        model,
        system: params.systemPrompt,
        messages: [{ role: 'user', content: params.userPrompt }],
        max_tokens: params.maxTokens ?? 1000,
        temperature: params.temperature ?? 0.7,
        stream: true,
      }, { signal: params.abortSignal });

      for await (const chunk of stream) {
        if (params.abortSignal?.aborted) break;
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          params.onChunk(chunk.delta.text);
        }
      }

      if (params.onComplete) {
        params.onComplete();
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('[ClaudeProvider] Stream aborted by user');
      } else {
        console.error('[ClaudeProvider] Stream error:', error);
        if (params.onError) params.onError(error);
      }
    }
  }

  estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  estimateCost(model: string, promptTokens: number, completionTokens: number): number {
    const pricing: Record<string, { prompt: number; completion: number }> = {
      'claude-3-opus-20240229': { prompt: 0.015, completion: 0.075 },
      'claude-3-sonnet-20240229': { prompt: 0.003, completion: 0.015 },
      'claude-3-haiku-20240307': { prompt: 0.00025, completion: 0.00125 },
    };
    const rate = pricing[model] || pricing['claude-3-haiku-20240307'];
    return (promptTokens / 1000) * rate.prompt + (completionTokens / 1000) * rate.completion;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch('https://api.anthropic.com/v1/models', {
        headers: { 
          'x-api-key': process.env.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01'
        }
      });
      return res.status !== 500 && res.status !== 503;
    } catch {
      return false;
    }
  }
}
