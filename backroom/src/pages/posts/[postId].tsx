import clsx from 'clsx';
import throttle from 'lodash.throttle';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import { JSONPost } from 'types/data';
import { updatePost } from 'utils/api';
import { dbPostToJSON, getPost } from 'utils/data';
import { withSessionSsr } from 'utils/sessionHelpers';
import s from './postPage.module.scss';

type EditPostRouteProps = {
  post: JSONPost;
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
  const post = dbPostToJSON(await getPost(postId));

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

const EditPostRoute = ({ post: initialPost }: EditPostRouteProps) => {
  const [post, setPost] = useState<JSONPost>(initialPost);
  const [title, setTitle] = useState<string>(post?.title ?? '');
  const [subtitle, setSubtitle] = useState<string>(post?.subtitle ?? '');
  const [postHTML, setPostHTML] = useState<string>(post?.body_html ?? '');
  const [saveStatus, setSaveStatus] = useState<'unsaved' | 'saving' | 'saved'>(
    'saved',
  );
  const [slug, setSlug] = useState<string | undefined>(post?.slug);

  const autosavePost = useCallback(
    async (field: 'title' | 'subtitle' | 'post' | 'slug', value: string) => {
      if (!post?.id || saveStatus === 'saving') return;
      const updateKey = field === 'post' ? 'body_html' : field;
      const updateRec = {
        ...post,
        body_html: postHTML,
        subtitle,
        title,
        slug,
        [updateKey]: value,
      };
      setSaveStatus('saving');
      const updatedPost = await throttledUpdatePost(post.id, updateRec);
      setPost(updatedPost ?? post);
      setSaveStatus('saved');
    },
    [post, postHTML, saveStatus, slug, subtitle, title],
  );

  const handleChange = (
    field: 'title' | 'subtitle' | 'post' | 'slug',
    value: string,
  ) => {
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
      case 'slug':
        setSlug(value);
        break;

      default:
        // Don't autosave unless one of the above fields were changed
        return;
    }
    autosavePost(field, value);
  };

  const handlePublish = async () => {
    if (!post.id) return;
    const updatedPost = await updatePost(post.id, post, true);
    setPost(updatedPost);
  };

  const publishUI = () => (
    <>
      <label className={s.input_field}>
        <span className={s.field_label}>Slug</span>
        <input
          value={slug}
          onChange={e => handleChange('slug', e.target.value)}
          type="text"
          className={s.field_input}
        />
      </label>
      <button className={s.main_button} onClick={handlePublish}>
        Publish post
      </button>
    </>
  );

  const pageTitle = `Edit: ${post.title}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta charSet="utf-8" />
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div className={clsx(s.container, s.with_aside)}>
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
              {post.draft && publishUI()}
            </aside>
          </div>
        </div>
      </main>
    </>
  );
};

export default EditPostRoute;
