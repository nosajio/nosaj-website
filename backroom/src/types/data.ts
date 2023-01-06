export type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
};

export type Post = {
  id: string;
  slug: string;
  pubdate: string;
  author: User;
  title: string;
  subtitle: string;
  body_html: string;
  cover_image: string;
  draft: boolean;
};
