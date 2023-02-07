import Header from 'components/header';
import { NotificationController } from 'components/notification';
import type { AppProps } from 'next/app';
import 'styles/globals.scss';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <NotificationController>
        <Component {...pageProps} />
      </NotificationController>
    </>
  );
}
