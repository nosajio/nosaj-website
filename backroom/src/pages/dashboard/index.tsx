import clsx from 'clsx';
import { dbPostToJSON, JSONPost, User } from 'data';
import { getPosts } from 'data/server';
import Head from 'next/head';
import Link from 'next/link';
import { withSessionSsr } from 'utils/sessionHelpers';
import s from './dashboard.module.scss';

type DashboardProps = {
  user: User;
  drafts: JSONPost[];
  published: JSONPost[];
};

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const user = req.session.user;
  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }
  const posts = (await getPosts()).map(dbPostToJSON);
  const [drafts, published] = posts.reduce(
    ([d, p], curr) => (curr.draft ? [[...d, curr], p] : [d, [...p, curr]]),
    [[], []] as JSONPost[][],
  );
  return {
    props: { user, drafts, published },
  };
});

const DashboardRoute = ({ user, published, drafts }: DashboardProps) => {
  return (
    <>
      <Head>
        <title>🚧 Backroom</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div className={s.container}>
          <div className={s.page_with_aside}>
            <section className={clsx(s.page_padding, s.content)}>
              <div className={s.content_section}>
                <h1 className={s.section_title}>Posts</h1>
                <div className={s.posts_list}>
                  {published.map(post => (
                    <div key={post.id} className={s.post_row}>
                      <h2 className={s.post_row_title}>{post.title}</h2>
                      <div className={s.post_row_options}>
                        <a
                          href={`/posts/${post.id}`}
                          className={s.post_row_option}
                        >
                          Edit
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={s.content_section}>
                <h1 className={s.section_title}>Drafts</h1>
                <div className={s.posts_list}>
                  {drafts.map(post => (
                    <div key={post.id} className={s.post_row}>
                      <h2 className={s.post_row_title}>{post.title}</h2>
                      <div className={s.post_row_options}>
                        <a
                          href={`/posts/${post.id}`}
                          className={s.post_row_option}
                        >
                          Edit
                        </a>
                        <a className={s.post_row_option}>Delete</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className={clsx(s.aside, s.page_padding)}>
              <Link href="/posts/new" className={s.main_button}>
                New post
              </Link>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default DashboardRoute;
