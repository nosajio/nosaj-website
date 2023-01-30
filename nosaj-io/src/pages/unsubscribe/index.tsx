import { Page } from 'components';
import { newEvent, removeSubscriber } from 'data/server';
import Head from 'next/head';
import { GetServerSideProps } from 'next/types';
import s from './unsubscribe.module.scss';

type UnsubscribeQuerystring = {
  token?: string;
  eid?: string;
};

type UnsubscribeProps = {
  subscriber: null | {
    email: string;
  };
  daysSubscribed: number;
  unsubscribed: boolean;
};

export const getServerSideProps: GetServerSideProps<
  UnsubscribeProps,
  UnsubscribeQuerystring
> = async ({ query }) => {
  let daysSubscribed = 0;
  const { token, eid = '' } = query ?? {};

  if (typeof token !== 'string') {
    return {
      notFound: true,
    };
  }

  const removedSubscriber = await removeSubscriber(token);

  if (removedSubscriber) {
    daysSubscribed = Math.ceil(
      Math.abs(removedSubscriber.subscribed_date.getTime() - Date.now()) /
        86400000,
    );

    try {
      await newEvent('unsubscribe', {
        token,
        email_address: removedSubscriber.email,
        email_id: typeof eid === 'string' ? eid : '',
        subscribed_days: daysSubscribed,
      });
    } catch (err) {
      console.error(err);
    }
  }

  return {
    props: {
      subscriber: removedSubscriber ? { email: removedSubscriber.email } : null,
      unsubscribed: typeof removedSubscriber !== 'undefined',
      daysSubscribed,
    },
  };
};

const UnsubscribePage = ({
  unsubscribed,
  daysSubscribed,
}: UnsubscribeProps) => {
  return (
    <>
      <Head>
        <title>Unsubscribe from Jason&apos;s Newsletter</title>
        <meta
          name="description"
          content="Jason is a software engineer, designer, and startup builder."
        />
      </Head>
      <Page>
        {unsubscribed ? (
          <section className={s.unsubscribe}>
            <h1 className={s.unsubscribe__title}>
              You&apos;re now unsubscribed
            </h1>
            {daysSubscribed > 30 && (
              <div className={s.unsubscribe__message}>
                <p>
                  Thanks for being a reader for {daysSubscribed} days. It really
                  means a lot.
                </p>
                <p>If you want to keep in touch, email me on jason@nosaj.io.</p>
              </div>
            )}
          </section>
        ) : (
          <section className={s.unsubscribe}>
            <h1 className={s.unsubscribe__title}>
              There was a problem with your request
            </h1>
            <div className={s.unsubscribe__message}>
              <p>The provided subscriber doesn&apos;t exist.</p>
            </div>
          </section>
        )}
      </Page>
    </>
  );
};

export default UnsubscribePage;
