import AdminPage from "@/components/AdminPage";
import { trpc } from "@/lib/trpc";
import { BookOpenText, FolderKanban, Mail, Plus, UserRound } from "lucide-react";
import { Link } from "wouter";

export default function AdminOverview() {
  const { data: profileData, isError: profileError, isLoading: profileLoading } = trpc.portfolio.get.useQuery();
  const { data: projects, isError: projectsError, isLoading: projectsLoading } = trpc.projects.listAll.useQuery();
  const { data: posts, isError: postsError, isLoading: postsLoading } = trpc.blog.listAll.useQuery();
  const { data: messages, isError: messagesError, isLoading: messagesLoading } = trpc.contact.list.useQuery();
  const stats = [
    { label: "Projets publiés", value: projects?.filter(item => item.isPublished).length ?? "…", icon: FolderKanban, href: "/admin/projets" },
    { label: "Articles publiés", value: posts?.filter(item => item.isPublished).length ?? "…", icon: BookOpenText, href: "/admin/articles" },
    { label: "Messages reçus", value: messages?.length ?? "…", icon: Mail, href: "/admin/messages" },
    { label: "Éléments de parcours", value: (profileData?.experiences.length ?? 0) + (profileData?.educations.length ?? 0), icon: UserRound, href: "/admin/profil" },
  ];
  const hasError = profileError || projectsError || postsError || messagesError;
  const isLoading = profileLoading || projectsLoading || postsLoading || messagesLoading;
  if (isLoading) return <AdminPage><div className="admin-loading-grid" aria-label="Chargement du tableau de bord">{[1, 2, 3, 4, 5, 6].map(item => <span key={item} />)}</div></AdminPage>;
  return <AdminPage><header className="admin-header"><div><p className="admin-eyebrow">Espace de gestion</p><h1>Bonjour, Lionel.</h1><p>Voici l’état de votre présence en ligne.</p></div><Link className="admin-primary-action" href="/admin/articles"><Plus size={17} /> Nouvel article</Link></header>{hasError ? <div className="admin-card"><p className="admin-muted">Certaines données sont temporairement indisponibles. Vous pouvez actualiser la page ou réessayer dans quelques instants.</p></div> : null}<section className="admin-stat-grid">{stats.map(stat => <Link href={stat.href} className="admin-stat" key={stat.label}><stat.icon size={19} /><div><span>{stat.label}</span><strong>{stat.value}</strong></div></Link>)}</section><section className="admin-grid-two"><article className="admin-card"><div className="admin-card__heading"><div><p className="admin-eyebrow">À la une</p><h2>Projets récents</h2></div><Link href="/admin/projets">Gérer</Link></div><div className="admin-list">{projects?.length ? projects.slice(0, 4).map(project => <div key={project.id}><span className={`status-pill ${project.isPublished ? "is-live" : "is-draft"}`}>{project.isPublished ? "Publié" : "Brouillon"}</span><strong>{project.title}</strong><small>{project.technologies.slice(0, 2).join(" · ")}</small></div>) : <p className="admin-muted">Aucun projet récent.</p>}</div></article><article className="admin-card admin-card--tint"><div className="admin-card__heading"><div><p className="admin-eyebrow">Messages</p><h2>Dernières prises de contact</h2></div><Link href="/admin/messages">Voir tout</Link></div><div className="admin-list">{messages?.length ? messages.slice(0, 4).map(message => <div key={message.id}><strong>{message.name}</strong><small>{message.email}</small><p>{message.message}</p></div>) : <p className="admin-muted">Aucun message récent.</p>}</div></article></section></AdminPage>;
}
