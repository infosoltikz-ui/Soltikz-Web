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
