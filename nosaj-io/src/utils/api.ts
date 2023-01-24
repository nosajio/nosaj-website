import { Subscriber } from 'data';

export const addNewSubscriber = async (email: string) => {
  const res = await fetch('/api/subscribe', {
    method: 'post',
    body: JSON.stringify({ email }),
    mode: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(r => r.json());
  if (Object.keys(res?.subscriber ?? {}).includes('email')) {
    return res.subscriber as Subscriber;
  }
  return undefined;
};
