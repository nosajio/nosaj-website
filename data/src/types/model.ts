import { z } from 'zod';

/**
 * NET users
 */
export const userObject = z.object({
  id: z.string().uuid(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
});

export type User = z.infer<typeof userObject>;

/**
 * Posts
 */
export const postObject = z.object({
  title: z.string(),
  id: z.string().uuid(),
  body_html: z.string().default(''),
  body_md: z.string(),
  draft: z.boolean().default(true),
  slug: z.string(),
  created_date: z.date().default(new Date()),
  // author: userObject,
  author: z.string().uuid(),
  cover_image: z.string().optional(),
  pubdate: z.date().optional().default(new Date()),
  subtitle: z.string().optional(),
});

export const jsonPost = postObject.merge(
  z.object({
    created_date: z.string().default(new Date().toISOString()),
    body_html: z.string().nullable(),
    cover_image: z.string().nullable(),
    pubdate: z.string().nullable(),
    subtitle: z.string().nullable(),
  }),
);

export const newPost = jsonPost.omit({ id: true });

export type Post = z.infer<typeof postObject>;
export type JSONPost = z.infer<typeof jsonPost>;
export type NewPost = z.infer<typeof newPost>;

/**
 * Subscribers
 */
export const subscriber = z.object({
  id: z.string().uuid(),
  email: z.string(),
  subscribed_date: z.date(),
  confirm_token: z.string().uuid(),
  confirmed_email: z.boolean(),
});

export type Subscriber = z.infer<typeof subscriber>;

/**
 * Emails
 */
export const sentEmail = z.object({
  id: z.string().uuid(),
  post: z.string().uuid(),
  subscriber: z.string().uuid(),
  sent_at: z.date(),
});

export const sentEmailRefs = sentEmail.merge(
  z.object({
    post: postObject,
    subscriber: subscriber,
  }),
);

export type SentEmail = z.infer<typeof sentEmail>;
export type SentEmailRefs = z.infer<typeof sentEmailRefs>;

/**
 * Events
 */
export const event = z.object({
  id: z.string().uuid(),
  event: z.string(),
  metadata: z.record(z.any()),
  timestamp: z.date(),
});

export const unsubscribeEvent = event.merge(
  z.object({
    event: z.literal('unsubscribe'),
    metadata: z.object({
      token: z.string().uuid(),
      email_id: z.string().uuid(),
      email_address: z.string(),
      subscribed_days: z.number().optional(),
    }),
  }),
);

export const failedOperationEvent = event.merge(
  z.object({
    event: z.literal('failed_operation'),
    metadata: z.intersection(
      z.object({
        operation: z.string(),
      }),
      z.record(z.string(), z.any()),
    ),
  }),
);

export const confirmEmailEvent = event.merge(
  z.object({
    event: z.literal('confirm_email'),
    metadata: z.object({
      email_address: z.string(),
      token: z.string().uuid(),
    }),
  }),
);

export type AppEvent = z.infer<typeof event>;
export type UnsubscribeEvent = z.infer<typeof unsubscribeEvent>;
export type FailedOperationEvent = z.infer<typeof failedOperationEvent>;
export type ConfirmEmailEvent = z.infer<typeof confirmEmailEvent>;
export type AnyEvent =
  | UnsubscribeEvent
  | FailedOperationEvent
  | ConfirmEmailEvent;
export type AppEventType = AnyEvent['event'];
