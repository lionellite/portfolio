import AdminPage from "@/components/AdminPage";
import { trpc } from "@/lib/trpc";
import { Activity, BookOpenText, FolderKanban, Mail, Plus, Server, UserRound } from "lucide-react";
import { Link } from "wouter";

export default function AdminOverview() {
  const { data: profileData, isError: profileError, isLoading: profileLoading } = trpc.portfolio.get.useQuery();
  const { data: projects, isError: projectsError, isLoading: projectsLoading } = trpc.projects.listAll.useQuery();
  const { data: posts, isError: postsError, isLoading: postsLoading } = trpc.blog.listAll.useQuery();
  const { data: messages, isError: messagesError, isLoading: messagesLoading } = trpc.contact.list.useQuery();
  const stats = [
    { label: "SYSTEMS_ONLINE", value: projects?.filter(item => item.isPublished).length ?? "…", icon: FolderKanban, href: "/admin/projets" },
    { label: "LOGS_PUBLISHED", value: posts?.filter(item => item.isPublished).length ?? "…", icon: BookOpenText, href: "/admin/articles" },
    { label: "INBOX_PENDING", value: messages?.length ?? "…", icon: Mail, href: "/admin/messages" },
    { label: "PROFILE_RECORDS", value: (profileData?.experiences.length ?? 0) + (profileData?.educations.length ?? 0), icon: UserRound, href: "/admin/profil" },
  ];
  const hasError = profileError || projectsError || postsError || messagesError;
  const isLoading = profileLoading || projectsLoading || postsLoading || messagesLoading;
  if (isLoading) return <AdminPage><div className="terminal-admin-loading" aria-label="Chargement de la console">{[1, 2, 3, 4, 5, 6].map(item => <span key={item} />)}</div></AdminPage>;
  return <AdminPage><div className="terminal-console"><header className="terminal-console__header"><div><p>control@lionel:~$ status --all</p><h1>Console<br /><em>d’opérations.</em></h1><span><i /> ALL_SERVICES_NOMINAL</span></div><Link className="terminal-console__action" href="/admin/articles"><Plus size={16} /> NEW_LOG_ENTRY</Link></header>{hasError ? <div className="terminal-console__alert"><Activity size={16} /> Des sources sont temporairement indisponibles. Actualisez la console.</div> : null}<section className="terminal-console__kpis">{stats.map((stat, index) => <Link href={stat.href} key={stat.label}><div><span>0{index + 1}</span><stat.icon size={17} /></div><strong>{stat.value}</strong><small>{stat.label}</small></Link>)}</section><section className="terminal-console__grid"><article><header><div><p>$ ls ./systems</p><h2>Flux de projets</h2></div><Link href="/admin/projets">MANAGE →</Link></header><div className="terminal-console__list">{projects?.length ? projects.slice(0, 4).map((project, index) => <div key={project.id}><span>{String(index + 1).padStart(2, "0")}</span><i className={project.isPublished ? "is-online" : ""} /><div><strong>{project.title}</strong><small>{project.technologies.slice(0, 2).join(" / ")}</small></div><b>{project.isPublished ? "LIVE" : "DRAFT"}</b></div>) : <p>NO_SYSTEMS_FOUND</p>}</div></article><article><header><div><p>$ cat ./inbox/latest</p><h2>Canal entrant</h2></div><Link href="/admin/messages">OPEN_INBOX →</Link></header><div className="terminal-console__list terminal-console__list--messages">{messages?.length ? messages.slice(0, 4).map((message, index) => <div key={message.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{message.name}</strong><small>{message.email}</small><p>{message.message}</p></div></div>) : <p>INBOX_EMPTY</p>}</div></article></section><footer className="terminal-console__footer"><Server size={15} /><span>NODE: ADMIN_CONTROL / ACCESS: OWNER_ONLY</span></footer></div></AdminPage>;
}
