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
