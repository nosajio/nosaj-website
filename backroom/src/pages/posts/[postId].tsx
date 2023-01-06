import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Post } from 'types/data';
import { saveNewPost } from 'utils/api';
import { withSessionSsr } from 'utils/sessionHelpers';
import s from './newPage.module.scss';

type EditPostRouteProps = {
  post: Partial<Post>;
};

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

const EditPostRoute = () => {
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [post, setPost] = useState<string>('');
  const router = useRouter();
  const savingRef = useRef<boolean>(false);

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

  return (
    <>
      <Head>
        <title></title>
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
                  onChange={handleChange}
                  post={post}
                  title={title}
                  subtitle={subtitle}
                  autosave={false}
                />
              </div>
            </section>
            <aside className={clsx(s.page_padding, s.sidebar)}>
              <button>Publish post</button>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
};

export default EditPostRoute;
