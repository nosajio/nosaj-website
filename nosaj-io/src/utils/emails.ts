import {
  getSubscriberByEmail,
  getUnsubscribeLink,
  rootNosajURL,
  sendEmail,
} from 'data/server';

/**
 * Define globals and helpers for email operations
 */
const getConfirmLink = (token: string) => `${rootNosajURL}?token=${token}`;

/**
 * Send newsletter signup confirmation message
 */
export const sendConfirmEmail = async (email: string) => {
  // Get subscriber from db, ensure they're not yet confirmed
  const subscriber = await getSubscriberByEmail(email);
  if (subscriber.confirmed_email) {
    return false;
  }

  // Generate email body
  const confirmLink = getConfirmLink(subscriber.confirm_token);
  const unsubscribeLink = getUnsubscribeLink(
    subscriber.confirm_token,
    'confirm',
  );

  const emailHTML = `
  <p>
    Please click the link below to confirm your email:
  </p>
  <p> 
    <a href="${confirmLink}">Confirm.</a>
  </p>
  <p>
    Thanks,<br/>Jason
  </p>
  <p>PS - changed your mind? <a href="${unsubscribeLink}">Unsubscribe</a></p>
  `;
  const emailPlain = `Please follow this link to confirm your email: ${confirmLink}`;
  return await sendEmail(
    subscriber.email,
    'Please confirm your email',
    emailHTML,
    emailPlain,
  );
};
