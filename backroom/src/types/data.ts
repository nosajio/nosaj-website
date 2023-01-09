import { z } from 'zod';

export const userObject = z.object({
  id: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
});

export const postObject = z.object({
  title: z.string(),
  id: z.string(),
  body_html: z.string(),
  draft: z.boolean(),
  slug: z.string(),
  created_date: z.date(),
  // author: userObject,
  author: z.string(),
  cover_image: z.string().optional(),
  pubdate: z.date().optional(),
  subtitle: z.string().optional(),
});

export const jsonPost = postObject.merge(
  z.object({
    created_date: z.string(),
    body_html: z.string().nullable(),
    cover_image: z.string().nullable(),
    pubdate: z.string().nullable(),
    subtitle: z.string().nullable(),
  }),
);

export type User = z.infer<typeof userObject>;
export type Post = z.infer<typeof postObject>;
export type JSONPost = z.infer<typeof jsonPost>;
