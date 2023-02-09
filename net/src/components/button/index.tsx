import clsx from 'clsx';
import Spinner from 'components/spinner';
import { ReactNode } from 'react';
import s from './button.module.scss';

type ButtonProps = {
  children: ReactNode;
  className?: string;
  primary?: boolean;
  inverted?: boolean;
  onClick?: () => void;
  // This shows a loading spinner to show the button is doing something
  loading?: boolean;
};

const Button = ({
  onClick,
  children,
  inverted,
  primary,
  loading,
  className,
}: ButtonProps) => {
  const handleClick = () => {
    if (!onClick) return;
    onClick();
  };

  return (
    <div
      className={clsx(
        s.button,
        {
          [s.buttonPrimary]: primary,
          [s.buttonInverted]: inverted,
          [s.buttonLoading]: loading,
        },
        className,
      )}
      onClick={handleClick}
    >
      {loading ? <Spinner inverted={primary} /> : children}
    </div>
  );
};

export default Button;
