import clsx from 'clsx';
import Button from 'components/button';
import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  createContext,
} from 'react';
import s from './notification.module.scss';

type NotificationContextProps = {
  newNotification: (props: { timeout?: number; children?: ReactNode }) => void;
  newConfirmation: (children?: ReactNode) => Promise<boolean>;
  clearNotification: () => void;
};

export const NotificationContext = createContext<NotificationContextProps>({
  clearNotification: () => {},
  newNotification: () => {},
  newConfirmation: () => Promise.resolve(false),
});

/**
 * <NotificationController />
 *
 * Manages the provider and allows notifications to be triggered functionally,
 * without mounting the component. The newNotification() and clearNotification()
 * fns can be called via useContext or useNotification hooks.
 */
export const NotificationController = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [notificationProps, setNotificationProps] = useState<NotificationProps>(
    {},
  );

  const reset = useCallback(() => {
    setIsActive(false);
    setNotificationProps({});
  }, []);

  const newNotification = useCallback((props: NotificationProps) => {
    setNotificationProps(props);
    setIsActive(true);
  }, []);

  const newConfirmation = useCallback<
    NotificationContextProps['newConfirmation']
  >(
    children =>
      new Promise(resolve => {
        setNotificationProps({
          confirm: true,
          children,
          onConfirm: y => {
            resolve(y);
            reset();
          },
        });
        setIsActive(true);
      }),
    [],
  );

  return (
    <NotificationContext.Provider
      value={{ newConfirmation, clearNotification: reset, newNotification }}
    >
      {children}
      {isActive && notificationProps.children && (
        <Notification {...notificationProps} />
      )}
    </NotificationContext.Provider>
  );
};

export type NotificationProps = {
  children?: ReactNode;
  timeout?: number /* in ms */;
  confirm?: boolean;
  onConfirm?: (yes: boolean) => void;
};

const defaultTimeout = 8000;

/**
 * <Notification />
 *
 * The notification component manages the UI for showing notifications and
 * triggering callbacks.
 */
const Notification = ({
  children,
  confirm,
  onConfirm,
  timeout = defaultTimeout,
}: NotificationProps) => {
  const [mode, setMode] = useState<'appear' | 'disappear'>('appear');
  const timerRef = useRef<NodeJS.Timeout>();

  // Clear the notification after timeout (ms)
  const startCloseTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMode('disappear'), timeout);
  }, [timeout]);

  useEffect(() => {
    if (confirm || timeout === 0) return;
    startCloseTimer();
  }, [confirm, startCloseTimer, timeout]);

  const handleConfirmAnswer = (answer: 'yes' | 'no') => () => {
    if (onConfirm) {
      onConfirm(answer === 'yes');
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
      <div
        className={clsx(s.notification__content, {
          [s.notification__contentConfirm]: confirm,
        })}
      >
        <div
          className={clsx(s.notification__payload, {
            [s.notification__payloadFormatted]: typeof children === 'string',
          })}
        >
          {children}
        </div>
        {confirm && (
          <div className={s.notification__confirm}>
            <Button
              inverted
              className={s.notification__confirmYes}
              onClick={handleConfirmAnswer('yes')}
            >
              Yes
            </Button>
            <Button
              inverted
              className={s.notification__confirmNo}
              onClick={handleConfirmAnswer('no')}
            >
              No
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
