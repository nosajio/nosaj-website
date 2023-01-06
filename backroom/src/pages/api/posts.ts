import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler } from 'next';
import { getPost, newPost } from 'utils/data';
import { ironSessionCookieConfig } from '../../config/auth';
import { Post, User } from '../../types/data';
import { connect } from '../../utils/db';

connect();

type PostsRouteResponse = Partial<Post>;

type SaveNewPostBody = Partial<Omit<Post, 'id' | 'author' | 'slug'>> & {
  title: string;
};

const handleSaveNewPost = async ({
  userId,
  title,
}: {
  title: string;
  userId: string;
}) => {
  return await newPost(title, userId);
};

const postsRoute: NextApiHandler<PostsRouteResponse> = async (req, res) => {
  let response: PostsRouteResponse = {};
  const user = req.session.user as User;

  if (!user) {
    return res.status(401).json({});
  }

  switch (req.method) {
    case 'POST': {
      const body = JSON.parse(req.body);
      const [id, slug] = await handleSaveNewPost({
        userId: user.id,
        title: body.title,
      });
      response = {
        id,
        slug,
        title: req.body.title,
      };
      res.json(response);
    }

    default: {
      return res.status(404).json({});
    }
  }
};

export default withIronSessionApiRoute(postsRoute, ironSessionCookieConfig);
