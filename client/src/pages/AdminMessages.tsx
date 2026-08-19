import AdminPage from "@/components/AdminPage";
import { trpc } from "@/lib/trpc";
import { Mail, MailCheck } from "lucide-react";

export default function AdminMessages() {
  const { data: messages, isLoading } = trpc.contact.list.useQuery();
  return <AdminPage><header className="admin-header"><div><p className="admin-eyebrow">Boîte de réception</p><h1>Messages reçus</h1><p>Les demandes envoyées depuis la page de contact apparaissent ici.</p></div></header><section className="admin-card message-table">{isLoading ? <p className="admin-muted">Chargement des messages…</p> : messages?.length ? messages.map(message => <article className="message-row" key={message.id}><div className="message-row__icon">{message.notificationSent ? <MailCheck size={18} /> : <Mail size={18} />}</div><div><div className="message-row__top"><strong>{message.name}</strong><a href={`mailto:${message.email}`}>{message.email}</a><time>{new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(message.createdAt))}</time></div><p>{message.message}</p></div></article>) : <div className="admin-empty"><Mail size={26} /><p>Aucun message pour le moment.</p></div>}</section></AdminPage>;
}
