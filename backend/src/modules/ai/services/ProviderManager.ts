import { AIProvider } from '../providers/AIProvider.interface';
import { OpenAIProvider } from '../providers/OpenAIProvider';
import { ClaudeProvider } from '../providers/ClaudeProvider';
import { GeminiProvider } from '../providers/GeminiProvider';

export class ProviderManager {
  private static instance: ProviderManager;
  private providers: Map<string, AIProvider>;

  private constructor() {
    this.providers = new Map();
    this.providers.set('OPENAI', new OpenAIProvider());
    this.providers.set('CLAUDE', new ClaudeProvider());
    this.providers.set('GEMINI', new GeminiProvider());
  }

  public static getInstance(): ProviderManager {
    if (!ProviderManager.instance) {
      ProviderManager.instance = new ProviderManager();
    }
    return ProviderManager.instance;
  }

  public getProvider(providerName: string): AIProvider {
    const provider = this.providers.get(providerName.toUpperCase());
    if (!provider) {
      throw new Error(`AI Provider ${providerName} is not supported.`);
    }
    return provider;
  }
}
