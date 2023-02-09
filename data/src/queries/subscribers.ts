import { query } from '../db';
import { Post, subscriber, Subscriber } from '../types/model';

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

/**
 * Get all confirmed subscribers that haven't already received an email for the
 * current post. This is used to decide who to send emails to when a post is
 * published.
 */
export const getRecipients = async (
  postId: Post['id'],
): Promise<Subscriber[]> => {
  const recipients = await query<Subscriber>(
    `
    select *
      from subscribers
      where confirmed_email = true
        and id not in (select subscriber from sent_emails where post = $1)
    `,
    [postId],
  );
  return recipients;
};

/**
 * Get the send status for this post across all confirmed subscribers
 */
export const getSendStats = async (
  postId: Post['id'],
): Promise<{ sent: Subscriber[]; unsent: Subscriber[] }> => {
  const all = await query<Subscriber & { sent?: boolean }>(
    `
    select s.*,
      exists(select 1
            from sent_emails e
            where e.subscriber = s.id and e.post = $1) as sent
    from subscribers s
    where confirmed_email = true
    `,
    [postId],
  );

  const sent = all.filter(r => r.sent).map(r => subscriber.parse(r));
  const unsent = all.filter(r => !r.sent).map(r => subscriber.parse(r));

  return {
    sent,
    unsent,
  };
};
