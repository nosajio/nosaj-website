import clsx from 'clsx';
import throttle from 'lodash.throttle';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import { Post, JSONPost } from 'types/data';
import { updatePost } from 'utils/api';
import { getPost } from 'utils/data';
import { withSessionSsr } from 'utils/sessionHelpers';
import s from './newPage.module.scss';

type EditPostRouteProps = {
  post: Partial<JSONPost>;
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
  const postRes = await getPost(postId);
  const post = {
    ...postRes,
    pubdate:
      postRes?.pubdate instanceof Date ? postRes.pubdate.toUTCString() : null,
  };

  return {
    props: {
      post,
    },
  };
});

// const diffPost = (saved: Partial<Post>, next: Partial<Post>): boolean => {
//   return (
//     saved.body_html !== next.body_html ||
//     saved.title !== next.title ||
//     saved.subtitle !== next.subtitle
//   );
// };

const throttledUpdatePost = throttle(
  async (postId: string, post: Partial<JSONPost>) => {
    const updated = await updatePost(postId, post);
    return updated;
  },
  5000,
);

const EditPostRoute = ({ post }: EditPostRouteProps) => {
  const [title, setTitle] = useState<string>(post?.title ?? '');
  const [subtitle, setSubtitle] = useState<string>(post?.subtitle ?? '');
  const [postHTML, setPostHTML] = useState<string>(post?.body_html ?? '');
  const [saveStatus, setSaveStatus] = useState<'unsaved' | 'saving' | 'saved'>(
    'saved',
  );
  // const savingRef = useRef<boolean>(false); // Use to block saving if it's already in progress
  // const lastSaveRef = useRef<Partial<Post>>(post);

  const autosavePost = useCallback(
    async (field: 'title' | 'subtitle' | 'post', value: string) => {
      if (!post?.id || saveStatus === 'saving') return;
      const updateKey = field === 'post' ? 'body_html' : field;
      const updateRec = {
        ...post,
        body_html: postHTML,
        subtitle,
        title,
        [updateKey]: value,
      };
      setSaveStatus('saving');
      await throttledUpdatePost(post.id, updateRec);
      setSaveStatus('saved');
    },
    [post, postHTML, saveStatus, subtitle, title],
  );

  const handleChange = (
    field: 'title' | 'subtitle' | 'post',
    value: string,
  ) => {
    console.log('change %s', field);
    setSaveStatus('unsaved');
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

      default:
        // Don't autosave unless one of the above fields were changed
        return;
    }
    autosavePost(field, value);
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
