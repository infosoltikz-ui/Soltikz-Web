import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().optional(),
    country: z.string().optional(),
    timezone: z.string().optional(),
    bio: z.string().optional(),
    headline: z.string().optional(),
    website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    github: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  }),
});

export const updatePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  }),
});
