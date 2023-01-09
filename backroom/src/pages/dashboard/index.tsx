import Head from 'next/head';
import Link from 'next/link';
import { JSONPost, Post, User } from 'types/data';
import { dbPostToJSON, getPosts } from 'utils/data';
import { withSessionSsr } from 'utils/sessionHelpers';
import s from './dashboard.module.scss';

type DashboardProps = {
  user: User;
  posts: JSONPost[];
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
  return {
    props: { user, posts },
  };
});

const DashboardRoute = ({ user, posts }: DashboardProps) => {
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
            <section className={s.content}>
              <h1 className={s.section_title}>Posts</h1>
              <div className={s.posts_list}>
                {posts.map(post => (
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
            </section>
            <section className={s.aside}>
              <Link href="/posts/new" className={s.new_post_button}>
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
