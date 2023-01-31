import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { newEvent } from '../../server';
import { noreplySenderAddress, replyToAddress } from './utils';

const ses = new SESClient({ region: 'us-east-1' });

/**
 * Send any email using AWS SES
 */
export const sendEmail = async (
  email: string,
  subject: string,
  html: string,
  plain: string,
) => {
  try {
    const cmd = new SendEmailCommand({
      ReplyToAddresses: [replyToAddress],
      Destination: {
        ToAddresses: [email],
      },
      Source: noreplySenderAddress,
      Message: {
        Body: {
          Html: {
            Data: html,
          },
          Text: {
            Data: plain,
          },
        },
        Subject: {
          Data: subject,
        },
      },
    });
    const receipt = await ses.send(cmd);
    if (!receipt.MessageId) {
      console.error(
        'Failed to send confirm email to: %s. Details: %o',
        email,
        receipt,
      );
      return false;
    } else {
      console.log('Send email to %s, MessageId: %s', email, receipt.MessageId);
      return true;
    }
  } catch (err) {
    console.error(err);

    await newEvent('failed_operation', {
      operation: 'send_email',
      error: err instanceof Error ? err.message : '',
    });

    return false;
  }
};
