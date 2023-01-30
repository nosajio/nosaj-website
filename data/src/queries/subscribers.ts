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
export const confirmSubscriber = async (token: string) => {
  const [confirmedSubscriber] = await query<Subscriber>(
    'update subscribers set confirmed_email=true where confirm_token=$1 returning *',
    [token],
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

/**
 * Get a subscriber by their email address
 */
export const getSubscriberByEmail = async (email: string) => {
  const [subscriber] = await query<Subscriber>(
    'select * from subscribers where email=$1 limit 1',
    [email],
  );
  return subscriber || undefined;
};

/**
 * Remove a subscriber using their token, unsubscribing them from the newsletter
 */
export const removeSubscriber = async (token: string) => {
  const [subscriber] = await query<Subscriber>(
    `delete from subscribers where confirm_token = $1 returning *`,
    [token],
  );
  if (!subscriber) {
    return undefined;
  }
  console.log(
    'Removed a subscriber: %s. They joined on: %s',
    subscriber.email,
    subscriber.subscribed_date,
  );
  return subscriber;
};
