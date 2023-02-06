import clsx from 'clsx';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import s from './notification.module.scss';

type NotificationProps = {
  children?: ReactNode;
  timeout?: number /* in ms */;
  confirm?: boolean;
  onConfirm?: () => void;
};

const Notification = ({
  confirm,
  onConfirm,
  timeout = 8000,
  children,
}: NotificationProps) => {
  const [mode, setMode] = useState<'appear' | 'disappear'>('appear');
  const timerRef = useRef<NodeJS.Timeout>();

  // Clear the notification after timeout (ms)
  const startCloseTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMode('disappear'), timeout);
  }, [timeout]);

  useEffect(() => {
    if (confirm) return;
    startCloseTimer();
  }, [confirm, startCloseTimer]);

  const handleConfirmAnswer = (answer: 'yes' | 'no') => () => {
    if (answer === 'yes' && onConfirm) {
      onConfirm();
    }
    setMode('disappear');
    return;
  };

  return (
    <div
      className={clsx(s.notification, {
        [s.notificationAppear]: mode === 'appear',
        [s.notificationDisappear]: mode === 'disappear',
      })}
    >
      <div className={s.notification__content}>
        {children}
        {confirm && (
          <div className={s.notification__confirm}>
            <div
              className={s.notification__confirmYes}
              onClick={handleConfirmAnswer('yes')}
            >
              Yes
            </div>
            <div
              className={s.notification__confirmNo}
              onClick={handleConfirmAnswer('no')}
            >
              No
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
