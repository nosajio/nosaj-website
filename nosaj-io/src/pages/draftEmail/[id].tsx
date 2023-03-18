import { Page, Subscribe } from 'components';
import { dbPostToJSON, JSONPost, parsePost } from 'data';
import { getPost } from 'data/server';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import PostEmail from 'net/src/components/emailTemplates/post';

type ReadPageProps = {
  post: JSONPost;
};

type ReadPageParams = {
  id: string;
};

export const getServerSideProps: GetServerSideProps<
  ReadPageProps,
  ReadPageParams
> = async ({ req, params }) => {
  const id = params?.id;

  if (!id) {
    return {
      notFound: true,
    };
  }

  const post = dbPostToJSON(await getPost(id));

  if (!post.draft) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
};

const EmailDraftPage = ({ post: jsonPost }: ReadPageProps) => {
  const post = parsePost(jsonPost, true);

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.subtitle} />
        <meta property="og:title" content={post.title} />
        <meta property="og:type" content="article" />
        {post?.cover_image && (
          <meta property="og:image" content={post.cover_image} />
        )}
      </Head>
      <PostEmail post={post} />
    </>
  );
};

export default EmailDraftPage;
