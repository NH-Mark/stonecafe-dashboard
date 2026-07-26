"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

import SidebarItem from "./SidebarItem";


interface Props {

    title: string;

    icon: React.ElementType;

    children: any[];

}


export default function SidebarGroup({
    title,
    icon: Icon,
    children
}: Props) {


    const pathname = usePathname();


    const hasActiveChild =
        children.some((item) =>
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`)
        );


    const [open, setOpen] =
        useState(hasActiveChild);

    useEffect(() => {
        if (hasActiveChild) {
            setOpen(true);
        }
    }, [hasActiveChild]);

    return (

        <div className="space-y-1">


            <button

                onClick={() => setOpen(!open)}

                className={`
                        w-full
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        px-3
                        py-2.5
                        text-sm
                        font-medium
                        transition-colors

                        ${
                            hasActiveChild
                                ? "bg-[#c3b6a4] text-[#40332a]"
                                : "text-[#f3f3f3] hover:bg-white/10"
                        }
                        `}
            >


                <div className="flex items-center gap-3">

                    <Icon size={18} />

                    <span>
                        {title}
                    </span>

                </div>


                <ChevronDown

                    size={16}

                     className={`
                            transition-transform
                            duration-200
                            text-[#d9d9d8]
                            ${open ? "rotate-180" : ""}
                        `}

                />


            </button>



            <div
                className={`
                            overflow-hidden
                            transition-all
                            duration-300
                            ${open ? "max-h-96 mt-1" : "max-h-0"}
                            `}
                                        >


                                            <div className="
                            ml-6
                            border-l border-[#6b5649]
                            pl-4
                            space-y-1
                            ">
                    {
                        children.map((item) => (

                            <SidebarItem

                                key={item.href}

                                href={item.href}

                                title={item.title}

                                icon={item.icon}

                            />

                        ))

                    }


                </div>


            </div>


        </div>

    );


}