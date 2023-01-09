import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { saveNewPost } from 'utils/api';
import { withSessionSsr } from 'utils/sessionHelpers';
import s from './postPage.module.scss';

type NewPostRouteProps = {};

const Editor = dynamic(
  () => import('components/postEditor').then(mod => mod.default),
  { ssr: false },
);

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

  return {
    props: {},
  };
});

const NewPostRoute = () => {
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [post, setPost] = useState<string>('');
  const router = useRouter();

  const handleChange = (
    field: 'title' | 'subtitle' | 'post',
    value: string,
  ) => {
    switch (field) {
      case 'post':
        setPost(value);
        break;
      case 'subtitle':
        setSubtitle(value);
        break;
      case 'title':
        setTitle(value);
        break;
    }
  };

  // Once the title is set, save the post as a new post and redirect to the edit
  // post route where autosaving is active
  const handleSetTitle = (title: string) => {
    // Save the post
    saveNewPost(title).then(post => {
      if (!post) return;
      router.replace(`/posts/${post.id}`);
    });
  };

  return (
    <>
      <Head>
        <title>New post</title>
        <meta charSet="utf-8" />
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div className={s.container}>
          <div className={s.page_with_aside}>
            <section className={clsx(s.page_padding, s.main_section)}>
              <div className={s.editor}>
                <Editor
                  onSetTitle={handleSetTitle}
                  onChange={handleChange}
                  post={post}
                  title={title}
                  subtitle={subtitle}
                />
              </div>
            </section>
            <aside className={clsx(s.page_padding, s.sidebar)}>
              {/* <button>Publish post</button> */}
            </aside>
          </div>
        </div>
      </main>
    </>
  );
};

export default NewPostRoute;
