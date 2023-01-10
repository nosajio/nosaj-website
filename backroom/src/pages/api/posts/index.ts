import {
  connect,
  jsonPost,
  newPost,
  Post,
  publishPost,
  updatePost,
  User,
} from 'data';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler } from 'next';
import { z } from 'zod';
import { ironSessionCookieConfig } from '../../../config/auth';

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
      const { publish, ...body } = jsonPost
        .merge(z.object({ publish: z.boolean().optional() }))
        .parse(bodyJson);
      let post: Post;
      if (publish) {
        post = await publishPost(body.id, body);
      } else {
        post = await updatePost(body.id, body);
      }
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
