import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
} from 'next/types';
import { ironSessionCookieConfig } from '../config/auth';

export const withSessionSsr = <
  P extends {
    [key: string]: unknown;
  } = {
    [key: string]: unknown;
  },
>(
  handler: (
    context: GetServerSidePropsContext,
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) => withIronSessionSsr(handler, ironSessionCookieConfig);
