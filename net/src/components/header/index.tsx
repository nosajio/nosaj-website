import Image from 'next/image';
import s from './header.module.scss';

const Header = () => (
  <div className={s.header}>
    <Image alt="" src="/netlogo.svg" height={70} width={139} />
  </div>
);

export default Header;
