import { ironSessionCookieConfig } from 'config/auth';
import { User } from 'data';
import { connect } from 'data/server';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler } from 'next';
import { authenticate } from 'utils/auth';

type AuthRouteResponse = {
  success?: boolean;
  user?: User;
};

type AuthRouteBody = {
  email: string;
  password: string;
};

connect();

const authRoute: NextApiHandler<AuthRouteResponse> = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(404).end();
  }

  const body = JSON.parse(req.body) as Partial<AuthRouteBody>;
  if (!body?.email || !body?.password) {
    return res.status(404).end();
  }

  const user = await authenticate(body.email, body.password);
  if (!user) {
    return res.status(404).end();
  }

  req.session.user = user;
  await req.session.save();

  return res.json({ success: true, user });
};

export default withIronSessionApiRoute(authRoute, ironSessionCookieConfig);
