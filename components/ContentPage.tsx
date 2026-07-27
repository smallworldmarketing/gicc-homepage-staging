import type { ReactNode } from "react";

type ContentPageProps = {
  eyebrow?: string;
  title: string;
  lede: string;
  children: ReactNode;
  tone?: "light" | "dark";
};

export function ContentPage({ eyebrow, title, lede, children, tone = "light" }: ContentPageProps) {
  return (
    <>
      <header className={`content-hero content-hero--${tone}`}>
        <div className="shell narrow">
          {eyebrow ? <p className="section-note">{eyebrow}</p> : null}
          <h1>{title}</h1>
          <p>{lede}</p>
        </div>
      </header>
      <div className="content-page__body">
        <div className="shell narrow prose section-space">{children}</div>
      </div>
    </>
  );
}
