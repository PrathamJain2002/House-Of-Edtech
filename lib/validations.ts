import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .trim(),
  email: z.string().email('Please provide a valid email address').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .trim()
    .optional()
    .default(''),
  status: z.enum(['todo', 'in_progress', 'completed']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().optional().nullable(),
  tags: z.array(z.string().trim()).max(10, 'Maximum 10 tags allowed').default([]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TaskInput = z.infer<typeof taskSchema>;

