import PublicLayout from "@/components/PublicLayout";
import { trpc } from "@/lib/trpc";
import { ArrowRight, ArrowUpRight, Check, Cloud, Code2, Database, Github, Linkedin, Mail, Server, ShieldCheck, Workflow } from "lucide-react";
import { Link } from "wouter";

const serviceModules = [
  { icon: Code2, title: "Backend & API", text: "Services Python robustes, APIs REST documentées et intégrations conçues pour rester lisibles quand le produit grandit." },
  { icon: Server, title: "DevOps & Linux", text: "Conteneurisation, CI/CD, environnements reproductibles et déploiements qui réduisent le risque en production." },
  { icon: Cloud, title: "Cloud & Infrastructure", text: "Architecture pragmatique, observabilité et automatisation pour faire évoluer les systèmes sans perdre le contrôle." },
  { icon: ShieldCheck, title: "Fiabilité & sécurité", text: "Bonnes pratiques de sécurité, gestion des erreurs et documentation pour transformer une solution en système opérable." },
  { icon: Database, title: "Données & intégration", text: "Modélisation, persistance et flux interservices pour connecter les métiers aux bonnes sources de vérité." },
  { icon: Workflow, title: "Accompagnement technique", text: "Diagnostic, transmission et décisions d’architecture expliquées avec un langage accessible aux équipes." },
];

const qualityCommitments = [
  "Code versionné et décisions techniques documentées",
  "Tests ciblés sur les flux critiques et les régressions",
  "Configuration reproductible entre développement et production",
  "Observabilité pensée avant le premier incident",
  "Sécurité et gestion des secrets intégrées au cycle de livraison",
  "Transmission claire pour que le système reste maintenable",
];

const processDetails = [
  "Clarifier le contexte, les objectifs et les contraintes.",
  "Choisir les flux, les données et les interfaces utiles.",
  "Livrer par incréments vérifiables et documentés.",
  "Sécuriser les chemins critiques et les erreurs.",
  "Automatiser le passage vers des environnements fiables.",
  "Laisser une base claire, maintenable et partageable.",
];

export default function Home() {
  const { data, isLoading } = trpc.portfolio.get.useQuery();
  const { data: projects } = trpc.projects.list.useQuery();
  const profile = data?.profile;
  const featured = (projects ?? []).filter((project) => project.isFeatured).slice(0, 3);
  const visibleProjects = featured.length ? featured : (projects ?? []).slice(0, 3);

  return (
    <PublicLayout>
      <section className="lite-hero">
        <div className="lite-hero__content">
          <div className="lite-mark" aria-hidden="true">LA</div>
          <p className="lite-eyebrow">LIONEL ADOUKONOU · BACKEND / DEVOPS / CLOUD</p>
          <h1>Je construis des systèmes fiables,<br /><span>une ligne de code à la fois.</span></h1>
          <p className="lite-lede">{profile?.bio ?? "Ingénieur Backend et DevOps, je conçois des APIs, des automatisations et des infrastructures pensées pour être comprises, déployées et maintenues."}</p>
          <div className="lite-actions">
            <Link href="/projets" className="lite-button lite-button--primary">Explorer mes projets <ArrowRight size={17} /></Link>
            <Link href="/contact" className="lite-button lite-button--outline">Démarrer une conversation <Mail size={16} /></Link>
          </div>
        </div>
        <div className="lite-hero__profile-card">
          <div className="lite-profile-card__header"><span>PROFILE_MODULE</span><strong>AVAILABLE</strong></div>
          <div className="lite-profile-card__body"><span className="lite-profile-card__initials">LA</span><div><strong>{profile?.fullName ?? "Lionel Adoukonou"}</strong><p>{profile?.headline ?? "Backend / DevOps Engineer"}</p></div></div>
          <div className="lite-profile-card__facts"><div><span>FOCUS</span><strong>BACKEND</strong></div><div><span>STACK</span><strong>PY / LINUX</strong></div><div><span>ZONE</span><strong>{profile?.location ?? "Bénin"}</strong></div></div>
          <div className="lite-profile-card__note"><span /> {profile?.availability ?? "Ouvert aux opportunités techniques"}</div>
        </div>
      </section>

      <section className="lite-section lite-section--muted">
        <div className="lite-section__heading"><p className="lite-eyebrow">POURQUOI TRAVAILLER ENSEMBLE</p><h2>Un profil technique<br /><span>orienté terrain.</span></h2></div>
        <div className="lite-card-grid lite-card-grid--three">
          <article className="lite-card"><span className="lite-card__number">01</span><h3>Construire avec méthode</h3><p>Chaque choix part du contexte réel : contraintes, utilisateurs, exploitation et capacité de l’équipe à faire vivre le produit.</p></article>
          <article className="lite-card"><span className="lite-card__number">02</span><h3>Rendre les systèmes lisibles</h3><p>Une bonne architecture ne se contente pas de fonctionner. Elle donne aux équipes les moyens de comprendre ce qui se passe.</p></article>
          <article className="lite-card"><span className="lite-card__number">03</span><h3>Livrer sans effet tunnel</h3><p>Des étapes courtes, des preuves concrètes et une communication directe pour avancer sans masquer les risques.</p></article>
        </div>
      </section>

      <section className="lite-section" id="expertise">
        <div className="lite-section__heading"><p className="lite-eyebrow">DOMAINES D’INTERVENTION</p><h2>Des briques utiles<br /><span>pour la production.</span></h2></div>
        <div className="lite-card-grid lite-card-grid--three">{serviceModules.map(({ icon: Icon, title, text }) => <article className="lite-card lite-service" key={title}><Icon size={30} strokeWidth={1.7} /><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="lite-section lite-section--muted">
        <div className="lite-section__heading"><p className="lite-eyebrow">MA FAÇON DE TRAVAILLER</p><h2>Du besoin initial<br /><span>au système opéré.</span></h2></div>
        <div className="lite-steps">{["Comprendre", "Modéliser", "Construire", "Tester", "Déployer", "Transmettre"].map((step, index) => <article className="lite-step" key={step}><span>{index + 1}</span><h3>{step}</h3><p>{processDetails[index]}</p></article>)}</div>
      </section>

      <section className="lite-section lite-quality">
        <div className="lite-section__heading"><p className="lite-eyebrow">ENGAGEMENT QUALITÉ</p><h2>La fiabilité se<br /><span>prépare en amont.</span></h2></div>
        <div className="lite-quality__grid">{qualityCommitments.map((item) => <div className="lite-quality__item" key={item}><span><Check size={15} /></span><p>{item}</p></div>)}</div>
      </section>

      <section className="lite-section lite-section--projects" id="projets">
        <div className="lite-section__heading lite-section__heading--row"><div><p className="lite-eyebrow">PROJETS SÉLECTIONNÉS</p><h2>Des systèmes<br /><span>mis en production.</span></h2></div><Link href="/projets" className="lite-text-link">Voir tous les projets <ArrowUpRight size={16} /></Link></div>
        <div className="lite-project-grid">{isLoading ? [1, 2, 3].map((item) => <div className="lite-project-skeleton" key={item} />) : visibleProjects.map((project, index) => <article className="lite-project" key={project.id}><Link href={`/projets/${project.slug}`} className="lite-project__visual"><span>SYS.{String(index + 1).padStart(2, "0")}</span><div className="lite-project__lines" /><strong>{project.title.slice(0, 2).toUpperCase()}</strong></Link><div className="lite-project__body"><div><p className="lite-eyebrow">CASE STUDY · {project.technologies.slice(0, 2).join(" / ")}</p><h3>{project.title}</h3><p>{project.shortDescription}</p></div><Link href={`/projets/${project.slug}`} aria-label={`Voir le projet ${project.title}`}><ArrowUpRight size={18} /></Link></div></article>)}</div>
      </section>

      <section className="lite-contact-cta"><p className="lite-eyebrow">OUVRIR UN CANAL</p><h2>Un système à clarifier ?</h2><p>API, automatisation, déploiement ou infrastructure : partagez le contexte et les contraintes. Je vous répondrai avec une première lecture utile.</p><Link href="/contact" className="lite-button lite-button--light">Parler de votre besoin <ArrowRight size={17} /></Link><div className="lite-socials"><a href={profile?.githubUrl ?? "https://github.com/lionellite"} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a><a href={profile?.linkedinUrl ?? "https://linkedin.com/in/lionellite"} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a><a href={`mailto:${profile?.email ?? "liolisena@gmail.com"}`} aria-label="E-mail"><Mail size={17} /></a></div></section>
    </PublicLayout>
  );
}
