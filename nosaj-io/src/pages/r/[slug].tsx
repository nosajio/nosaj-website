import { Page, Section, Subscribe } from 'components';
import { dbPostToJSON, JSONPost, parsePost, Post } from 'data';
import { getPostBySlug } from 'data/server';
import { GetServerSideProps } from 'next';
import s from './read.module.scss';
import Head from 'next/head';

type ReadPageProps = {
  post: JSONPost;
};

type ReadPageParams = {
  slug: string;
};

export const getServerSideProps: GetServerSideProps<
  ReadPageProps,
  ReadPageParams
> = async ({ req, params }) => {
  const slug = params?.slug;

  if (!slug) {
    return {
      notFound: true,
    };
  }

  const post = dbPostToJSON(await getPostBySlug(slug));

  return {
    props: {
      post,
    },
  };
};

const ReadPage = ({ post: jsonPost }: ReadPageProps) => {
  const post = parsePost(jsonPost);

  return (
    <>
      <Head>
        <title>nosaj.io</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="" /> */}
      </Head>
      <Page>
        <div className={s.read}>
          <article className={s.read__article}>
            <header className={s.read__head}>
              <h1 className={s.read__title}>{post.title}</h1>
              {post.subtitle && (
                <p className={s.read__subline}>{post.subtitle}</p>
              )}
              <span className={s.read__date}>{post.pubdate_str}</span>
            </header>
            <section
              className={s.read__body}
              dangerouslySetInnerHTML={{ __html: post.body_html }}
            />
          </article>
          <section className={s.read__footer}>
            <header className={s.read__footerHead}>
              <h1 className={s.read__footerTitle}>Thanks for reading!</h1>
              <p className={s.read__footerSubtitle}>
                If you enjoyed this post, subscribe for more posts in the
                future.
              </p>
            </header>
            <Subscribe className={s.read__subscribe} />
          </section>
        </div>
      </Page>
    </>
  );
};

export default ReadPage;
