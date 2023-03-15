import { JSONPost, NewPost, Subscriber, User } from 'data';
import { PostsRouteResponse } from 'pages/api/posts';
import {
  Recipient,
  SubscribersRouteResponse,
} from 'pages/api/posts/[postId]/subscribers';
import { UnpublishRouteResponse } from 'pages/api/posts/[postId]/unpublish';

const apiFetch = async <R = unknown>(
  path: string,
  options?: {
    method?: 'get' | 'put' | 'post' | 'delete';
    body?: Record<string, any>;
  },
): Promise<R> => {
  const method = options?.method || 'get';
  const body = options?.body && JSON.stringify(options.body);
  const res = await fetch(`/api/${path}`, {
    credentials: 'include',
    method,
    body,
  }).then(res => res.json());
  return res as R;
};

/**
 * Session API fns
 */

export const newSession = async (email: string, password: string) => {
  const user = await apiFetch<User>('auth', {
    method: 'post',
    body: {
      email,
      password,
    },
  });
  if (!user) {
    return undefined;
  }
  return user;
};

export const getSession = async () => {
  const session = await apiFetch<User>('session');
  if (!session) {
    return undefined;
  }
  return session;
};

/**
 * Post API fns
 */

type NewPostClientParts = Omit<NewPost, 'author' | 'created_date' | 'draft'>;
export const saveNewPost = async (post: NewPostClientParts) => {
  const newPost = await apiFetch<PostsRouteResponse>('posts', {
    method: 'post',
    body: post,
  });
  if (!newPost?.post?.id) {
    return undefined;
  }
  return newPost.post;
};

export const updatePost = async (
  id: string,
  post: Partial<JSONPost>,
  publish?: boolean,
) => {
  const body = {
    publish,
    ...post,
    id,
  };
  const updatedPost = await apiFetch<JSONPost>('posts', {
    method: 'put',
    body,
  });
  return updatedPost;
};

export const unpublishPost = async (id: string) =>
  await apiFetch<UnpublishRouteResponse>(`posts/${id}/unpublish`, {
    method: 'post',
  });

/**
 * Emails / subscribers API fns
 */
export const getRecipientsForPost = async (
  postId: string,
): Promise<SubscribersRouteResponse['GET']> =>
  await apiFetch(`posts/${postId}/subscribers`);

export const sendEmailsToSubscribers = async (
  postId: string,
  recipients: Recipient[],
): Promise<SubscribersRouteResponse['POST']> =>
  apiFetch(`/posts/${postId}/subscribers`, {
    body: { recipients },
    method: 'post',
  });
