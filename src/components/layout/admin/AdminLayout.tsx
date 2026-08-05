"use client";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import AdminMobileSidebar from "./AdminMobileSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full overflow-hidden bg-[#f3f3f3] text-[#40332a]">
            <div className="hidden lg:flex shrink-0">
                <AdminSidebar />
            </div>

            <div className="flex flex-1 flex-col min-h-screen min-w-0">
                <div className="lg:hidden bg-white border-b">
                    <AdminMobileSidebar />
                </div>

                <AdminHeader />

                <main className="flex-1 min-w-0 overflow-hidden p-6">
                    {children}
                </main>

                <AdminFooter />
            </div>
        </div>
    );
}