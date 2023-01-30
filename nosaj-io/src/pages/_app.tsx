import 'styles/globals.scss';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-7V8JX5MX4D"
        strategy="afterInteractive"
      />
      <Script id="ga" strategy="afterInteractive">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-7V8JX5MX4D');
        `}
      </Script>
      <Component {...pageProps} />
    </>
  );
}
