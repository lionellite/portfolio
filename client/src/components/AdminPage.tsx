import DashboardLayout from "./DashboardLayout";

export default function AdminPage({ children }: { children: React.ReactNode }) {
  return <DashboardLayout><div className="admin-page">{children}</div></DashboardLayout>;
}
