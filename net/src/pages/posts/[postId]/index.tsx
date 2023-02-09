import SendEmailsNotification from 'components/sendEmailsNotification';
import { dbPostToJSON, JSONPost } from 'data';
import { getPost } from 'data/server';
import useNotification from 'hooks/useNotification';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { unpublishPost, updatePost } from 'utils/api';
import { withSessionSsr } from 'utils/sessionHelpers';
import { nosajUrl } from 'utils/url';

type EditPostRouteProps = {
  post: JSONPost;
};

const EditPostPage = dynamic(
  () => import('components/editPostPage').then(mod => mod.default),
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

const EditPostRoute = ({ post: initialPost }: EditPostRouteProps) => {
  const [mode, setMode] = useState<'edit' | 'saving' | 'error' | 'publishing'>(
    'edit',
  );
  const [draft, setDraft] = useState<boolean>(initialPost.draft);
  const [pubdate, setPubdate] = useState<undefined | Date>(
    initialPost.pubdate ? new Date(initialPost.pubdate) : undefined,
  );
  const [title, setTitle] = useState<string>(initialPost.title);
  const [subtitle, setSubtitle] = useState<string>(initialPost?.subtitle ?? '');
  const [md, setMd] = useState<string>(initialPost.body_md);
  const [slug, setSlug] = useState<string>(initialPost.slug);
  const [coverUrl, setCoverUrl] = useState<string>(
    initialPost?.cover_image ?? '',
  );
  const router = useRouter();
  const postPublished = Object.keys(router.query).includes('published');

  const { newConfirmation, newNotification, clearNotification } =
    useNotification();

  useEffect(() => {
    if (!postPublished) {
      clearNotification();
      return;
    }

    newNotification({
      timeout: 0,
      children: <SendEmailsNotification post={initialPost} />,
    });
  }, [clearNotification, initialPost, newNotification, postPublished]);

  const handleChange = (
    field: 'title' | 'subtitle' | 'body_md' | 'slug' | 'cover_url',
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
      case 'slug':
        setSlug(value);
        break;
      case 'cover_url':
        setCoverUrl(value);
        break;
    }
  };

  const handleUnpublish = useCallback(async () => {
    setMode('publishing');
    const { post } = await unpublishPost(initialPost.id);
    const updatedPost: JSONPost = {
      ...initialPost,
      title,
      body_md: md,
      slug,
      subtitle,
    };
    await updatePost(initialPost.id, updatedPost, false);
    setDraft(post?.draft ?? true);
    setPubdate(post?.pubdate ?? undefined);
    setMode('edit');
    await router.replace(`/posts/${initialPost.id}`);
  }, [initialPost, md, router, slug, subtitle, title]);

  const handleSave = useCallback(
    async (publish: boolean) => {
      // Show a confirm notification before saving
      if (publish) {
        const confirmPublish = await newConfirmation(
          'Hey, you sure you wanna publish this post?',
        );
        if (!confirmPublish) return;
        setMode('publishing');
      } else {
        setMode('saving');
      }

      const updatedPost: JSONPost = {
        ...initialPost,
        title,
        body_md: md,
        slug,
        subtitle,
      };
      const apiPost = await updatePost(
        initialPost.id,
        updatedPost,
        publish || false,
      );
      setMode('edit');
      setDraft(apiPost.draft);
      if (apiPost.pubdate) {
        setPubdate(new Date(apiPost.pubdate));
      }
      if (publish) {
        await router.replace(`/posts/${initialPost.id}?published`);
      }
    },
    [initialPost, md, newConfirmation, router, slug, subtitle, title],
  );

  const handlePreview = useCallback(() => {
    const url = `${nosajUrl}/draft/${initialPost.id}`;
    window.open(url, '_blank');
  }, [initialPost.id]);

  const pageTitle = `Edit: ${title}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta charSet="utf-8" />
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <EditPostPage
          mode={mode}
          published={postPublished}
          bodyMd={md}
          title={title}
          subtitle={subtitle}
          slug={slug}
          coverUrl={coverUrl}
          onChange={handleChange}
          onSave={() => handleSave(false)}
          onPublish={() => handleSave(true)}
          onUnpublish={() => handleUnpublish()}
          onPreview={handlePreview}
        />
      </main>
    </>
  );
};

export default EditPostRoute;
