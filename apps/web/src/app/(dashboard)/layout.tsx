import { Sidebar } from "@/components/layout/sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pl-64">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
