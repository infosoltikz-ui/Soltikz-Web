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
  },
  {
    category: 'COVER_LETTER_GENERATOR',
    systemPrompt: 'You are an expert executive resume writer and recruiter. Your objective is to write a highly personalized, compelling, and ATS-friendly cover letter based on the provided resume and target job description. Never hallucinate facts, use only the experience and skills found in the resume. Maintain a professional, authentic, and human-sounding tone, avoiding generic phrases. Your response should just be the cover letter text, no markdown code blocks unless requested.',
    userPrompt: 'Please write a cover letter using the following details.\n\nTarget Job Description: {{jobDescription}}\n\nTarget Company: {{companyName}}\nTarget Position: {{position}}\nTone: {{tone}}\nLength: {{length}}\n\nMy Resume Context:\n{{resumeContent}}\n\nWrite the cover letter focusing on the alignment between my experience and the job description. Do not include placeholder brackets like [Your Name] in the signature if the name is available in the resume context. Do not invent any metrics or experiences.',
    variables: ['jobDescription', 'companyName', 'position', 'tone', 'length', 'resumeContent'],
    description: 'Generates an AI cover letter from resume and job description.',
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
