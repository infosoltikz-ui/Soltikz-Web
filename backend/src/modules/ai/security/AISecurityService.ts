export class AISecurityService {
  /**
   * Validate that the user prompt is safe to process.
   */
  public static validatePrompt(prompt: string, maxLength: number = 4000): void {
    if (prompt.length > maxLength) {
      throw new Error(`Prompt exceeds maximum length of ${maxLength} characters.`);
    }

    // Basic heuristic for prompt injection keywords
    const blockedKeywords = ['ignore previous instructions', 'system prompt', 'you are now', 'jailbreak'];
    const lowerPrompt = prompt.toLowerCase();
    
    for (const keyword of blockedKeywords) {
      if (lowerPrompt.includes(keyword)) {
        throw new Error('Potential prompt injection detected. Request blocked.');
      }
    }
  }

  /**
   * Sanitize the output from the AI.
   * Strip out any potentially malicious markdown or scripts.
   */
  public static sanitizeOutput(output: string): string {
    // Strip simple script tags if AI accidentally outputs HTML
    return output.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                 .replace(/javascript:/gi, '');
  }
}
