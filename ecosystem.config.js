const KEY_FILE = process.env.KEY_FILE;
const SSH_USER = process.env.SSH_USER;
const SSH_HOST = process.env.SSH_HOST;

if (!(KEY_FILE && SSH_USER && SSH_HOST)) {
  console.log('fyi; running ecosystem file without ssh vars');
}

const universalEnv = {
  NODE_ENV: 'production',

  PGHOST: process.env.PGHOST,
  PGUSER: process.env.PGUSER,
  PGPASSWORD: process.env.PGPASSWORD,
  PGDATABASE: process.env.PGDATABASE,
  PGPORT: process.env.PGPORT,

  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
};

module.exports = {
  apps: [
    {
      script: 'npm run:nosaj',
      watch: false,
      name: 'nosaj.io',
      autorestart: true,
      instances: 1,
      max_restarts: 10,
      env: {
        ...universalEnv,
      },
    },
    {
      script: 'npm run:backroom',
      watch: false,
      name: 'backroom',
      instances: 1,
      max_restarts: 10,
      autorestart: true,
      env: {
        ...universalEnv,
        SESSION_PASSWORD: process.env.SESSION_PASSWORD,
      },
    },
  ],

  deploy: {
    production: {
      key: KEY_FILE,
      user: SSH_USER,
      host: SSH_HOST,
      ref: 'origin/master',
      repo: 'https://github.com/nosajio/nosaj-website',
      path: '/home/apps/nosajio_production',
      'post-deploy':
        'pnpm install -r && pnpm build && pm2 reload ecosystem.config.js --env production',
    },
  },
};
