import Link from 'next/link';
import s from './header.module.scss';

type HeaderProps = {};

const navLinks = [];

const Header = (props: HeaderProps) => {
  return (
    <header className={s.header}>
      <div className={s.header__content}>
        <Link className="no-decoration" href="/">
          <div className={s.header__logo}>
            <div className={s.header__logoImg} />
            <div className={s.header__logoText}>Jason Howmans</div>
          </div>
        </Link>
        {navLinks.length > 0 && (
          <nav className={s.header__nav}>
            <ul className={s.header__navList}>
              <li className={s.header__navItem}></li>
              <li className={s.header__navItem}></li>
              <li className={s.header__navItem}></li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
