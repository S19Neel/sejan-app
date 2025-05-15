import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(1, 'Name must have atleast a character'),
  lastName: z.string().min(1, 'Last name must have atleast a character'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be atleast 6 characters'),
  phone: z.number().min(10, 'Must be a valid phone number'),
});

export type RegisterDTO = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be atleast 6 characters'),
});

export type LoginDTO = z.infer<typeof loginSchema>;
