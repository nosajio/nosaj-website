import { query } from '../../server';
import { Post, SentEmail, Subscriber } from '../../types';

export const addSentEmails = async (post: Post, recipients: Subscriber[]) => {
  const values = recipients.flatMap(r => [post.id, r.id]);
  let n = 1;
  const valuesReplacements = Array.from(new Array(recipients.length))
    .map(() => `($${n++}, $${n++})`)
    .join(', ');
  await query<SentEmail>(
    `insert into sent_emails(post, subscriber) values ${valuesReplacements} returning *`,
    values,
  );
};
