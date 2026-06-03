import WaButton from "@awesome.me/webawesome/dist/react/button/index.js";
import WaButtonGroup from "@awesome.me/webawesome/dist/react/button-group/index.js";
import { SiteFooter } from "../../components/site-footer/SiteFooter";
import { SiteHeader } from "../../components/site-header/SiteHeader";

export function HomePage() {
  return (
    <main className="home-page">
      <SiteHeader />
      <section className="home-page__hero" aria-labelledby="home-title">
        <div className="home-page__copy">
          <p className="home-page__eyebrow">Bonecutters.us</p>
          <h1 id="home-title">Jediah Blankenship</h1>
          <p className="home-page__dek">Technology leader, software builder, and practical systems thinker.</p>
          <p className="home-page__lede">
            Bonecutters is my long-running personal domain. These days, it is the home base
            for my email, independent software projects, and the bits of professional context
            that do not fit neatly on a resume.
          </p>
          <WaButtonGroup className="home-page__actions" aria-label="Primary links">
            <WaButton href="https://www.linkedin.com/in/jediah-blankenship/" target="_blank" rel="noreferrer">
              LinkedIn
            </WaButton>
            <WaButton href="https://simpleetl.bonecutters.us/" target="_blank" rel="noreferrer">
              SimpleETL
            </WaButton>
            <WaButton href="mailto:jediah@bonecutters.us">Email</WaButton>
          </WaButtonGroup>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
