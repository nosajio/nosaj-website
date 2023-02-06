export const nosajUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3003'
    : 'https://nosaj.io';

export const netUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://net.nosaj.io';
