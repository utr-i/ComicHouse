import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <Sidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}