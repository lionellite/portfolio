import PublicLayout from "@/components/PublicLayout";
import { trpc } from "@/lib/trpc";
import { ArrowUpRight, FolderKanban, Github } from "lucide-react";
import { Link } from "wouter";

function ProjectCover({ title, imageUrl, index }: { title: string; imageUrl: string | null; index: number }) {
  return imageUrl ? <img src={imageUrl} alt={`Couverture du projet ${title}`} className="project-card__image" /> : (
    <div className={`project-card__visual visual-${(index % 5) + 1}`} aria-hidden="true">
      <span>{title.slice(0, 2).toUpperCase()}</span><i /><b />
    </div>
  );
}

export default function Projects() {
  const { data: projects, isLoading, isError } = trpc.projects.list.useQuery();

  return (
    <PublicLayout>
      <section className="page-hero">
        <div className="eyebrow"><FolderKanban size={14} /> Travaux sélectionnés</div>
        <h1>Des produits conçus<br /><em>pour répondre à un besoin précis.</em></h1>
        <p>Une sélection de projets où se rencontrent développement backend, infrastructure, intelligence artificielle et expériences numériques utiles.</p>
      </section>
      <section className="project-list-section">
        {isLoading ? <div className="project-list project-list--skeleton" aria-label="Chargement des projets">{[1, 2, 3].map(item => <div className="project-card project-card--skeleton" key={item}><div className="project-card__cover" /><div className="project-card__content"><div /><div className="project-card__main"><span /><span /><span /></div></div></div>)}</div> : isError ? <div className="empty-public"><FolderKanban size={28} /><p>Les projets sont temporairement indisponibles. Réessayez dans un instant.</p></div> : projects?.length ? (
          <div className="project-list">
            {projects.map((project, index) => (
              <article className="project-card" key={project.id}>
                <Link href={`/projets/${project.slug}`} className="project-card__cover"><ProjectCover title={project.title} imageUrl={project.coverImageUrl} index={index} /></Link>
                <div className="project-card__content">
                  <div className="project-card__number">0{index + 1}</div>
                  <div className="project-card__main">
                    <div className="project-card__heading"><h2>{project.title}</h2>{project.isFeatured ? <span className="feature-label">En lumière</span> : null}</div>
                    <p>{project.shortDescription}</p>
                    <div className="tag-row">{project.technologies.slice(0, 4).map(tech => <span key={tech}>{tech}</span>)}</div>
                  </div>
                  <div className="project-card__actions">
                    <Link href={`/projets/${project.slug}`} aria-label={`Voir ${project.title}`} className="round-link"><ArrowUpRight size={20} /></Link>
                    {project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer" className="icon-text"><Github size={16} /> Code</a> : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : <div className="empty-public"><FolderKanban size={28} /><p>Les projets publiés apparaîtront bientôt ici.</p></div>}
      </section>
    </PublicLayout>
  );
}
