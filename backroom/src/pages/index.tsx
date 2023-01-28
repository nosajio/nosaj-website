import { withIronSessionSsr } from 'iron-session/next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEventHandler, useEffect, useState } from 'react';
import { User } from 'data';
import { ironSessionCookieConfig } from 'config/auth';
import { newSession } from 'utils/api';

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  const user = req.session.user;
  if (!user) {
    return {
      props: {},
    };
  }
  console.log('logged in user: %o', user);
  return {
    redirect: {
      destination: '/dashboard',
      permanent: true,
    },
  };
}, ironSessionCookieConfig);

const LoginRoute = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [user, setUser] = useState<User>();

  const handleSubmit: FormEventHandler = async e => {
    e.preventDefault();
    const userRes = await newSession(email, password);
    if (!userRes) {
      return;
    }
    setUser(userRes);
  };

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [router, user]);

  return (
    <>
      <Head>
        <title>Jason&apos;s room</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Login</button>
        </form>
      </main>
    </>
  );
};

export default LoginRoute;
