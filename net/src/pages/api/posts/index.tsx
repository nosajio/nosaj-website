import markdown from 'markdown-it';
import { JSONPost, jsonPost, Post, User } from 'data';
import { connect, newPost, publishPost, updatePost } from 'data/server';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler } from 'next';
import { sendNewsletters } from 'utils/emails';
import { generatePostTemplate } from 'utils/emailTemplates';
import { z } from 'zod';
import { ironSessionCookieConfig } from '../../../config/auth';

connect();

type PostsRouteResponse = Partial<Post>;

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
    return res.status(401).json({});
  }

  switch (req.method) {
    // Update a post
    case 'PUT': {
      const { publish, ...body } = jsonPost
        .merge(z.object({ publish: z.boolean().optional() }))
        .parse(bodyJson);

      // Parse Markdown into HTML
      body.body_html = mdToHtml(body.body_md);

      let post: Post;
      if (publish) {
        post = await publishPost(body.id, body);
        const postEmailHTML = generatePostTemplate(post);
        const postEmailText = body.body_md;
        await sendNewsletters(post, postEmailHTML, postEmailText);
      } else {
        post = await updatePost(body.id, body);
      }
      res.status(201).json(post);
      return;
    }

    // Save new post
    case 'POST': {
      const body = jsonPost.partial({ id: true }).parse({
        ...bodyJson,
        author: user.id,
        body_html: mdToHtml(bodyJson.body_md),
      });
      const post = await newPost(body);
      res.status(201).json(post);
      return;
    }

    default: {
      return res.status(404).json({});
    }
  }
};

export default withIronSessionApiRoute(postsRoute, ironSessionCookieConfig);
