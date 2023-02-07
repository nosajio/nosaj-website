import { Post, User } from 'data';
import { connect, unpublishPost } from 'data/server';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler } from 'next';
import { ironSessionCookieConfig } from '../../../../config/auth';

connect();

export type UnpublishRouteResponse = {
  post?: Post;
};

/**
 * Unpublish API
 *
 * POST: unpublish the post id passed into the URL
 */
const unpublishApiRoute: NextApiHandler<UnpublishRouteResponse> = async (
  req,
  res,
) => {
  const query = req.query;
  const user = req.session.user as User;

  if (typeof query.postId !== 'string') {
    return res.status(404).end();
  }

  if (!user) {
    return res.status(401);
  }

  switch (req.method) {
    case 'POST': {
      const updatedPost = await unpublishPost(query.postId);
      return res.json({
        post: updatedPost,
      });
    }

    default:
      return res.status(404).end();
  }
};

export default withIronSessionApiRoute(
  unpublishApiRoute,
  ironSessionCookieConfig,
);
