import { Github, Linkedin, Mail, Menu, TerminalSquare, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const links = [
  { href: "/", label: "ROOT", caption: "profil" },
  { href: "/projets", label: "SYSTEMS", caption: "projets" },
  { href: "/blog", label: "LOGS", caption: "notes" },
  { href: "/contact", label: "CONTACT", caption: "échange" },
];

export function BrandMark() {
  return <Link href="/" className="terminal-brand" aria-label="Accueil du portfolio de Lionel Adoukonou"><span className="terminal-brand__mark">LA</span><span><strong>lionel.adoukonou</strong><small>SYS // PORTFOLIO</small></span></Link>;
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="terminal-shell">
    <header className="terminal-header">
      <div className="terminal-header__inner">
        <BrandMark />
        <nav className="terminal-nav" aria-label="Navigation principale">{links.map(link => <Link key={link.href} href={link.href} className={location === link.href ? "is-active" : ""}><span>{link.label}</span><small>{link.caption}</small></Link>)}</nav>
        <Link href="/contact" className="terminal-header__command"><span>RUN</span> init_contact()</Link>
        <button type="button" className="terminal-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Ouvrir le menu" aria-expanded={menuOpen}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
      </div>
      {menuOpen ? <nav className="terminal-mobile-nav" aria-label="Navigation mobile">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}><span>{link.label}</span><small>{link.caption}</small></Link>)}</nav> : null}
    </header>
    <main>{children}</main>
    <footer className="terminal-footer"><div className="terminal-footer__inner"><div><BrandMark /><p><span className="terminal-pulse" /> SYSTEM_STATUS: NOMINAL</p></div><div className="terminal-footer__links"><a href="https://github.com/lionellite" target="_blank" rel="noreferrer"><Github size={15} /> github</a><a href="https://linkedin.com/in/lionellite" target="_blank" rel="noreferrer"><Linkedin size={15} /> linkedin</a><a href="mailto:liolisena@gmail.com"><Mail size={15} /> e-mail</a></div><p className="terminal-footer__version"><TerminalSquare size={14} /> BUILD {new Date().getFullYear()}.01</p></div></footer>
  </div>;
}
