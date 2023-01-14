import { JSONPost, Post } from '../types/data';
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
