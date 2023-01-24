import { FormEventHandler, useState } from 'react';
import { addNewSubscriber } from 'utils/api';
import s from './subscribe.module.scss';

type SubscribeProps = {};

const isValidEmail = (str: string) => /^[^@]+@[^@]+\.[a-z]+$/i.test(str);

const Subscribe = ({}: SubscribeProps) => {
  const [email, setEmail] = useState<string>('');
  const [mode, setMode] = useState<
    'normal' | 'apierror' | 'apibusy' | 'apisuccess' | 'invalid'
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
      setMode(sub ? 'apisuccess' : 'apierror'),
    );
  };

  return (
    <form className={s.subscribe__form} onSubmit={handleSubmit}>
      {mode === 'invalid' && (
        <p className={s.subscribe__invalidNotice}>
          Enter a valid email address
        </p>
      )}
      {mode === 'apisuccess' ? (
        <p className={s.subscribe__successMessage}>
          You rule! Check your inbox to confirm your subscription.
        </p>
      ) : (
        <>
          <input
            required
            type="email"
            placeholder="jane@example.com"
            className={s.subscribe__input}
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
          <button disabled={mode === 'apibusy'} className={s.subscribe__submit}>
            Subscribe
          </button>
          <p className={s.subscribe__smallprint}>
            No spam, no bs. Just juicy content.
          </p>
        </>
      )}
    </form>
  );
};

export default Subscribe;
