
"use client";

import {
    Plus,
    Armchair,
    ClipboardList,
} from "lucide-react";

import {
    usePathname,
    useRouter,
} from "next/navigation";

export function POSNav() {
    const router = useRouter();
    const pathname = usePathname();

    const tabs = [
        {
            label: "New Order",
            href: "/walk-in",
            icon: Plus,
        },
        {
            label: "Tables",
            href: "/walk-in/tables",
            icon: Armchair,
        },
        // {
        //     label: "Orders",
        //     href: "/walk-in/orders",
        //     icon: ClipboardList,
        // },
    ];

    return (
        <nav
            className="
                shrink-0
                border-b
                bg-white
            "
            style={{
                borderColor: "#e5e2dd",
            }}
        >
            <div
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-[1800px]
                    items-center
                    gap-1
                    overflow-x-auto
                    px-4
                    sm:px-5
                    lg:px-7
                    xl:px-8
                "
            >
                {tabs.map(tab => {
                    const Icon = tab.icon;

                    const active =
                        pathname === tab.href;

                    return (
                        <button
                            key={tab.href}
                            type="button"
                            onClick={() =>
                                router.push(tab.href)
                            }
                            className={`
                                relative
                                flex
                                h-11
                                shrink-0
                                items-center
                                gap-2
                                px-4
                                text-sm
                                font-medium
                                transition-colors
                                ${
                                    active
                                        ? "text-[#40332a]"
                                        : "text-[#81786f] hover:text-[#40332a]"
                                }
                            `}
                        >
                            <Icon
                                className="
                                    h-4
                                    w-4
                                "
                            />

                            {tab.label}

                            {/* Active indicator */}
                            {active && (
                                <span
                                    className="
                                        absolute
                                        inset-x-3
                                        bottom-0
                                        h-0.5
                                        rounded-full
                                        bg-[#40332a]
                                    "
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
