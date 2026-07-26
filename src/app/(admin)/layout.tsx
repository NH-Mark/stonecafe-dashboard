import AdminLayout from "@/components/layout/admin/AdminLayout";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import { Toaster } from "sonner";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AdminLayout>
        {children}
          <Toaster richColors position="top-right" />
      </AdminLayout>
    </ProtectedRoute>
  );
}