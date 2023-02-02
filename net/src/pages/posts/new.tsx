import clsx from 'clsx';
import { newPost } from 'data';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { saveNewPost } from 'utils/api';
import { withSessionSsr } from 'utils/sessionHelpers';
import s from './postPage.module.scss';

const EditPostPage = dynamic(
  () => import('components/editPostPage').then(mod => mod.default),
  { ssr: false },
);

type NewPostRouteProps = {};

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
  const [md, setMd] = useState<string>('A beautiful story...');
  const [slug, setSlug] = useState<string>('');
  const router = useRouter();

  const handleChange = (
    field: 'title' | 'subtitle' | 'body_md' | 'slug',
    value: string,
  ) => {
    switch (field) {
      case 'body_md':
        setMd(value);
        break;
      case 'subtitle':
        setSubtitle(value);
        break;
      case 'title':
        setTitle(value);
        break;
    }
  };

  const handleSave = useCallback(
    (publish: boolean) => {
      if (publish) return;
      saveNewPost({
        body_html: null,
        body_md: md,
        cover_image: null,
        pubdate: null,
        slug,
        subtitle,
        title,
      }).then(post => {
        if (!post) {
          console.error('New post not returned from api');
          return;
        }
        router.replace(`/posts/${post.id}`);
      });
    },
    [md, router, slug, subtitle, title],
  );

  const handlePreview = useCallback(() => {}, []);

  return (
    <>
      <Head>
        <title>New post</title>
        <meta charSet="utf-8" />
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <EditPostPage
          newPost
          bodyMd={md}
          title={title}
          subtitle={subtitle}
          slug={slug}
          onChange={handleChange}
          onSave={handleSave}
          onPreview={handlePreview}
        />
      </main>
    </>
  );
};

export default NewPostRoute;
