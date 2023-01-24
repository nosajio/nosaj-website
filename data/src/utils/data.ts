import { JSONPost, Post, Subscriber } from '../types/data';
import { connect, query } from './db';
import { getSlug } from './url';

/**
 * Get posts from the database
 */
export const getPosts = async (drafts: boolean = false) => {
  return await query<Post>(
    `select * from posts ${
      drafts ? 'where draft = true' : ''
    } order by id desc`,
  );
};

/**
 * Get a post by its id
 */
export const getPost = async (id: string) => {
  const [post] = await query<Post>('select * from posts where id=$1 limit 1', [
    id,
  ]);
  return post;
};

/**
 * Get a post by its slug
 */
export const getPostBySlug = async (slug: string) => {
  const [post] = await query<Post>(
    'select * from posts where slug=$1 limit 1',
    [slug],
  );
  return post;
};

/**
 * Create a new draft post
 */
export const newPost = async (
  title: string,
  userId: string,
): Promise<[id?: string, slug?: string]> => {
  const slug = getSlug(title);
  const [newPost] = await query<Post>(
    'insert into posts (slug, author, title, draft) values ($1, $2, $3, true) returning *',
    [slug, userId, title],
  );
  return [newPost?.id, slug];
};

/**
 * Mark a draft post as published
 */
export const publishPost = async (
  id: string,
  { title, subtitle, body_html, slug }: JSONPost,
) => {
  const [updatedPost] = await query<Post>(
    'update posts set title=$1, subtitle=$2, body_html=$3, slug=$4, draft=false, pubdate=now() where id = $5 returning *',
    [title, subtitle, body_html, slug, id],
  );
  return updatedPost;
};

/**
 * Update fields for a post
 */
export const updatePost = async (
  id: string,
  { title, subtitle, body_html, slug }: JSONPost,
) => {
  const [updatedPost] = await query<Post>(
    'update posts set title=$1, subtitle=$2, body_html=$3, slug=$4 where id = $5 returning *',
    [title, subtitle, body_html, slug, id],
  );
  return updatedPost;
};

/**
 * Save a new newsletter subscriber
 */
export const newSubscriber = async (email: string) => {
  const [subscriber] = await query<Subscriber>(
    'insert into subscribers (email) values($1) returning *',
    [email],
  );
  return subscriber;
};

/**
 * Mark a subscriber as confirmed
 */
export const confirmSubscriber = async (token: string) => {
  const [confirmedSubscriber] = await query<Subscriber>(
    'update subscribers set confirmed_email=true where confirm_token=$1 returning *',
    [token],
  );
  return confirmedSubscriber;
};

/**
 * Get a subscriber by their confirmation token
 */
export const getSubscriberByToken = async (token: string) => {
  const [subscriber] = await query<Subscriber>(
    'select * from subscribers where confirm_token=$1',
    [token],
  );
  return subscriber;
};
