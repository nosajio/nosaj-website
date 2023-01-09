import { z } from 'zod';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler } from 'next';
import { getPost, newPost, updatePost } from 'utils/data';
import { ironSessionCookieConfig } from '../../../config/auth';
import { Post, postObject, jsonPost, User } from '../../../types/data';
import { connect } from '../../../utils/db';

connect();

type PostsRouteResponse = Partial<Post>;

const saveNewPostBody = z.object({
  title: z.string(),
});

// type SavePostBody = z.infer<typeof saveNewPostBody>;

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
  const bodyJson = JSON.parse(req.body ?? {});
  const user = req.session.user as User;

  if (!user) {
    return res.status(401).json({});
  }

  switch (req.method) {
    // Update a post
    case 'PUT': {
      const body = jsonPost.partial().required({ id: true }).parse(bodyJson);
      const post = await updatePost(body.id, body);
      res.status(201).json(post);
      return;
    }

    // Save new post
    case 'POST': {
      const body = saveNewPostBody.parse(bodyJson);
      const [id, slug] = await handleSaveNewPost({
        userId: user.id,
        title: body.title,
      });
      const post = {
        id,
        slug,
        title: req.body.title,
      };
      res.json(post);
      return;
    }

    default: {
      return res.status(404).json({});
    }
  }
};

export default withIronSessionApiRoute(postsRoute, ironSessionCookieConfig);
