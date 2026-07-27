"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminMobileSidebar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Button */}
            <button
                onClick={() => setOpen(true)}
                className="lg:hidden p-3 text-[#40332a]"
            >
                ☰
            </button>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Drawer */}
            <div
                className={`
                    fixed top-0 left-0 z-50 h-screen
                    transform transition-transform duration-300
                    lg:hidden
                    ${open ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <div className="relative">

                    <button
                        onClick={() => setOpen(false)}
                        className="absolute right-3 top-3 z-10 text-white"
                    >
                        ✕
                    </button>

                    <AdminSidebar />

                </div>
            </div>
        </>
    );
}