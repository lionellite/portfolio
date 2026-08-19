import PublicLayout from "@/components/PublicLayout";
import { trpc } from "@/lib/trpc";
import { ArrowDownRight, ArrowUpRight, ChevronDown, Cpu, Github, GraduationCap, Linkedin, Mail, MapPin, ServerCog, Sparkles } from "lucide-react";
import { Link } from "wouter";

function IntroPortrait({ imageUrl, name }: { imageUrl?: string | null; name: string }) {
  return imageUrl ? <img className="hero-portrait__image" src={imageUrl} alt={`Portrait de ${name}`} /> : <div className="hero-portrait__monogram" aria-label={`Monogramme de ${name}`}><span>LA</span><i /><b /></div>;
}

export default function Home() {
  const { data, isLoading, isError } = trpc.portfolio.get.useQuery();
  const { data: projects } = trpc.projects.list.useQuery();
  const profile = data?.profile;
  const featured = projects?.filter(project => project.isFeatured).slice(0, 2) ?? [];
  const skillGroups = (data?.skills ?? []).reduce<Record<string, { id: number; name: string }[]>>((groups, skill) => {
    (groups[skill.category] ??= []).push({ id: skill.id, name: skill.name });
    return groups;
  }, {});

  return <PublicLayout>
    <section className="hero-section">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow eyebrow--warm"><Sparkles size={14} /> Profil ingénierie & produit</div>
          <h1>Je construis<br /><em>l’infrastructure</em><br />qui soutient les idées.</h1>
          <p>{isError ? "Les informations du profil sont temporairement indisponibles. Vous pouvez toujours me contacter directement." : profile?.bio ?? "Développeur Backend Python et passionné par les systèmes Linux, l’infrastructure et les produits numériques utiles."}</p>
          <div className="hero-actions"><Link href="/projets" className="button-primary">Voir mes projets <ArrowUpRight size={18} /></Link><a href="mailto:liolisena@gmail.com" className="button-secondary">Me contacter <Mail size={17} /></a></div>
        </div>
        <div className="hero-visual"><div className="hero-orbit orbit-1" /><div className="hero-orbit orbit-2" /><div className="hero-portrait"><IntroPortrait imageUrl={profile?.photoUrl} name={profile?.fullName ?? "Lionel Adoukonou"} /></div><div className="hero-badge hero-badge--top"><span>01</span><p>Backend<br />Python</p></div><div className="hero-badge hero-badge--bottom"><ServerCog size={18} /><p>Linux<br />& DevOps</p></div></div>
      </div>
      <div className="hero-bottom"><div className="availability"><span className="status-dot" />{profile?.availability ?? "Ouvert aux opportunités"}</div><a href="#parcours" className="scroll-cue">Faire défiler <ChevronDown size={16} /></a><div className="hero-location"><MapPin size={16} /> {profile?.location ?? "Bénin"}</div></div>
    </section>
    <section className="statement-section" id="parcours"><p className="section-kicker">01 — L’essentiel</p><div><h2>Une approche <em>pragmatique</em>, guidée par la curiosité et la fiabilité.</h2><p className="statement-side">Technicien Supérieur en Génie Électrique et Informatique, j’évolue à l’intersection du développement backend, des systèmes Linux et de l’infrastructure Cloud.</p></div></section>
    <section className="skills-section"><div className="section-heading"><div><p className="section-kicker">02 — Compétences</p><h2>Un socle technique<br />en mouvement.</h2></div><p>J’aime comprendre les systèmes de bout en bout : de l’API et la donnée jusqu’au déploiement, à l’automatisation et à l’exploitation.</p></div><div className="skills-grid">{Object.entries(skillGroups).map(([category, skills], index) => <article key={category} className="skill-panel"><div className="skill-panel__index">0{index + 1}</div><h3>{category}</h3><div>{skills.map(skill => <span key={skill.id}>{skill.name}</span>)}</div></article>)}</div></section>
    <section className="featured-section"><div className="section-heading section-heading--light"><div><p className="section-kicker">03 — Projets choisis</p><h2>Des projets qui<br /><em>font système.</em></h2></div><Link href="/projets" className="text-link text-link--light">Tous les projets <ArrowUpRight size={17} /></Link></div><div className="featured-grid">{featured.map((project, index) => <article key={project.id} className="featured-card"><Link href={`/projets/${project.slug}`} className={`featured-card__cover visual-${(index % 5) + 1}`}>{project.coverImageUrl ? <img src={project.coverImageUrl} alt="" /> : <><span>{project.title.slice(0, 2).toUpperCase()}</span><i /><b /></>}</Link><div className="featured-card__meta"><div><p>0{index + 1} / Projet</p><h3>{project.title}</h3><span>{project.shortDescription}</span></div><Link href={`/projets/${project.slug}`} className="round-link round-link--dark"><ArrowUpRight size={20} /></Link></div></article>)}</div>{!isLoading && !featured.length ? <p className="featured-empty">Les projets sélectionnés seront bientôt publiés.</p> : null}</section>
    <section className="timeline-section"><div className="timeline-intro"><p className="section-kicker">04 — Parcours</p><h2>Apprendre,<br /><em>construire,</em><br />transmettre.</h2></div><div className="timeline-list">{data?.experiences.map((experience, index) => <article className="timeline-item" key={experience.id}><span className="timeline-year">{experience.startDate}</span><div><h3>{experience.title}</h3><p className="timeline-organization">{experience.organization}{experience.location ? ` · ${experience.location}` : ""}</p><p>{experience.description}</p></div><span className="timeline-count">0{index + 1}</span></article>)}</div><div className="education-row"><div><GraduationCap size={22} /><h3>Formation</h3></div><div>{data?.educations.slice(0, 3).map(education => <p key={education.id}><strong>{education.credential}</strong><span>{education.institution} · {education.endDate ?? "en cours"}</span></p>)}</div></div></section>
    <section className="closing-section"><div className="closing-mark"><Cpu size={44} /></div><p className="section-kicker">Construisons quelque chose d’utile</p><h2>Un projet à faire<br /><em>avancer ?</em></h2><p>Je suis toujours intéressé par les échanges autour de l’infrastructure, des produits backend et de nouveaux défis techniques.</p><Link href="/contact" className="button-primary button-primary--ink">Démarrer la conversation <ArrowDownRight size={18} /></Link><div className="closing-social"><a href="https://github.com/lionellite" target="_blank" rel="noreferrer"><Github size={18} /></a><a href="https://linkedin.com/in/lionellite" target="_blank" rel="noreferrer"><Linkedin size={18} /></a><a href="mailto:liolisena@gmail.com"><Mail size={18} /></a></div></section>
  </PublicLayout>;
}
