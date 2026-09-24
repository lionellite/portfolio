import PublicLayout from "@/components/PublicLayout";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, BookOpenText } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const { data: post, isLoading, error } = trpc.blog.bySlug.useQuery({ slug: params?.slug ?? "" }, { enabled: Boolean(params?.slug) });
  if (isLoading) return <PublicLayout><div className="detail-loading">Chargement de l’article…</div></PublicLayout>;
  if (error || !post) return <PublicLayout><div className="detail-loading"><p>Cet article n’est pas disponible.</p><Link href="/blog">Retour aux notes</Link></div></PublicLayout>;
  const date = post.publishedAt ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(post.publishedAt)) : "Brouillon";
  return <PublicLayout><article className="article-page"><Link href="/blog" className="back-link"><ArrowLeft size={17} /> Toutes les notes</Link><header className="article-header"><div className="eyebrow"><BookOpenText size={14} /> {date}</div><h1>{post.title}</h1><p>{post.excerpt}</p><div className="tag-row">{post.tags.map(tag => <span key={tag}>#{tag}</span>)}</div></header>{post.coverImageUrl ? <img src={post.coverImageUrl} alt="" className="article-cover" /> : null}<div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} /></article></PublicLayout>;
}
