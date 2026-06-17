import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(6).max(128),
});

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
    role: z.string(),
    avatar: z.string().optional(),
  }),
});
