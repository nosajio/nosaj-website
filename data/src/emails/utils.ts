/**
 * Define globals and helpers for email operations
 */
export const rootNosajURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:3003`
    : 'https://nosaj.io';

export const getUnsubscribeLink = (token: string, emailId?: string) =>
  `${rootNosajURL}/unsubscribe?token=${token}&eid=${emailId ?? 'na'}`;

export const noreplySenderAddress = 'Jason<noreply@email.nosaj.io>';
export const replyToAddress = 'newsletter@nosaj.io';
