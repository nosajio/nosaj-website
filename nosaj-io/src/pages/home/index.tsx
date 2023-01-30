import clsx from 'clsx';
import { Notification, Page, Section, Subscribe } from 'components';
import { dateStr, dbPostToJSON, JSONPost, parsePost } from 'data';
import { confirmSubscriber, getPosts, newEvent } from 'data/server';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import s from './home.module.scss';

type HomePageQuerystring = {
  token?: string;
  confirmed?: string;
};

type HomePageProps = {
  posts: JSONPost[];
  confirmEmail: null | boolean;
};

export const getServerSideProps: GetServerSideProps<
  HomePageProps,
  HomePageQuerystring
> = async ({ query }) => {
  let confirmEmail = null;
  const { token, confirmed } = query ?? {};

  if (typeof token === 'string') {
    const subscriber = await confirmSubscriber(token);
    if (subscriber) {
      await newEvent('confirm_email', {
        token,
        email_address: subscriber?.email,
      });
    } else {
      await newEvent('failed_operation', {
        operation: 'confirm_email',
        confirm_token: token,
      });
    }

    return {
      redirect: {
        destination: `/${subscriber.confirmed_email ? '?confirmed' : ''}`,
        permanent: true,
      },
    };
  }

  if (typeof confirmed !== 'undefined') {
    confirmEmail = true;
  }

  const posts = (await getPosts()).map(dbPostToJSON);
  return {
    props: {
      posts,
      confirmEmail,
    },
  };
};

const homePageContent = {
  headline: (
    <>Hi, I&apos;m Jason. Engineer, designer, and builder of startups.</>
  ),
  bio: [
    <>
      I&apos;m building a software shop that helps startups go from zero to one.
      Previously I was employee #1 at{' '}
      <a href="https://pave.com" rel="noreferrer" target="_blank">
        Pave
      </a>
      , engineering lead at{' '}
      <a href="https://frontier.jobs" rel="noreferrer" target="_blank">
        Frontier
      </a>
      , and built a lot of products.
    </>,
  ],
  links: [
    ['Twitter', 'https://twitter.com/nosajio'],
    ['GitHub', 'https://github.com/nosajio'],
    ['LinkedIn', 'https://linkedin.com/in/nosajio'],
    ['Email', 'mailto:jason@nosaj.io'],
  ],
};

const HomePage = ({ posts, confirmEmail }: HomePageProps) => {
  const parsedPosts = posts.map(p => parsePost(p));

  return (
    <>
      <Head>
        <title>Jason Howmans</title>
        <meta
          name="description"
          content="Jason is a software engineer, designer, and startup builder."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="" /> */}
      </Head>
      <Page>
        {confirmEmail && (
          <Notification>🎉🎉🎉 Your email was confirmed!</Notification>
        )}
        <Section className={s.home__intro}>
          <h1 className={s.home__introHeadline}>{homePageContent.headline}</h1>
          {homePageContent.bio.map((p, i) => (
            <p key={i} className={s.home__introText}>
              {p}
            </p>
          ))}
        </Section>
        <Section className={s.home__connect}>
          <h1 className={s.sectionTitle}>Connect</h1>
          <ul className={s.home__connectLinks}>
            {homePageContent.links.map(([name, link], i) => (
              <li key={i} className={s.home__connectLink}>
                <a href={link} target="_blank" rel="noreferrer">
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </Section>
        <Section className={s.home__subscribe}>
          <h1 className={clsx(s.sectionTitle, s.sectionTitleSubscribeIcon)}>
            Subscribe to the blog
          </h1>
          <div className={s.home__subscribeForm}>
            <Subscribe />
          </div>
        </Section>
        <Section className={s.home__blog}>
          <h1 className={s.sectionTitle}>Posts</h1>
          {/* {years.map((y, i) => (
            <div key={i} className={s.posts__yearGroup}>
              <h2 className={s.posts__yearTitle}>{y}</h2>
              */}
          <ul className={s.posts__list}>
            {parsedPosts.map(post => (
              <li key={post.id} className={s.post__row}>
                <time className={s.post__rowDate}>
                  {dateStr(post.pubdate!)}
                </time>
                <h3 className={s.post__rowTitle}>
                  <Link href={`/r/${post.slug}`}>{post.title}</Link>
                </h3>
              </li>
            ))}
          </ul>
          {/* ))} </div> */}
        </Section>
      </Page>
    </>
  );
};

export default HomePage;
