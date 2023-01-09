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
  // author: userObject,
  author: z.string(),
  cover_image: z.string().optional(),
  pubdate: z.date().optional(),
  subtitle: z.string().optional(),
});

export const postObjectNullish = z.object({
  title: z.string().nullish(),
  id: z.string().nullish(),
  body_html: z.string().nullish(),
  draft: z.boolean().nullish(),
  slug: z.string().nullish(),
  // author: userObject.nullish(),
  author: z.string().nullish(),
  cover_image: z.string().nullish(),
  pubdate: z.date().nullish(),
  subtitle: z.string().nullish(),
});

export type User = z.infer<typeof userObject>;
export type Post = z.infer<typeof postObject>;
