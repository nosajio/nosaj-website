import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
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
        <EditPostPage
          bodyMd={md}
          title={title}
          subtitle={subtitle}
          slug={slug}
          onChange={handleChange}
          onSave={console.log}
        />
      </main>
    </>
  );
};

export default NewPostRoute;
