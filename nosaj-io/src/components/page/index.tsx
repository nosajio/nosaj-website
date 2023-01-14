import clsx from "clsx";
import Footer from "components/footer";
import Header from "components/header";
import { ReactNode } from "react";
import s from "./page.module.scss";

type PageProps = {
  className?: string;
  children?: ReactNode;
};

const Page = ({ children, className }: PageProps) => {
  return (
    <main className={clsx(className, s.page__main)}>
      <Header />
      {children}
      <Footer />
    </main>
  );
};

type PageSectionProps = {
  className?: string;
  children?: ReactNode;
};

export const Section = ({ className, children }: PageSectionProps) => {
  return (
    <section className={clsx(className, s.page__section)}>
      <div className={s.page__sectionContent}>{children}</div>
    </section>
  );
};

export default Page;
