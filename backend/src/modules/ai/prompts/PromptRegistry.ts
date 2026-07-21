import { PrismaClient, AIPrompt, AIProvider } from '@prisma/client';

const prisma = new PrismaClient();

export class PromptRegistry {
  /**
   * Fetch the active version of a prompt for a given category.
   */
  public static async getPrompt(category: string, provider?: AIProvider): Promise<AIPrompt | null> {
    const prompts = await prisma.aIPrompt.findMany({
      where: {
        category,
        isActive: true,
      },
      orderBy: { version: 'desc' },
    });

    if (prompts.length === 0) return null;

    // Filter by provider compatibility if a provider is specified
    if (provider) {
      const compatiblePrompt = prompts.find(p => !p.provider || p.provider === provider);
      if (compatiblePrompt) return compatiblePrompt;
    }

    // Default to the highest version if no provider-specific prompt is found
    return prompts[0];
  }

  /**
   * Validate that all required variables are present in the provided variables map.
   */
  public static validateVariables(prompt: AIPrompt, variables: Record<string, string>): void {
    const missingVariables = prompt.variables.filter(v => !(v in variables));
    if (missingVariables.length > 0) {
      throw new Error(`Missing required variables for prompt ${prompt.category}: ${missingVariables.join(', ')}`);
    }
  }

  /**
   * Substitute variables into a template string.
   */
  public static substitute(template: string, variables: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
  }

  /**
   * Create a new version of a prompt.
   */
  public static async createPromptVersion(data: Omit<AIPrompt, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<AIPrompt> {
    const latestPrompt = await prisma.aIPrompt.findFirst({
      where: { category: data.category },
      orderBy: { version: 'desc' }
    });

    const newVersion = latestPrompt ? latestPrompt.version + 1 : 1;

    // Optionally set older versions to inactive
    await prisma.aIPrompt.updateMany({
      where: { category: data.category },
      data: { isActive: false }
    });

    return prisma.aIPrompt.create({
      data: {
        ...data,
        version: newVersion,
        isActive: true,
      }
    });
  }
}
