import { z } from 'zod';

export const MasterEducationSchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(1, 'Degree is required'),
  specialization: z.string().nullable().optional(),
  university: z.string().nullable().optional(),
  college: z.string().nullable().optional(),
  percentageCgpa: z.string().nullable().optional(),
  startYear: z.string().nullable().optional(),
  endYear: z.string().nullable().optional(),
  educationType: z.string().nullable().optional(),
});

export const MasterCertificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  organization: z.string().nullable().optional(),
  completionDate: z.string().nullable().optional(),
  credentialId: z.string().nullable().optional(),
  credentialUrl: z.string().nullable().optional(),
  skillsCovered: z.string().nullable().optional(),
});

export const MasterTechnicalSkillSchema = z.object({
  id: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).default([]),
});

export const MasterEmploymentSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, 'Company is required'),
  client: z.string().nullable().optional(),
  designation: z.string().nullable().optional(),
  employmentType: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  currentCompany: z.boolean().default(false),
  location: z.string().nullable().optional(),
  responsibilities: z.string().nullable().optional(),
  environment: z.string().nullable().optional(),
  technologyStack: z.string().nullable().optional(),
  achievements: z.string().nullable().optional(),
});

export const MasterProjectSchema = z.object({
  id: z.string().optional(),
  projectName: z.string().min(1, 'Project Name is required'),
  client: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  businessDomain: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  responsibilities: z.string().nullable().optional(),
  technologyStack: z.string().nullable().optional(),
  environment: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
  teamSize: z.string().nullable().optional(),
  methodology: z.string().nullable().optional(),
  achievements: z.string().nullable().optional(),
});

export const MasterLanguageSchema = z.object({
  id: z.string().optional(),
  language: z.string().min(1, 'Language is required'),
  canRead: z.boolean().default(false),
  canWrite: z.boolean().default(false),
  canSpeak: z.boolean().default(false),
});

export const MasterAwardSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Award name is required'),
  organization: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

export const MasterAchievementSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
});

export const MasterSocialLinkSchema = z.object({
  id: z.string().optional(),
  linkedin: z.string().nullable().optional(),
  github: z.string().nullable().optional(),
  portfolio: z.string().nullable().optional(),
  stackOverflow: z.string().nullable().optional(),
  leetCode: z.string().nullable().optional(),
  hackerRank: z.string().nullable().optional(),
});

export const MasterProfileSchema = z.object({
  profilePhoto: z.string().nullable().optional(),
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  email: z.string().email('Invalid email'),
  mobileNumber: z.string().min(1, 'Mobile Number is required'),
  currentLocation: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  linkedin: z.string().nullable().optional(),
  github: z.string().nullable().optional(),
  portfolio: z.string().nullable().optional(),
  currentDesignation: z.string().nullable().optional(),
  totalExperience: z.string().nullable().optional(),
  noticePeriod: z.string().nullable().optional(),
  currentCtc: z.string().nullable().optional(),
  expectedCtc: z.string().nullable().optional(),
  preferredLocation: z.string().nullable().optional(),
  workAuthorization: z.string().nullable().optional(),
  visaStatus: z.string().nullable().optional(),
  careerObjective: z.string().nullable().optional(),

  educations: z.array(MasterEducationSchema).optional(),
  certifications: z.array(MasterCertificationSchema).optional(),
  skills: z.array(MasterTechnicalSkillSchema).optional(),
  employments: z.array(MasterEmploymentSchema).optional(),
  projects: z.array(MasterProjectSchema).optional(),
  languages: z.array(MasterLanguageSchema).optional(),
  awards: z.array(MasterAwardSchema).optional(),
  achievements: z.array(MasterAchievementSchema).optional(),
  socialLinks: z.array(MasterSocialLinkSchema).optional(),
});

export type UpdateMasterProfileDTO = z.infer<typeof MasterProfileSchema>;
