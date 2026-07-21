import { Prompts } from '../prompts';

export class PromptBuilder {
  public static build(promptType: string, variables: Record<string, string>): { systemPrompt: string; userPrompt: string; version: string } {
    const template = Prompts[promptType.toUpperCase()];
    
    if (!template) {
      throw new Error(`Prompt type ${promptType} is not defined.`);
    }

    let userPrompt = template.userPromptTemplate;
    for (const [key, value] of Object.entries(variables)) {
      userPrompt = userPrompt.replace(`{${key}}`, value || '');
    }

    return {
      systemPrompt: template.systemPrompt,
      userPrompt,
      version: template.version,
    };
  }
}
