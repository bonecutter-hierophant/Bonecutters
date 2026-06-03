import { SiteBrand } from "../site-brand/SiteBrand";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#writing", label: "Writing" },
  { href: "#name", label: "The Name" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="site-header__nav" aria-label="Primary">
        <SiteBrand />
        <div className="site-header__links">
          {navItems.map((item) => (
            <a className="site-header__link" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
