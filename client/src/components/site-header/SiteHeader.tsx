import { useEffect, useState } from "react";
import { SiteBrand } from "../site-brand/SiteBrand";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#writing", label: "Writing" },
  { href: "#name", label: "The Name" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const [isCompact, setIsCompact] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      const scrollY = window.scrollY;

      const isPastHeaderThreshold = (current: boolean) => (scrollY > 16 ? true : scrollY < 4 ? false : current);

      setIsCompact(isPastHeaderThreshold);
      setIsScrolled(isPastHeaderThreshold);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header
      className={`site-header${isCompact ? " site-header--compact" : ""}${isScrolled ? " site-header--scrolled" : ""}`}
    >
      <nav className="site-header__nav" aria-label="Primary">
        <SiteBrand />
        <button
          className="site-header__menu-button"
          type="button"
          aria-controls="site-header-menu"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <div className="site-header__links" data-open={isMenuOpen} id="site-header-menu">
          {navItems.map((item) => (
            <a className="site-header__link" href={item.href} key={item.href} onClick={() => setIsMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
