import { Github, Linkedin, Mail, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const links = [
  { href: "/", label: "À propos" },
  { href: "/projets", label: "Projets" },
  { href: "/blog", label: "Notes" },
  { href: "/contact", label: "Contact" },
];

export function BrandMark() {
  return (
    <Link href="/" className="brand-mark" aria-label="Accueil du portfolio de Lionel Adoukonou">
      <span className="brand-mark__glyph">LA</span>
      <span className="brand-mark__word"><strong>Lionel<span className="brand-mark__dot">.</span></strong><small>SYS / PORTFOLIO</small></span>
    </Link>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="portfolio-shell">
      <header className="public-header">
        <div className="public-header__inner">
          <BrandMark />
          <nav className="public-nav" aria-label="Navigation principale">
            {links.map(link => (
              <Link key={link.href} href={link.href} className={location === link.href ? "is-active" : ""}>{link.label}</Link>
            ))}
          </nav>
          <Link href="/contact" className="header-cta">Parlons projet <span>↗</span></Link>
          <button type="button" className="mobile-menu-trigger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Ouvrir le menu" aria-expanded={menuOpen}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen ? (
          <nav className="mobile-nav" aria-label="Navigation mobile">
            {links.map(link => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</Link>)}
          </nav>
        ) : null}
      </header>
      <main>{children}</main>
      <footer className="public-footer">
        <div className="public-footer__inner">
          <div>
            <BrandMark />
            <p>Construire des systèmes fiables, utiles et durables.</p>
          </div>
          <div className="footer-links">
            <a href="https://github.com/lionellite" target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a>
            <a href="https://linkedin.com/in/lionellite" target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn</a>
            <a href="mailto:liolisena@gmail.com"><Mail size={17} /> E-mail</a>
          </div>
          <p className="footer-credit">© {new Date().getFullYear()} Lionel Adoukonou</p>
        </div>
      </footer>
    </div>
  );
}
