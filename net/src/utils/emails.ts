import { parsePost, Post } from 'data';
import { addSentEmails, getRecipients, sendEmail } from 'data/server';
import { replaceTokenInHTML } from './emailTemplates';

export const sendNewsletters = async (
  post: Post,
  html: string,
  plain: string,
) => {
  const parsedPost = parsePost(post);
  // Get all subscribers who haven't already been sent this post
  const subscribers = await getRecipients(parsedPost);
  // Send an email to each recipient
  const sentTo = await Promise.all(
    subscribers.map(s =>
      sendEmail(
        s.email,
        parsedPost.title,
        replaceTokenInHTML(html, s.confirm_token),
        plain,
      ).then(() => s),
    ),
  );
  // Log sent emails
  await addSentEmails(parsedPost, sentTo);
};
