export interface GenerateParams {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface StreamParams extends GenerateParams {
  onChunk: (chunk: string) => void;
  onComplete?: () => void;
  onError?: (error: any) => void;
  abortSignal?: AbortSignal;
}

export interface GenerateResponse {
  success: boolean;
  provider: string;
  model: string;
  message: string;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  latency: number;
  cost: number;
  response: string;
}

export interface AIProvider {
  generate(params: GenerateParams): Promise<GenerateResponse>;
  stream(params: StreamParams): Promise<void>;
  estimateTokens(text: string): number;
  estimateCost(model: string, promptTokens: number, completionTokens: number): number;
  healthCheck(): Promise<boolean>;
}
