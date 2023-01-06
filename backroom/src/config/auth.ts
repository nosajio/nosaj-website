export const ironSessionCookieConfig = {
  cookieName: 'nosaj-io-session',
  password: process.env.SESSION_PASSWORD!,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};
