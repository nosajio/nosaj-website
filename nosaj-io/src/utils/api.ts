import { ConfirmRouteResponse } from 'pages/api/confirm';
import { SubscribeRouteResponse } from 'pages/api/subscribe';

const apiRequest = async <R = undefined>(
  path: string,
  method: 'get' | 'post' = 'get',
  body?: Record<string, any>,
): Promise<R> => {
  const res = await fetch(path, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    mode: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(r => r.json());
  return res as R;
};

export const addNewSubscriber = async (email: string) =>
  await apiRequest<SubscribeRouteResponse>('/api/subscribe', 'post', { email });

export const confirmSubscriberEmail = async (token: string) =>
  await apiRequest<ConfirmRouteResponse>('/api/confirm', 'post', {
    token,
  });
