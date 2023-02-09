import { JSONPost, Post } from '../types/model';
import { dateStr, truncateDate } from './dates';

export const dbPostToJSON = (post: Post): JSONPost => ({
  ...post,
  body_html: post?.body_html || null,
  subtitle: post?.subtitle || null,
  cover_image: post?.cover_image || null,
  pubdate: post?.pubdate ? truncateDate(post.pubdate.toISOString()) : null,
  created_date: post.created_date.toISOString(),
});

export type ParsedPost = Post & {
  pubdate_str?: string;
};

export const parsePost = (
  jsonPost: Post | JSONPost,
  fullDate?: boolean,
): ParsedPost => {
  const pubdate =
    jsonPost.pubdate && !(jsonPost.pubdate instanceof Date)
      ? new Date(jsonPost.pubdate)
      : new Date();
  const created_date = !(jsonPost.created_date instanceof Date)
    ? new Date(jsonPost.created_date)
    : jsonPost.created_date;
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
    pubdate_str: pubdate ? dateStr(pubdate, fullDate) : undefined,
  };
};
