import ProtectedRoute from "@/features/auth/ProtectedRoute"

import { Header } from "@/features/walk-in/components/Header"
import { POSNav } from "@/features/walk-in/components/POSNav"

import { Toaster } from "sonner"

export default function POSLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProtectedRoute>
            <div
                className="
                    flex
                    h-dvh
                    min-h-0
                    flex-col
                    overflow-hidden
                    bg-slate-100
                "
            >
                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

               

                {/* ================================================= */}
                {/* PAGE CONTENT */}
                {/* ================================================= */}

                <main
                    className="
                        min-h-0
                        flex-1
                        overflow-hidden
                    "
                >
                    {children}
                </main>

                {/* ================================================= */}
                {/* TOASTER */}
                {/* ================================================= */}

                <Toaster
                    richColors
                    position="top-right"
                />
            </div>
        </ProtectedRoute>
    )
}