import { Page } from 'components';
import { UnsubscribeEvent } from 'data';
import { newEvent, removeSubscriber } from 'data/server';
import Head from 'next/head';
import { GetServerSideProps } from 'next/types';
import React from 'react';

type UnsubscribeQuerystring = {
  token?: string;
  eid?: string;
};

type UnsubscribeProps = {
  subscriber: null | {
    email: string;
  };
  unsubscribed: boolean;
};

export const getServerSideProps: GetServerSideProps<
  UnsubscribeProps,
  UnsubscribeQuerystring
> = async ({ query }) => {
  const { token, eid = '' } = query ?? {};

  if (typeof token !== 'string') {
    return {
      notFound: true,
    };
  }

  const removedSubscriber = await removeSubscriber(token);

  if (!removedSubscriber) {
    return {
      notFound: true,
    };
  }

  try {
    await newEvent('unsubscribe', {
      email_address: removedSubscriber.email,
      email_id: typeof eid === 'string' ? eid : '',
    });
  } catch (err) {
    console.error(err);
  }

  return {
    props: {
      subscriber: removedSubscriber || null,
      unsubscribed: typeof removeSubscriber !== 'undefined',
    },
  };
};

const UnsubscribePage = ({}: UnsubscribeProps) => {
  return (
    <>
      <Head>
        <title>Unsubscribe from Jason&apos;s Newsletter</title>
        <meta
          name="description"
          content="Jason is a software engineer, designer, and startup builder."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Page></Page>
    </>
  );
};

export default UnsubscribePage;
