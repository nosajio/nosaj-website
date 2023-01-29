import { query } from '../db';
import { JSONPost, Post } from '../types/model';
import { getSlug } from '../utils/url';

/**
 * Get posts from the database
 */
export const getPosts = async (drafts: boolean = false) => {
  return await query<Post>(
    `select * from posts where draft = ${
      drafts ? 'true' : 'false'
    } order by pubdate desc`,
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
