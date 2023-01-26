import s from './footer.module.scss';

const Footer = () => {
  return (
    <footer className={s.footer}>
      <div className={s.footer__content}>
        &copy; {new Date().getFullYear()} Jason Howmans
      </div>
    </footer>
  );
};

export default Footer;
