import { NotificationContext } from 'components/notification';
import { useContext } from 'react';

const useNotification = () => {
  const ctx = useContext(NotificationContext);
  return ctx;
};

export default useNotification;
