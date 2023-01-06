import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Post } from 'types/data';
import { saveNewPost } from 'utils/api';
import { getPost } from 'utils/data';
import { withSessionSsr } from 'utils/sessionHelpers';
import s from './newPage.module.scss';

type EditPostRouteProps = {
  post: Partial<Post>;
};

const Editor = dynamic(
  () => import('components/postEditor').then(mod => mod.default),
  { ssr: false },
);

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
  const post = await getPost(postId);

  return {
    props: {
      post,
    },
  };
});

const diffPost = (saved: Partial<Post>, next: Partial<Post>): boolean => {
  return (
    saved.body_html !== next.body_html ||
    saved.title !== next.title ||
    saved.subtitle !== next.subtitle
  );
};

const EditPostRoute = ({ post }: EditPostRouteProps) => {
  const [title, setTitle] = useState<string>(post?.title ?? '');
  const [subtitle, setSubtitle] = useState<string>(post?.subtitle ?? '');
  const [postHTML, setPostHTML] = useState<string>(post?.body_html ?? '');
  const [saveStatus, setSaveStatus] = useState<'unsaved' | 'saving' | 'saved'>(
    'unsaved',
  );
  const savingRef = useRef<boolean>(false); // Use to block saving if it's already in progress
  const lastSaveRef = useRef<Partial<Post>>(post);

  const autosavePost = async () => {
    if (savingRef.current) return;
    savingRef.current = true;
    if (
      diffPost(lastSaveRef.current, { title, subtitle, body_html: postHTML })
    ) {
      setSaveStatus('saving');
      lastSaveRef.current = {
        ...post,
        body_html: postHTML,
        subtitle,
        title,
      };
      setSaveStatus('saved');
    }
    savingRef.current = false;
  };

  const handleChange = (
    field: 'title' | 'subtitle' | 'post',
    value: string,
  ) => {
    switch (field) {
      case 'post':
        setPostHTML(value);
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
                  saveStatus={saveStatus}
                  onChange={handleChange}
                  post={postHTML}
                  title={title}
                  subtitle={subtitle}
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
