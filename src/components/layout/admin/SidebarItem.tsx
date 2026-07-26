"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


interface Props {

    href: string;

    title: string;

    icon: React.ElementType;

}


export default function SidebarItem({
    href,
    title,
    icon: Icon
}: Props) {


    const pathname =
        usePathname();


    const active =
        pathname === href ||
        pathname.startsWith(`${href}/`);



    return (

        <Link
            href={href}
            className={`
        flex
        items-center
        gap-3
        rounded-xl
        px-3
        py-2.5
        text-sm
        transition-all
        duration-200
        ${active
                    ? "bg-[#a57653] text-white shadow-sm"
                    : "text-[#d9d9d8] hover:bg-white/10 hover:text-white"
                }
    `}
        >
            <Icon size={17} />
            <span>{title}</span>
        </Link>
    );


}