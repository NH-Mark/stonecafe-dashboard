import ProtectedRoute from "@/features/auth/ProtectedRoute";
import { Toaster } from "sonner";

export default function KitchenDisplayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="h-screen overflow-hidden bg-slate-100">
        {children}
         <Toaster richColors position="top-right" />
      </div>
    </ProtectedRoute>
  );
}