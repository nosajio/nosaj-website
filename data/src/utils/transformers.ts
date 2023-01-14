import { JSONPost, Post } from '../types/data';
import { truncateDate } from './dates';

export const dbPostToJSON = (post: Post): JSONPost => ({
  ...post,
  body_html: post?.body_html || null,
  subtitle: post?.subtitle || null,
  cover_image: post?.cover_image || null,
  pubdate: post?.pubdate ? truncateDate(post.pubdate.toISOString()) : null,
  created_date: post.created_date.toISOString(),
});

export const parsePost = (jsonPost: JSONPost): Post => {
  const pubdate = jsonPost.pubdate ? new Date(jsonPost.pubdate) : undefined;
  const created_date = new Date(jsonPost.created_date);
  const vals = Object.keys(jsonPost).reduce((o, k) => {
    const v = jsonPost[k as keyof JSONPost];
    return {
      ...o,
      [k]: !v ? undefined : v,
    };
  }, {} as Post);

  return {
    ...vals,
    pubdate,
    created_date,
  };
};
