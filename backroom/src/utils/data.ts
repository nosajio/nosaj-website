import { JSONPost, Post } from 'types/data';
import { query } from './db';
import { getSlug } from './url';

/**
 * Get posts from the database
 */
export const getPosts = async (drafts: boolean = false) => {
  return await query<Post>(
    `select * from posts ${drafts ? 'where draft = true' : ''}`,
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

export const updatePost = async (
  id: string,
  { title, subtitle, body_html, slug, pubdate }: JSONPost,
) => {
  const [updatedPost] = await query<Post>(
    'update posts set title=$1, subtitle=$2, body_html=$3, slug=$4, pubdate=$5 where id = $6 returning *',
    [title, subtitle, body_html, slug, pubdate, id],
  );
  return updatedPost;
};

export const dbPostToJSON = (post: Post): JSONPost => ({
  ...post,
  body_html: post?.body_html || null,
  subtitle: post?.subtitle || null,
  cover_image: post?.cover_image || null,
  pubdate: post?.pubdate ? truncateDate(post.pubdate.toISOString()) : null,
});

/**
 *  This fixes the date string so that it can be passed to a datetime-local field
 *  (removes the :00.000Z).
 */
const truncateDate = (date: string) => date.replace(/(.*):.*Z/, '$1');
