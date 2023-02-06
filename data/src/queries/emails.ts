import { query } from '../../server';
import { SentEmail } from '../../types';

export const addSentEmails = async (postId: string, recipientIds: string[]) => {
  const values = recipientIds.flatMap(rid => [postId, rid]);
  let n = 1;
  const valuesReplacements = Array.from(new Array(recipientIds.length))
    .map(() => `($${n++}, $${n++})`)
    .join(', ');
  await query<SentEmail>(
    `insert into sent_emails(post, subscriber) values ${valuesReplacements} returning *`,
    values,
  );
};
