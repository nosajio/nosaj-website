import { JSONPost, parsePost, Post } from 'data';

export type YearlyPosts = {
  [year: string]: Post[];
};

export const postsByYear = (posts: JSONPost[]): YearlyPosts => {
  return posts.reduce((years, jsonPost) => {
    const post = parsePost(jsonPost);
    const year = post.pubdate?.getFullYear()?.toString();
    if (!year) return years;
    if (!Object.keys(years).includes(year)) {
      years[year] = [post];
    } else {
      years[year].push(post);
    }
    return years;
  }, {} as YearlyPosts);
};
