import clsx from 'clsx';
import { ReactNode, useEffect, useRef, useState } from 'react';
import s from './notification.module.scss';

type NotificationProps = {
  children?: ReactNode;
  timeout?: number /* in ms */;
};

const Notification = ({ timeout = 8000, children }: NotificationProps) => {
  const [mode, setMode] = useState<'appear' | 'disappear'>('appear');
  const timerRef = useRef<NodeJS.Timeout>();

  // Clear the notification after timeout (ms)
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMode('disappear'), timeout);
  }, [timeout]);

  return (
    <div
      className={clsx(s.notification, {
        [s.notificationAppear]: mode === 'appear',
        [s.notificationDisappear]: mode === 'disappear',
      })}
    >
      <div className={s.notification__content}>{children}</div>
    </div>
  );
};

export default Notification;
