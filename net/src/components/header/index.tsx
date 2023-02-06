import Image from 'next/image';
import Link from 'next/link';
import s from './header.module.scss';

const Header = () => (
  <div className={s.header}>
    <Link href="/dashboard">
      <Image alt="" src="/netlogo.svg" height={70} width={139} />
    </Link>
  </div>
);

export default Header;
