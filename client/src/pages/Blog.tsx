import PublicLayout from "@/components/PublicLayout";
import { trpc } from "@/lib/trpc";
import { ArrowUpRight, BookOpenText } from "lucide-react";
import { Link } from "wouter";

function dateLabel(date: Date | string | null) {
  return date ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date)) : "À venir";
}

export default function Blog() {
  const { data: posts, isLoading, isError } = trpc.blog.list.useQuery();
  return (
    <PublicLayout>
      <section className="page-hero page-hero--notes"><div className="eyebrow"><BookOpenText size={14} /> Carnet de bord</div><h1>Idées, apprentissages<br /><em>et retours d’expérience.</em></h1><p>Quelques notes sur le backend, l’infrastructure, le cloud et les systèmes qui m’intéressent.</p></section>
      <section className="notes-section">
        {isLoading ? <div className="notes-list notes-list--skeleton" aria-label="Chargement des articles">{[1, 2, 3, 4].map(item => <div className="note-card note-card--skeleton" key={item}><div className="note-card__accent" /><div className="note-card__body"><span /><span /><span /><span /></div></div>)}</div> : isError ? <div className="empty-public"><BookOpenText size={28} /><p>Les articles sont temporairement indisponibles. Réessayez dans un instant.</p></div> : posts?.length ? <div className="notes-list">{posts.map((post, index) => <article className="note-card" key={post.id}><div className={`note-card__accent note-accent-${(index % 3) + 1}`}><span>{String(index + 1).padStart(2, "0")}</span></div><div className="note-card__body"><div className="note-meta"><span>{dateLabel(post.publishedAt)}</span>{post.tags.slice(0, 2).map(tag => <span key={tag}>#{tag}</span>)}</div><h2>{post.title}</h2><p>{post.excerpt}</p><Link href={`/blog/${post.slug}`} className="text-link">Lire la note <ArrowUpRight size={16} /></Link></div></article>)}</div> : <div className="blog-empty"><div className="blog-empty__signal"><BookOpenText size={25} /><span>LAB / 01</span></div><div><p className="section-kicker">Journal de systèmes</p><h2>Premières notes<br /><em>en préparation.</em></h2><p>Le carnet documentera bientôt des décisions d’architecture, des protocoles de déploiement et des retours d’exploitation.</p></div><div className="blog-empty__topics"><span>API DESIGN</span><span>DEPLOY FLOW</span><span>OBSERVABILITY</span></div></div>}
      </section>
    </PublicLayout>
  );
}
