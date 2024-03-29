import { jsonPost, Post, User } from 'data';
import { connect, newPost, publishPost, updatePost } from 'data/server';
import { withIronSessionApiRoute } from 'iron-session/next';
import markdown from 'markdown-it';
import { NextApiHandler } from 'next';
import { z } from 'zod';
import { ironSessionCookieConfig } from '../../../config/auth';

connect();

export type PostsRouteResponse = {
  published: boolean;
  post: Partial<Post>;
};

// type SavePostBody = z.infer<typeof saveNewPostBody>;

const markdownParser = markdown({
  html: true,
  breaks: true,
  typographer: true,
});

const mdToHtml = (md: string) => {
  const html = markdownParser.render(md);
  return html;
};

const postsRoute: NextApiHandler<PostsRouteResponse> = async (req, res) => {
  const bodyJson = JSON.parse(req.body ?? {});
  const user = req.session.user as User;

  if (!user) {
    return res.status(401).end();
  }

  switch (req.method) {
    // Update a post
    case 'PUT': {
      const { publish, ...body } = jsonPost
        .merge(z.object({ publish: z.boolean().optional() }))
        .parse({
          ...bodyJson,
          body_html: mdToHtml(bodyJson.body_md),
        });

      const post = publish
        ? await publishPost(body.id, body)
        : await updatePost(body.id, body);

      return res.json({
        published: publish || false,
        post,
      });
    }

    // Save new post
    case 'POST': {
      // Don't expect an ID in the post body for POST requests. The ID is
      // generated by the database, and this will be the first time the server
      // sees this post. ID is made by the database.
      const body = jsonPost.partial({ id: true }).parse({
        ...bodyJson,
        author: user.id,
        body_html: mdToHtml(bodyJson.body_md),
      });

      const post = await newPost(body);

      return res.status(201).json({
        published: false,
        post,
      });
    }

    default: {
      return res.status(404).end();
    }
  }
};

export default withIronSessionApiRoute(postsRoute, ironSessionCookieConfig);
