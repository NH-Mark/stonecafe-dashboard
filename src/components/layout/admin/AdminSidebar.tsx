"use client";

import Image from "next/image";

import { adminMenu } from "@/config/admin-menu";

import { useAuth } from "@/features/auth/useAuth";
import SidebarItem from "./SidebarItem";
import SidebarMenu from "./SidebarMenu";
import { filterMenuByPermission } from "@/features/auth/filter-menu";

export default function AdminSidebar() {

    const { user } = useAuth();
    console.log(user);
    const menu = filterMenuByPermission(
        adminMenu,
        user?.permissions ?? []
    );
    
    return (
       <aside
            className="
            hidden
            w-64
            lg:flex
            lg:flex-col
            bg-[#40332a]
            text-white
            "
        >

            <div className="flex h-20 items-center gap-3 border-b px-5">

                <Image
                    src="/images/stone-logo.webp"
                    width={44}
                    height={44}
                    alt="Stone Cafe"
                />

                <div>
                   <h2 className="font-bold tracking-wide text-[#ddcfbe]">
                        STONE CAFE
                    </h2>

                    <p className="text-xs text-[#c3b6a4]">
                        Admin Panel
                    </p>
                </div>

            </div>

            <nav className="flex-1 space-y-1 p-2">

                <SidebarMenu items={menu}/>

            </nav>

        </aside>
    );
}