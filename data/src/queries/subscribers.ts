import { query } from '../db';
import { Subscriber } from '../types/model';

/**
 * Save a new newsletter subscriber
 */
export const newSubscriber = async (email: string) => {
  const [subscriber] = await query<Subscriber>(
    'insert into subscribers (email) values($1) returning *',
    [email],
  );
  return subscriber;
};

/**
 * Mark a subscriber as confirmed
 */
export const confirmSubscriber = async (email: string, token: string) => {
  const [confirmedSubscriber] = await query<Subscriber>(
    'update subscribers set confirmed_email=true where email=$1 and confirm_token=$2 returning *',
    [email, token],
  );
  return confirmedSubscriber;
};

/**
 * Get a subscriber by their confirmation token
 */
export const getSubscriberByToken = async (token: string) => {
  const [subscriber] = await query<Subscriber>(
    'select * from subscribers where confirm_token=$1',
    [token],
  );
  return subscriber;
};

export const getSubscriberByEmail = async (email: string) => {
  const [subscriber] = await query<Subscriber>(
    'select * from subscribers where email=$1 limit 1',
    [email],
  );
  return subscriber || undefined;
};
