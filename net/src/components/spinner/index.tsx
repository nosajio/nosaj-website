import clsx from 'clsx';
import s from './spinner.module.scss';

type SpinnerProps = {
  className?: string;
  inverted?: boolean;
  large?: boolean;
};

const Spinner = ({ large, inverted, className }: SpinnerProps) => {
  return (
    <svg
      className={clsx(className, s.spinner, {
        [s.spinnerLarge]: large,
        [s.spinnerLight]: inverted,
      })}
      width="17"
      height="20"
      viewBox="0 0 17 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMin slice"
    >
      <path
        d="M1 5.57195L8.5 1.16018L16 5.57195V14.4281L8.5 18.8398L1 14.4281V5.57195Z"
        stroke="#0E1116"
        strokeWidth="2"
        strokeDasharray="30 15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Spinner;
