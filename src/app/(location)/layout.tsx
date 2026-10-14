
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import type { ReactNode } from "react";

export default function LocationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-[#f3f3f3]">
      {children}
    </div>
    </ProtectedRoute>
   
  );
}
