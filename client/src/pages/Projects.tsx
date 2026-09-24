import PublicLayout from "@/components/PublicLayout";
import ProjectSignal from "@/components/ProjectSignal";
import { trpc } from "@/lib/trpc";
import { ArrowUpRight, FolderKanban, Github } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

const systemProfiles = ["API_GATEWAY", "ML_INFERENCE", "CLIENT_SYNC", "EVENT_PIPE", "SPATIAL_ANALYSIS", "MEDIA_QUEUE", "CONTENT_NODE"];

function ProjectCover({ title, imageUrl, index }: { title: string; imageUrl: string | null; index: number }) {
  return imageUrl ? <img src={imageUrl} alt={`Couverture du projet ${title}`} className="project-card__image" /> : (
    <ProjectSignal title={title} index={index} className="project-card__visual" />
  );
}

export default function Projects() {
  const { language } = useLanguage();
  const fr = language === "fr";
  const { data: projects, isLoading, isError } = trpc.projects.list.useQuery();

  return (
    <PublicLayout>
      <section className="page-hero">
        <div className="eyebrow"><FolderKanban size={14} /> {fr ? "Travaux sélectionnés" : "Selected work"}</div>
        <h1>{fr ? "Des systèmes conçus" : "Systems designed"}<br /><em>{fr ? "pour tenir en production." : "to hold up in production."}</em></h1>
        <p>{fr ? "Des cas concrets où l’API, la donnée, le déploiement et l’interface sont traités comme un même système à rendre fiable." : "Concrete cases where APIs, data, deployment and interfaces are treated as one system to make reliable."}</p>
        <div className="system-registry"><span><i /> REGISTRY: {projects?.length ?? "—"} SYSTEMS</span><span>MODE: CASE_STUDY</span><span>STATUS: DOCUMENTED</span></div>
      </section>
      <section className="project-list-section">
        {isLoading ? <div className="project-list project-list--skeleton" aria-label={fr ? "Chargement des projets" : "Loading projects"}>{[1, 2, 3].map(item => <div className="project-card project-card--skeleton" key={item}><div className="project-card__cover" /><div className="project-card__content"><div /><div className="project-card__main"><span /><span /><span /></div></div></div>)}</div> : isError ? <div className="empty-public"><FolderKanban size={28} /><p>{fr ? "Les projets sont temporairement indisponibles. Réessayez dans un instant." : "Projects are temporarily unavailable. Please try again shortly."}</p></div> : projects?.length ? (
          <div className="project-list">
            {projects.map((project, index) => (
              <article className="project-card" key={project.id}>
                <Link href={`/projets/${project.slug}`} className="project-card__cover"><ProjectCover title={project.title} imageUrl={project.coverImageUrl} index={index} /></Link>
                <div className="project-card__content">
                  <div className="project-card__number">0{index + 1}</div>
                  <div className="project-card__main">
                    <div className="project-card__heading"><h2>{project.title}</h2>{project.isFeatured ? <span className="feature-label">PRIORITY</span> : null}</div>
                    <p>{project.shortDescription}</p>
                    <div className="tag-row">{project.technologies.slice(0, 4).map(tech => <span key={tech}>{tech}</span>)}</div>
                    <div className="project-card__telemetry"><span>PROFILE: {systemProfiles[index % systemProfiles.length]}</span><span>STACK: {project.technologies.length} MODULES</span><span>RECORD: SYS.{String(index + 1).padStart(2, "0")}</span></div>
                  </div>
                  <div className="project-card__actions">
                    <Link href={`/projets/${project.slug}`} aria-label={`Voir ${project.title}`} className="round-link"><ArrowUpRight size={20} /></Link>
                    {project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer" className="icon-text"><Github size={16} /> {fr ? "Code" : "Source"}</a> : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : <div className="empty-public"><FolderKanban size={28} /><p>{fr ? "Les projets publiés apparaîtront bientôt ici." : "Published projects will appear here soon."}</p></div>}
      </section>
    </PublicLayout>
  );
}
