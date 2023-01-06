import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler } from 'next';
import { User } from '../../types/data';
import { ironSessionCookieConfig } from '../../config/auth';
import { connect } from '../../utils/db';

type AuthRouteResponse = {
  authenticated: boolean;
  user?: User;
};

connect();

const sessionRoute: NextApiHandler<AuthRouteResponse> = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(404).end();
  }

  const user = req.session.user;

  if (!user) {
    return res.json({ authenticated: false });
  }

  return res.json({ authenticated: true, user });
};

export default withIronSessionApiRoute(sessionRoute, ironSessionCookieConfig);
