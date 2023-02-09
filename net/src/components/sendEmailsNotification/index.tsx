import Button from 'components/button';
import Spinner from 'components/spinner';
import { JSONPost } from 'data';
import { useApi, useApiPrimed } from 'hooks/useApi';
import { useEffect, useState } from 'react';
import { getRecipientsForPost, sendEmailsToSubscribers } from 'utils/api';
import s from './sendEmailsNotification.module.scss';

type SendEmailsNotificationProps = {
  post: JSONPost;
};

const SendEmailsNotification = ({ post }: SendEmailsNotificationProps) => {
  const [mode, setMode] = useState<'default' | 'sent'>('default');
  const { data: recipientData, status: getApiStatus } = useApi(
    getRecipientsForPost,
    post.id,
  );
  const [
    sendEmails,
    { data: sendData, error: sendError, status: sendApiStatus },
  ] = useApiPrimed(sendEmailsToSubscribers);
  const n = recipientData?.recipients.length ?? 0;

  const handleSend = () => {
    if (!recipientData || recipientData.recipients.length === 0) return;
    sendEmails(post.id, recipientData.recipients);
  };

  useEffect(() => {
    if (sendApiStatus === 'data') {
      setMode('sent');
    }
  }, [sendApiStatus]);

  useEffect(() => {
    if (getApiStatus !== 'data') return;
    if (mode === 'default' && n === 0) {
      // setMode('sent');
    }
  }, [getApiStatus, mode, n]);

  return (
    <div className={s.sendEmails}>
      {getApiStatus === 'loading' ? (
        <Spinner inverted large />
      ) : mode === 'default' ? (
        <>
          <section className={s.sendEmails__content}>
            <h1
              className={s.sendEmails__title}
              title={recipientData?.recipients.map(r => r.email).join('\n')}
            >
              Alright then, shall we email {n} subscribers with this post?
            </h1>
          </section>
          <section className={s.sendEmails__actions}>
            <Button
              inverted
              className={s.sendEmails__sendButton}
              loading={sendApiStatus === 'loading'}
              onClick={handleSend}
            >
              Email {n} people
            </Button>
          </section>
        </>
      ) : (
        <>
          <section className={s.sendEmails__content}>
            <h1 className={s.sendEmails__title}>
              All subs have received this post!{' '}
              {sendData?.success &&
                `Sent to: ${sendData.status?.sent}. Failed: ${sendData.status?.failed}`}
            </h1>
          </section>
        </>
      )}
    </div>
  );
};

export default SendEmailsNotification;
