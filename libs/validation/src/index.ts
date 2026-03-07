import { z } from 'zod';

export const postFormSchema = z.object({
  categoryId: z.number().int().positive(),
  title: z.string().min(3).max(120),
  body: z.string().min(3).max(4000),
  tags: z.array(z.string().min(1).max(30)).max(10).optional()
});

export type PostFormInput = z.infer<typeof postFormSchema>;
