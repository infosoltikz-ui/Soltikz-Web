import { z } from 'zod';
import { ResumeStatus, ResumeVisibility } from '@prisma/client';

export const createResumeSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
    templateId: z.string().uuid('Invalid template ID').optional(),
  }),
});

export const updateResumeSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters').optional(),
    status: z.nativeEnum(ResumeStatus).optional(),
    visibility: z.nativeEnum(ResumeVisibility).optional(),
  }),
});

// Presentation Settings Schemas
export const updateTemplateSchema = z.object({
  body: z.object({
    selectedTemplate: z.string().min(1),
  }),
});

export const updateThemeSchema = z.object({
  body: z.object({
    defaultTheme: z.string().optional(),
    primaryColor: z.string().optional(),
  }),
});

export const updateTypographySchema = z.object({
  body: z.object({
    fontFamily: z.string().optional(),
    fontSize: z.string().optional(),
    lineSpacing: z.string().optional(),
  }),
});

export const updateLayoutSchema = z.object({
  body: z.object({
    sectionSpacing: z.string().optional(),
    pageMargin: z.string().optional(),
    showProfilePhoto: z.boolean().optional(),
    showIcons: z.boolean().optional(),
    showSectionDividers: z.boolean().optional(),
  }),
});

export const getResumesQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
    status: z.enum(['DRAFT', 'IN_PROGRESS', 'READY', 'ARCHIVED', 'TRASH', 'ALL']).optional(),
    favorite: z.string().transform((val) => val === 'true').optional(),
    sort: z.enum(['newest', 'oldest', 'updated', 'alphabetical', 'completion', 'favorites', 'created']).optional(),
  }),
});

export const updatePersonalSchema = z.object({
  body: z.object({
    firstName: z.string().max(50).optional(),
    lastName: z.string().max(50).optional(),
    title: z.string().max(100).optional(),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().max(20).optional(),
    countryCode: z.string().max(5).optional(),
    location: z.string().max(100).optional(),
    city: z.string().max(50).optional(),
    state: z.string().max(50).optional(),
    country: z.string().max(50).optional(),
    linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
    github: z.string().url('Invalid URL').optional().or(z.literal('')),
    portfolio: z.string().url('Invalid URL').optional().or(z.literal('')),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
    profileImage: z.string().url('Invalid URL').optional().or(z.literal('')),
    about: z.string().max(2000).optional(),
  }),
});

export const updateSummarySchema = z.object({
  body: z.object({
    content: z.string().max(4000).optional(),
  }),
});

// Experiences
export const createExperienceSchema = z.object({
  body: z.object({
    companyName: z.string().min(1, 'Company name is required').max(100),
    jobTitle: z.string().min(1, 'Job title is required').max(100),
    employmentType: z.string().max(50).optional(),
    city: z.string().max(50).optional(),
    state: z.string().max(50).optional(),
    country: z.string().max(50).optional(),
    startDate: z.string().max(50).optional(),
    endDate: z.string().max(50).optional(),
    currentlyWorking: z.boolean().optional(),
    description: z.string().max(4000).optional(),
  }),
});

export const updateExperienceSchema = z.object({
  body: z.object({
    companyName: z.string().min(1, 'Company name is required').max(100).optional(),
    jobTitle: z.string().min(1, 'Job title is required').max(100).optional(),
    employmentType: z.string().max(50).optional(),
    city: z.string().max(50).optional(),
    state: z.string().max(50).optional(),
    country: z.string().max(50).optional(),
    startDate: z.string().max(50).optional(),
    endDate: z.string().max(50).optional(),
    currentlyWorking: z.boolean().optional(),
    description: z.string().max(4000).optional(),
  }),
});

// Educations
export const createEducationSchema = z.object({
  body: z.object({
    institution: z.string().min(1, 'Institution is required').max(100),
    degree: z.string().max(100).optional(),
    fieldOfStudy: z.string().max(100).optional(),
    grade: z.string().max(50).optional(),
    city: z.string().max(50).optional(),
    country: z.string().max(50).optional(),
    startDate: z.string().max(50).optional(),
    endDate: z.string().max(50).optional(),
    currentlyStudying: z.boolean().optional(),
    description: z.string().max(4000).optional(),
  }),
});

export const updateEducationSchema = z.object({
  body: z.object({
    institution: z.string().min(1, 'Institution is required').max(100).optional(),
    degree: z.string().max(100).optional(),
    fieldOfStudy: z.string().max(100).optional(),
    grade: z.string().max(50).optional(),
    city: z.string().max(50).optional(),
    country: z.string().max(50).optional(),
    startDate: z.string().max(50).optional(),
    endDate: z.string().max(50).optional(),
    currentlyStudying: z.boolean().optional(),
    description: z.string().max(4000).optional(),
  }),
});

// Skills
export const createSkillSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Skill name is required').max(100),
    category: z.string().max(50).optional(),
    proficiency: z.string().max(50).optional(),
  }),
});

export const updateSkillSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Skill name is required').max(100).optional(),
    category: z.string().max(50).optional(),
    proficiency: z.string().max(50).optional(),
  }),
});

// Projects
export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Project title is required').max(100),
    description: z.string().max(4000).optional(),
    technologies: z.array(z.string()).optional(),
    githubUrl: z.string().url().optional().or(z.literal('')),
    liveUrl: z.string().url().optional().or(z.literal('')),
    startDate: z.string().max(50).optional(),
    endDate: z.string().max(50).optional(),
    featured: z.boolean().optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Project title is required').max(100).optional(),
    description: z.string().max(4000).optional(),
    technologies: z.array(z.string()).optional(),
    githubUrl: z.string().url().optional().or(z.literal('')),
    liveUrl: z.string().url().optional().or(z.literal('')),
    startDate: z.string().max(50).optional(),
    endDate: z.string().max(50).optional(),
    featured: z.boolean().optional(),
  }),
});

export const reorderSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      id: z.string().uuid(),
      displayOrder: z.number().int(),
    })).min(1),
  }),
});

// Certifications
export const createCertificationSchema = z.object({
  body: z.object({
    certificationName: z.string().min(1, 'Certification name is required').max(150),
    issuingOrganization: z.string().max(100).optional(),
    credentialId: z.string().max(100).optional(),
    credentialUrl: z.string().url().optional().or(z.literal('')),
    issueDate: z.string().max(50).optional(),
    expirationDate: z.string().max(50).optional(),
    neverExpires: z.boolean().optional(),
  }),
});

export const updateCertificationSchema = z.object({
  body: z.object({
    certificationName: z.string().min(1, 'Certification name is required').max(150).optional(),
    issuingOrganization: z.string().max(100).optional(),
    credentialId: z.string().max(100).optional(),
    credentialUrl: z.string().url().optional().or(z.literal('')),
    issueDate: z.string().max(50).optional(),
    expirationDate: z.string().max(50).optional(),
    neverExpires: z.boolean().optional(),
  }),
});

// Languages
export const createLanguageSchema = z.object({
  body: z.object({
    language: z.string().min(1, 'Language is required').max(100),
    proficiency: z.enum(['Native', 'Fluent', 'Advanced', 'Intermediate', 'Beginner']).optional(),
  }),
});

export const updateLanguageSchema = z.object({
  body: z.object({
    language: z.string().min(1, 'Language is required').max(100).optional(),
    proficiency: z.enum(['Native', 'Fluent', 'Advanced', 'Intermediate', 'Beginner']).optional(),
  }),
});

// Achievements
export const createAchievementSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Achievement title is required').max(150),
    description: z.string().max(4000).optional(),
    achievementDate: z.string().max(50).optional(),
  }),
});

export const updateAchievementSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Achievement title is required').max(150).optional(),
    description: z.string().max(4000).optional(),
    achievementDate: z.string().max(50).optional(),
  }),
});

// Awards
export const createAwardSchema = z.object({
  body: z.object({
    awardName: z.string().min(1, 'Award name is required').max(150),
    issuer: z.string().max(100).optional(),
    awardDate: z.string().max(50).optional(),
    description: z.string().max(4000).optional(),
  }),
});

export const updateAwardSchema = z.object({
  body: z.object({
    awardName: z.string().min(1, 'Award name is required').max(150).optional(),
    issuer: z.string().max(100).optional(),
    awardDate: z.string().max(50).optional(),
    description: z.string().max(4000).optional(),
  }),
});

// Interests
export const createInterestSchema = z.object({
  body: z.object({
    interest: z.string().min(1, 'Interest is required').max(100),
    category: z.enum(['Sports', 'Technology', 'Travel', 'Reading', 'Music', 'Art', 'Community', 'Other']).optional(),
  }),
});

export const updateInterestSchema = z.object({
  body: z.object({
    interest: z.string().min(1, 'Interest is required').max(100).optional(),
    category: z.enum(['Sports', 'Technology', 'Travel', 'Reading', 'Music', 'Art', 'Community', 'Other']).optional(),
  }),
});

// References
export const createReferenceSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Reference name is required').max(100),
    designation: z.string().max(100).optional(),
    company: z.string().max(100).optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().max(20).optional(),
    relationship: z.string().max(100).optional(),
    availableUponRequest: z.boolean().optional(),
  }),
});

export const updateReferenceSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Reference name is required').max(100).optional(),
    designation: z.string().max(100).optional(),
    company: z.string().max(100).optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().max(20).optional(),
    relationship: z.string().max(100).optional(),
    availableUponRequest: z.boolean().optional(),
  }),
});
