import PostTemplate from 'components/emailTemplates/post';
import { dbPostToJSON, getUnsubscribeLink, JSONPost, parsePost } from 'data';
import { getPost } from 'data/server';
import Head from 'next/head';
import Link from 'next/link';
import { withSessionSsr } from 'utils/sessionHelpers';
import s from './preview.module.scss';

type EditPostRouteProps = {
  post: JSONPost;
};

export const getServerSideProps = withSessionSsr(async ({ params, req }) => {
  const user = req.session.user;

  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  const postId = params?.postId;
  if (typeof postId !== 'string') {
    return {
      redirect: {
        destination: '/posts/new',
        permanent: true,
      },
    };
  }
  const post = dbPostToJSON(await getPost(postId));

  return {
    props: {
      post,
    },
  };
});

const EditPostRoute = ({ post: jsonPost }: EditPostRouteProps) => {
  const post = parsePost(jsonPost);
  const pageTitle = `Preview ${post.title}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta charSet="utf-8" />
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div className={s.preview}>
          <div className={s.preview__toolbar}>
            <Link href={`/posts/${post.id}`}>&larr; Back to edit</Link>
          </div>
          <div className={s.preview__frame}>
            <PostTemplate post={post} />
          </div>
        </div>
      </main>
    </>
  );
};

export default EditPostRoute;
