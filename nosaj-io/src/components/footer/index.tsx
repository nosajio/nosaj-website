import s from './footer.module.scss';

type FooterProps = {};

const Footer = (props: FooterProps) => {
  return (
    <footer className={s.footer}>
      &copy; {new Date().getFullYear()} Jason Howmans
    </footer>
  );
};

export default Footer;
