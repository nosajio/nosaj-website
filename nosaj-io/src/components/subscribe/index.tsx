import clsx from 'clsx';
import { FormEventHandler, useState } from 'react';
import { addNewSubscriber } from 'utils/api';
import s from './subscribe.module.scss';

type SubscribeProps = {
  className?: string;
};

const isValidEmail = (str: string) => /^[^@]+@[^@]+\.[a-z]+$/i.test(str);

const Subscribe = ({ className }: SubscribeProps) => {
  const [email, setEmail] = useState<string>('');
  const [mode, setMode] = useState<
    'normal' | 'apierror' | 'apibusy' | 'apisuccess' | 'invalid' | 'exists'
  >('normal');

  const handleSubmit: FormEventHandler = e => {
    e.preventDefault();
    setMode('normal');

    if (!email) {
      return false;
    }
    setMode('apibusy');

    if (!isValidEmail(email)) {
      return setMode('invalid');
    }

    addNewSubscriber(email).then(sub =>
      setMode(
        sub?.subscriber
          ? 'apisuccess'
          : sub?.error?.type === 'existing_subscriber'
          ? 'exists'
          : 'apierror',
      ),
    );
  };

  return (
    <form
      className={clsx(className, s.subscribe__form)}
      onSubmit={handleSubmit}
    >
      {mode === 'invalid' && (
        <p className={s.subscribe__invalidNotice}>
          Enter a valid email address
        </p>
      )}
      {mode === 'exists' && (
        <p className={s.subscribe__invalidNotice}>
          You are already subscribed!
        </p>
      )}
      {mode === 'apisuccess' ? (
        <p className={s.subscribe__successMessage}>
          ✅ You&apos;re in! Check your inbox to confirm your subscription.
        </p>
      ) : (
        <>
          <div className={s.subscribe__fields}>
            <input
              required
              type="email"
              placeholder="jane@example.com"
              className={s.subscribe__input}
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
            <button
              disabled={mode === 'apibusy'}
              className={s.subscribe__submit}
            >
              Subscribe
            </button>
          </div>
          <p className={s.subscribe__smallprint}>
            No spam. No BS. Just juicy content.
          </p>
        </>
      )}
    </form>
  );
};

export default Subscribe;
