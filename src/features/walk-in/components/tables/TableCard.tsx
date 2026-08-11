
// components/tables/TableCard.tsx

"use client";

import {
    ArrowUpRight,
    CheckCircle2,
    CreditCard,
} from "lucide-react";

import {
    useRouter,
} from "next/navigation";

interface TableCardProps {
    table: {
        id: number;
        name: string;
        status:
            | "available"
            | "occupied"
            | "billing";

        session: {
            id: number;
            orderCount: number;
            total: number;
        } | null;
    };
}

export function TableCard({
    table,
}: TableCardProps) {
    const router = useRouter();

    const available =
        table.status === "available";

    const billing =
        table.status === "billing";

    function openTable() {
        if (available) {
            router.push(
                `/walk-in/session/new?table=${table.id}`
            );

            return;
        }

        if (!table.session?.id) {
            console.error(
                "Cannot open table: active session not found",
                table
            );

            return;
        }

        router.push(
            `/walk-in/session/${table.session.id}`
        );

    }

    const statusLabel =
        available
            ? "Available"
            : billing
                ? "Billing"
                : "Occupied";

    return (
        <button
            type="button"
            onClick={openTable}
            className={`
                group
                relative
                flex
                min-h-[172px]
                w-full
                flex-col
                justify-between
                overflow-hidden
                rounded-2xl
                border
                p-4
                text-left
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
                active:translate-y-0
                active:shadow-sm
                focus:outline-none
                focus:ring-2
                focus:ring-[#40332a]/20
                sm:min-h-[185px]
                sm:p-5
                ${
                    available
                        ? "bg-green-100"
                        : "bg-white"
                }
            `}
            style={{
                borderColor:
                    billing
                        ? "#40332a"
                        : "#e2ddd7",
            }}
        >
            {/* ========================================================= */}
            {/* TOP */}
            {/* ========================================================= */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >
                {/* Status */}

                <span
                    className={`
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        px-2.5
                        py-1
                        text-[11px]
                        font-semibold
                        ${
                            available
                                ? "bg-[#edf7f0] text-[#28613c]"
                                : billing
                                    ? "bg-[#40332a] text-white"
                                    : "bg-[#f3eee8] text-[#665448]"
                        }
                    `}
                >
                    {available ? (
                        <CheckCircle2
                            className="
                                h-3.5
                                w-3.5
                            "
                        />
                    ) : billing ? (
                        <CreditCard
                            className="
                                h-3.5
                                w-3.5
                            "
                        />
                    ) : (
                        <span
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-current
                            "
                        />
                    )}

                    {statusLabel}
                </span>

                {/* Open icon */}

                <span
                    className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#f7f5f2]
                        text-[#6f665e]
                        transition
                        group-hover:bg-[#40332a]
                        group-hover:text-white
                    "
                >
                    <ArrowUpRight
                        className="
                            h-4
                            w-4
                            transition
                            group-hover:translate-x-0.5
                            group-hover:-translate-y-0.5
                        "
                    />
                </span>
            </div>

            {/* ========================================================= */}
            {/* TABLE ID / NAME */}
            {/* ========================================================= */}

            <div
                className="
                    mt-5
                    flex
                    items-center
                    gap-3
                "
            >
                {/* Table number */}

                <div
                    className={`
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        text-lg
                        font-bold
                        ${
                            available
                                ? "bg-[#f3eee8] text-[#40332a]"
                                : billing
                                    ? "bg-[#eee9e3] text-[#40332a]"
                                    : "bg-[#f3eee8] text-[#40332a]"
                        }
                    `}
                >
                    {table.id}
                </div>

                <div className="min-w-0">
                    <p
                        className="
                            truncate
                            text-base
                            font-bold
                            tracking-tight
                            text-[#332c27]
                            sm:text-lg
                        "
                    >
                        {table.name}
                    </p>

                    <p
                        className="
                            mt-0.5
                            text-xs
                            text-[#918880]
                        "
                    >
                        Table {table.id}
                    </p>
                </div>
            </div>

            {/* ========================================================= */}
            {/* BOTTOM */}
            {/* ========================================================= */}

            <div
                className="
                    mt-4
                    flex
                    items-end
                    justify-between
                    gap-3
                "
            >
                {available ? (
                    <>
                        <div>
                            <p
                                className="
                                    text-xs
                                    text-[#918880]
                                "
                            >
                                Ready for guests
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-sm
                                    font-semibold
                                    text-[#40332a]
                                "
                            >
                                Open table
                            </p>
                        </div>

                        <span
                            className="
                                text-xs
                                font-medium
                                text-[#6c625a]
                                transition
                                group-hover:text-[#40332a]
                            "
                        >
                            Start
                        </span>
                    </>
                ) : (
                    <>
                     
                        <span
                            className="
                                rounded-lg
                                bg-[#f7f5f2]
                                px-2.5
                                py-1.5
                                text-[11px]
                                font-semibold
                                text-[#62584f]
                                transition
                                group-hover:bg-[#40332a]
                                group-hover:text-white
                            "
                        >
                            Open
                        </span>
                    </>
                )}
            </div>
        </button>
    );
}
