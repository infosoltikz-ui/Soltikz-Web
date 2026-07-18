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
  },
  JOB_ANALYZER: {
    version: '1.0.0',
    systemPrompt: 'You are an expert ATS (Applicant Tracking System) and technical recruiter. Your job is to analyze a job description against a user\'s resume. Identify keyword matches, missing skills, and calculate a realistic match score out of 100 based on the presence of required skills and experience. Output JSON format only.',
    userPromptTemplate: `Job Description: {jobDescription}

Resume: {resumeContent}

Provide a JSON response with:
- score: number (0-100)
- missingSkills: string[]
- matchedSkills: string[]
- recommendations: string[]`
  },
  RESUME_TAILORING: {
    version: '1.0.0',
    systemPrompt: 'You are an expert executive resume writer. Your goal is to tailor the provided resume content to match a specific job description. Incorporate missing ATS keywords naturally into the user\'s existing experience, summary, and skills without fabricating facts or lying. Maintain a professional tone.',
    userPromptTemplate: `Job Description: {jobDescription}

Target Section Type: {sectionType}
Original Content: {originalContent}
Missing Skills to Incorporate (if applicable): {missingSkills}

Rewrite the Original Content to better align with the Job Description. Keep the same format as the original (e.g., if it's bullet points, keep bullet points). Do not fabricate information, but highlight aspects of the original content that align with the missing skills and job description.`
  },
  ATS_SCANNER: {
    version: '1.0.0',
    systemPrompt: 'You are a highly advanced ATS (Applicant Tracking System) parser and evaluator. Your job is to analyze a resume based on ATS best practices. Output a strict JSON structure containing the overall score, section scores, keyword analysis, formatting analysis, content analysis, ATS compatibility, and actionable AI recommendations.',
    userPromptTemplate: `Evaluate the following resume JSON context.

Resume Context: {resumeContent}

Return ONLY a valid JSON object following this exact schema:
{
  "overallScore": number (0-100),
  "sectionScores": {
    "contact": number,
    "summary": number,
    "experience": number,
    "skills": number,
    "education": number,
    "projects": number
  },
  "keywordAnalysis": {
    "found": string[],
    "missing": string[],
    "density": "Low" | "Optimal" | "High"
  },
  "formattingAnalysis": {
    "issues": string[],
    "isAtsFriendly": boolean
  },
  "contentAnalysis": {
    "grammarIssues": string[],
    "actionVerbsScore": number (0-100),
    "quantifiedAchievementsScore": number (0-100),
    "buzzwords": string[]
  },
  "atsCompatibility": {
    "parseSuccess": boolean,
    "missingSections": string[]
  },
  "recommendations": [
    {
      "section": "summary" | "experience" | "skills" | "projects" | "general",
      "issue": string,
      "suggestion": string,
      "severity": "High" | "Medium" | "Low"
    }
  ]
}`
  }
};
