import { subscriber, User } from 'data';
import {
  addSentEmails,
  connect,
  getPost,
  getRecipients,
  newEvent,
  sendEmail,
} from 'data/server';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler } from 'next';
import {
  appendUnsubUrlToPlainEmail,
  generatePostTemplate,
  replaceTokenInHTML,
} from 'utils/emailTemplates';
import { z } from 'zod';
import { ironSessionCookieConfig } from '../../../../config/auth';

connect();

const recipient = subscriber.omit({
  subscribed_date: true,
  confirmed_email: true,
});

export type Recipient = z.infer<typeof recipient>;

export type SubscribersRouteResponse = {
  POST: {
    success: boolean;
    message?: string;
    status?: {
      sent: Recipient[];
      failed: Recipient[];
    };
  };
  GET: {
    recipients: Recipient[];
  };
};

const prepareEmail = async (
  postId: string,
): Promise<{ text: string; html: string; subject: string }> => {
  const post = await getPost(postId);
  const html = generatePostTemplate(post);
  return {
    html,
    text: post.body_md,
    subject: `${post.title}`,
  };
};

const sendEmailsToRecipients = async (
  recipients: Recipient[],
  postId: string,
): Promise<SubscribersRouteResponse['POST']['status']> => {
  try {
    const { text, html, subject } = await prepareEmail(postId);

    const emailOps = await Promise.all(
      recipients.map(async r => {
        const htmlWithUnsub = replaceTokenInHTML(html, r.confirm_token);
        const textWithUnsub = appendUnsubUrlToPlainEmail(text, r.confirm_token);
        const status = await sendEmail(
          r.email,
          subject,
          htmlWithUnsub,
          textWithUnsub,
        );
        return { recipient: r, status };
      }),
    );

    const sent = emailOps.filter(o => o.status).map(o => ({ ...o.recipient }));
    const failed = emailOps
      .filter(o => !o.status)
      .map(o => ({ ...o.recipient }));

    // Store a record of sent emails. This is mostly to avoid annoying
    // subscribers with duplicate emails
    await addSentEmails(
      postId,
      emailOps.map(o => o.recipient.id),
    );

    return { sent, failed };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Subscribers API
 * GET: returns the list of email recipients yet to receive this post by email.
 *
 * POST: takes a body object of { recipients: Recipient[] } and sends to all
 * recipients who are yet to receive this post by email.
 */
const emailsRoute: NextApiHandler<
  SubscribersRouteResponse['GET'] | SubscribersRouteResponse['POST']
> = async (req, res) => {
  const query = req.query;
  const user = req.session.user as User;

  if (typeof query.postId !== 'string') {
    return res.status(404).end();
  }

  if (!user) {
    return res.status(401).json({
      success: false,
    });
  }

  switch (req.method) {
    case 'POST': {
      const bodyJson =
        typeof req?.body === 'string' ? JSON.parse(req.body) : req?.body;
      const recipients = Array.isArray(bodyJson?.recipients)
        ? (bodyJson.recipients as unknown[]).map(r => recipient.parse(r))
        : [];

      // When there's no recipients, return with falsy success and a message
      if (recipients.length === 0) {
        return res.json({
          success: false,
          message: 'No recipients included in the body',
        });
      }

      console.log(
        'Sending emails to %s recipients for post: %s',
        recipients.length,
        query.postId,
      );

      // Generate then send emails to recipients
      try {
        const status = await sendEmailsToRecipients(recipients, query.postId);
        return res.json({
          success: true,
          status,
        });
      } catch (err) {
        await newEvent('failed_operation', {
          operation: 'send_emails_to_recipients',
          recipients,
          error: err instanceof Error ? err.message : err,
        });
        return res.json({
          success: false,
          message:
            'There was an internal error with sending emails to some recipients. Check the logs for more info',
        });
      }
    }

    case 'GET': {
      const recipients = (await getRecipients(query.postId)).map(s =>
        recipient.parse(s),
      );
      res.json({ recipients });
      return;
    }
  }
};

export default withIronSessionApiRoute(emailsRoute, ironSessionCookieConfig);
