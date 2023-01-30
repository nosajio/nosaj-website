import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { getSubscriberByEmail } from 'data/server';

const ses = new SESClient({ region: 'us-east-1' });

const rootNosajURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:3003`
    : 'https://nosaj.io';

const getConfirmLink = (token: string) => `${rootNosajURL}?token=${token}`;

const getUnsubscribeLink = (token: string, emailId?: string) =>
  `${rootNosajURL}/unsubscribe?token=${token}&eid=${emailId ?? 'na'}`;

const noreplySenderAddress = 'Jason<noreply@email.nosaj.io>';
const replyToAddress = 'newsletter@nosaj.io';

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
    <a href="${confirmLink}">${confirmLink}</a>
  </p>
  <p>
    Thanks,<br/>Jason
  </p>
  <p>PS - changed your mind? <a href="${unsubscribeLink}">Unsubscribe</a></p>
  `;
  const emailPlain = `Please follow this link to confirm your email: ${confirmLink}`;

  // Send email
  try {
    const cmd = new SendEmailCommand({
      ReplyToAddresses: [replyToAddress],
      Destination: {
        ToAddresses: [subscriber.email],
      },
      Source: noreplySenderAddress,
      Message: {
        Body: {
          Html: {
            Data: emailHTML,
          },
          Text: {
            Data: emailPlain,
          },
        },
        Subject: {
          Data: 'Please confirm your email',
        },
      },
    });
    const receipt = await ses.send(cmd);
    if (!receipt.MessageId) {
      console.error(
        'Failed to send confirm email to: %s. Details: %o',
        subscriber.email,
        receipt,
      );
      return false;
    } else {
      console.log(
        'Sent email to %s, MessageId: %s',
        subscriber.email,
        receipt.MessageId,
      );
      return true;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};
