import { Page, Subscribe } from 'components';
import { dbPostToJSON, JSONPost, parsePost } from 'data';
import { getPost } from 'data/server';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import s from './read.module.scss';

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

const ReadPage = ({ post: jsonPost }: ReadPageProps) => {
  const post = parsePost(jsonPost, true);

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.subtitle} />
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
            {post.cover_image && (
              <section className={s.read__cover}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={s.read__coverImg}
                  src={post.cover_image}
                  alt={`Cover image for ${post.title}`}
                />
              </section>
            )}
            <section
              className={s.read__body}
              dangerouslySetInnerHTML={{ __html: post.body_html }}
            />
          </article>
        </div>
      </Page>
    </>
  );
};

export default ReadPage;
