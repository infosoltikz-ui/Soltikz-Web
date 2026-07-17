import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultPrompts = [
  {
    category: 'GENERAL_CHAT',
    systemPrompt: 'You are an expert ATS-friendly resume writer. Help the user build and optimize their resume.',
    userPrompt: '{{input}}',
    variables: ['input'],
    description: 'General chat assistant for resume building.',
  },
  {
    category: 'SUMMARY_GENERATOR',
    systemPrompt: 'You are an expert resume writer. Generate a professional summary highlighting the candidate\'s experience and skills. Keep it under 4 sentences.',
    userPrompt: 'Job Title: {{jobTitle}}\nExperience: {{experience}}\nSkills: {{skills}}',
    variables: ['jobTitle', 'experience', 'skills'],
    description: 'Generates professional resume summaries.',
  },
  {
    category: 'EXPERIENCE_REWRITER',
    systemPrompt: 'You are an expert ATS resume writer. Rewrite the provided work experience bullets to be more impactful, action-oriented, and metric-driven.',
    userPrompt: 'Role: {{role}}\nCompany: {{company}}\nBullets: {{bullets}}',
    variables: ['role', 'company', 'bullets'],
    description: 'Rewrites experience bullet points.',
  }
];

export async function seedPrompts() {
  console.log('🌱 Seeding AI Prompts...');
  for (const promptData of defaultPrompts) {
    const existing = await prisma.aIPrompt.findFirst({
      where: { category: promptData.category }
    });

    if (!existing) {
      await prisma.aIPrompt.create({
        data: {
          ...promptData,
          version: 1,
          isActive: true,
        }
      });
      console.log(`✅ Seeded prompt: ${promptData.category}`);
    } else {
      console.log(`⏭️  Prompt already exists: ${promptData.category}`);
    }
  }
}

if (require.main === module) {
  seedPrompts()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
