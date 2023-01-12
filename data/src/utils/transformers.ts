import { JSONPost, Post } from "../types/data";
import { truncateDate } from "./dates";

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
  const created_date = jsonPost.created_date
    ? new Date(jsonPost.created_date)
    : undefined;
  const vals = Object.entries(jsonPost).map(([k, v]) => [
    [k, v ? v : undefined],
  ]);
  return {
    ...Object.fromEntries(vals),
    pubdate,
    created_date,
  };
};
