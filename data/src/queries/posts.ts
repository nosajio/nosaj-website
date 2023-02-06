import { query } from '../db';
import { JSONPost, NewPost, Post } from '../types/model';
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
 * Get all posts, ignoring draft status
 */
export const getAllPosts = () =>
  query<Post>(`select * from posts order by pubdate desc`);

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
export const newPost = async (post: NewPost): Promise<Post> => {
  const slug = post?.slug || getSlug(post.title);
  const [newPost] = await query<Post>(
    'insert into posts (slug, author, title, subtitle, body_md, body_html, draft) values ($1, $2, $3, $4, $5, $6, true) returning *',
    [
      slug,
      post.author,
      post.title,
      post.subtitle,
      post.body_md,
      post.body_html,
    ],
  );
  return newPost;
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
  { title, subtitle, body_html, body_md, slug }: JSONPost,
) => {
  const [updatedPost] = await query<Post>(
    'update posts set title=$1, subtitle=$2, body_md=$3, body_html=$4, slug=$5 where id = $6 returning *',
    [title, subtitle, body_md, body_html, slug, id],
  );
  return updatedPost;
};
