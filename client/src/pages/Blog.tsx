import PublicLayout from "@/components/PublicLayout";
import { trpc } from "@/lib/trpc";
import { ArrowUpRight, BookOpenText } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

function dateLabel(date: Date | string | null, language: "en" | "fr") {
  return date ? new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-US", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date)) : language === "fr" ? "À venir" : "Coming soon";
}

export default function Blog() {
  const { language } = useLanguage();
  const fr = language === "fr";
  const { data: posts, isLoading, isError } = trpc.blog.list.useQuery();
  return (
    <PublicLayout>
      <section className="page-hero page-hero--notes"><div className="eyebrow"><BookOpenText size={14} /> {fr ? "Carnet de bord" : "Field notes"}</div><h1>{fr ? "Idées, apprentissages" : "Ideas, lessons"}<br /><em>{fr ? "et retours d’expérience." : "and field reports."}</em></h1><p>{fr ? "Quelques notes sur le backend, l’infrastructure, le cloud et les systèmes qui m’intéressent." : "Notes on backend engineering, infrastructure, cloud and the systems I care about."}</p></section>
      <section className="notes-section">
        {isLoading ? <div className="notes-list notes-list--skeleton" aria-label={fr ? "Chargement des articles" : "Loading articles"}>{[1, 2, 3, 4].map(item => <div className="note-card note-card--skeleton" key={item}><div className="note-card__accent" /><div className="note-card__body"><span /><span /><span /><span /></div></div>)}</div> : isError ? <div className="empty-public"><BookOpenText size={28} /><p>{fr ? "Les articles sont temporairement indisponibles. Réessayez dans un instant." : "Articles are temporarily unavailable. Please try again shortly."}</p></div> : posts?.length ? <div className="notes-list">{posts.map((post, index) => <article className="note-card" key={post.id}><div className={`note-card__accent note-accent-${(index % 3) + 1}`}><span>{String(index + 1).padStart(2, "0")}</span></div><div className="note-card__body"><div className="note-meta"><span>{dateLabel(post.publishedAt, language)}</span>{post.tags.slice(0, 2).map(tag => <span key={tag}>#{tag}</span>)}</div><h2>{post.title}</h2><p>{post.excerpt}</p><Link href={`/blog/${post.slug}`} className="text-link">{fr ? "Lire la note" : "Read the note"} <ArrowUpRight size={16} /></Link></div></article>)}</div> : <div className="blog-empty"><div className="blog-empty__signal"><BookOpenText size={25} /><span>LAB / 01</span></div><div><p className="section-kicker">{fr ? "Journal de systèmes" : "Systems journal"}</p><h2>{fr ? "Premières notes" : "First notes"}<br /><em>{fr ? "en préparation." : "in preparation."}</em></h2><p>{fr ? "Le carnet documentera bientôt des décisions d’architecture, des protocoles de déploiement et des retours d’exploitation." : "This journal will document architecture decisions, deployment protocols and operational lessons."}</p></div><div className="blog-empty__topics"><span>API DESIGN</span><span>DEPLOY FLOW</span><span>OBSERVABILITY</span></div></div>}
      </section>
    </PublicLayout>
  );
}
