import { User } from '../types/data';

export const newSession = async (email: string, password: string) => {
  const user = await fetch('/api/auth', {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify({
      email,
      password,
    }),
  }).then(res => res.json());
  if (!user) {
    return undefined;
  }
  return user as User;
};

export const getSession = async () => {
  const session = await fetch('/api/session', {
    credentials: 'include',
  }).then(res => res.json());
  if (!session) {
    return undefined;
  }
  return session as User;
};

export const saveNewPost = async (
  title: string,
): Promise<{ slug: string; id: string; title: string } | undefined> => {
  const newPost = (await fetch('/api/posts', {
    credentials: 'include',
    method: 'post',
    body: JSON.stringify({
      title,
    }),
  }).then(res => res.json())) as
    | { slug: string; title: string; id: string }
    | undefined;
  if (!newPost?.id) {
    return undefined;
  }
  return newPost;
};
