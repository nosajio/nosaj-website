import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler } from 'next';
import { ironSessionCookieConfig } from '../../config/auth';

const logoutRoute: NextApiHandler = async (req, res) => {
  if (!req.session?.user) {
    res.status(404).end();
    return;
  }
  req.session.destroy();
  res.json({ success: true });
};

export default withIronSessionApiRoute(logoutRoute, ironSessionCookieConfig);
