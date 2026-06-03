import { SiteBrand } from "../site-brand/SiteBrand";

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="site-header__nav" aria-label="Primary">
        <SiteBrand />
        <a className="site-header__link" href="mailto:jediah@bonecutters.us">
          Contact
        </a>
      </nav>
    </header>
  );
}
