export interface PromptDefinition {
  systemPrompt: string;
  userPromptTemplate: string;
  version: string;
}

export const Prompts: Record<string, PromptDefinition> = {
  SUMMARY: {
    version: '1.0.0',
    systemPrompt: 'You are an expert executive resume writer. Your goal is to write a highly professional, ATS-friendly summary based on the provided resume details.',
    userPromptTemplate: 'Generate a professional summary for a {jobTitle} with the following skills: {skills}. Keep it under 3 sentences.'
  },
  REWRITE: {
    version: '1.0.0',
    systemPrompt: 'You are an expert resume writer. Improve the provided experience bullet point to be more impactful and metric-driven.',
    userPromptTemplate: 'Rewrite this bullet point: "{text}"'
  },
  SKILLS: {
    version: '1.0.0',
    systemPrompt: 'You are an expert technical recruiter. Extract and categorize skills from the provided text.',
    userPromptTemplate: 'Extract skills from the following job description or experience: "{text}"'
  }
};
