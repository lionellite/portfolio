import PublicLayout from "@/components/PublicLayout";
import ProjectSignal from "@/components/ProjectSignal";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowUpRight, Github, Layers3 } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function ProjectDetail() {
  const [, params] = useRoute("/projets/:slug");
  const { data: project, isLoading, error } = trpc.projects.bySlug.useQuery({ slug: params?.slug ?? "" }, { enabled: Boolean(params?.slug) });
  if (isLoading) return <PublicLayout><div className="detail-loading">Chargement du projet…</div></PublicLayout>;
  if (error || !project) return <PublicLayout><div className="detail-loading"><p>Ce projet n’est pas disponible.</p><Link href="/projets">Retour aux projets</Link></div></PublicLayout>;

  return (
    <PublicLayout>
      <article className="detail-page">
        <Link href="/projets" className="back-link"><ArrowLeft size={17} /> Tous les projets</Link>
        <header className="detail-header">
          <div><span className="eyebrow"><Layers3 size={14} /> Étude de projet</span><h1>{project.title}</h1><p>{project.shortDescription}</p></div>
          <div className="detail-actions">{project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a> : null}{project.projectUrl ? <a href={project.projectUrl} target="_blank" rel="noreferrer"><ArrowUpRight size={17} /> Visiter</a> : null}</div>
        </header>
        {project.coverImageUrl ? <img src={project.coverImageUrl} alt={`Couverture du projet ${project.title}`} className="detail-cover" /> : <ProjectSignal title={project.title} index={project.id} className="detail-cover detail-cover--abstract" />}
        <div className="detail-body"><div className="detail-side"><p>Technologies</p><div className="tag-row">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div></div><div className="detail-copy"><h2>À propos du projet</h2>{project.description.split("\n").filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></div>
      </article>
    </PublicLayout>
  );
}
