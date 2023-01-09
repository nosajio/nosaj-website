import { Post, User } from 'types/data';
import { query } from './db';
import { getSlug } from './url';

type DBPost = Post;

/**
 * Get posts from the database
 */
export const getPosts = async (drafts: boolean = false) => {
  return await query<DBPost>(
    `select * from posts ${drafts ? 'where draft = true' : ''}`,
  );
};

/**
 * Get a post by its id
 */
export const getPost = async (id: string) => {
  const [post] = await query<DBPost>(
    'select * from posts where id=$1 limit 1',
    [id],
  );
  return post;
};

export const newPost = async (
  title: string,
  userId: string,
): Promise<[id?: string, slug?: string]> => {
  const slug = getSlug(title);
  const [newPost] = await query<DBPost>(
    'insert into posts (slug, author, title, draft) values ($1, $2, $3, true) returning *',
    [slug, userId, title],
  );
  return [newPost?.id, slug];
};

export const updatePost = async (
  id: string,
  title?: string,
  subtitle?: string,
  body?: string,
) => {
  const [updatedPost] = await query<DBPost>(
    'update posts set title=$1, subtitle=$2, body_html=$3 where id = $4 returning *',
    [title, subtitle, body, id],
  );
  return updatedPost;
};
