
"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Armchair,
    CheckCircle2,
    Clock3,
    CreditCard,
    Home,
    RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    TableCard,
} from "@/features/walk-in/components/tables/TableCard";

import {
    getTables,
} from "@/features/walk-in/components/tables/tables.service";
import { SessionHeader } from "@/features/walk-in/components/session/SessionHeader";
import { POSNav } from "@/features/walk-in/components/POSNav";
import { useRouter } from "next/navigation";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export type TableStatus =
    | "available"
    | "occupied"
    | "billing";

export type TableFilter =
    | "all"
    | TableStatus;

export interface RestaurantTableSession {
    id: number;
    orderCount: number;
    total: number;
}

export interface RestaurantTable {
    id: number;
    name: string;
    status: TableStatus;
    session: RestaurantTableSession | null;
}

/*
|--------------------------------------------------------------------------
| Filters
|--------------------------------------------------------------------------
*/

const FILTERS: {
    value: TableFilter;
    label: string;
}[] = [
        {
            value: "all",
            label: "All",
        },
        {
            value: "available",
            label: "Available",
        },
        {
            value: "occupied",
            label: "Occupied",
        },
        {
            value: "billing",
            label: "Billing",
        },
    ];

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export default function TablesPage() {

    const router = useRouter();
    const [
        filter,
        setFilter,
    ] = useState<TableFilter>("all");

    const [
        tables,
        setTables,
    ] = useState<RestaurantTable[]>([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState<string | null>(null);

    /*
    |--------------------------------------------------------------------------
    | Load tables
    |--------------------------------------------------------------------------
    */

    const loadTables =
        useCallback(
            async (
                showRefresh = false
            ) => {
                try {
                    if (showRefresh) {
                        setRefreshing(true);
                    } else {
                        setLoading(true);
                    }

                    setError(null);

                    const data =
                        await getTables();

                    setTables(data);
                } catch (error) {
                    console.error(
                        "Failed to load tables:",
                        error
                    );

                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load tables."
                    );
                } finally {
                    setLoading(false);
                    setRefreshing(false);
                }
            },
            []
        );

    /*
    |--------------------------------------------------------------------------
    | Initial load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        void loadTables();
    }, [loadTables]);

    /*
    |--------------------------------------------------------------------------
    | Filtered tables
    |--------------------------------------------------------------------------
    */

    const filteredTables =
        useMemo(() => {
            if (filter === "all") {
                return tables;
            }

            return tables.filter(
                table =>
                    table.status === filter
            );
        }, [
            tables,
            filter,
        ]);

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    const statistics =
        useMemo(() => {
            return {
                total: tables.length,

                available:
                    tables.filter(
                        table =>
                            table.status ===
                            "available"
                    ).length,

                occupied:
                    tables.filter(
                        table =>
                            table.status ===
                            "occupied"
                    ).length,

                billing:
                    tables.filter(
                        table =>
                            table.status ===
                            "billing"
                    ).length,
            };
        }, [tables]);

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div
            className="
                flex
                h-full
                min-h-0
                flex-col
                bg-[#f5f5f3]
            "
        >
            {/* ========================================================= */}
            {/* HEADER */}
            {/* ========================================================= */}

            <header
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
            flex
            w-full
            items-center
            gap-3
            px-2
            py-3
            sm:px-3
            lg:py-3.5
        "
    >
        {/* HOME — LEFT EDGE */}
        <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard")}
            aria-label="Go to dashboard"
            title="Dashboard"
            className="
                h-10
                w-10
                shrink-0
                rounded-xl
                border-[#ded9d3]
                bg-white
                text-[#40332a]
                shadow-none
                hover:bg-[#faf9f7]
            "
        >
            <Home className="h-5 w-5" />
        </Button>

        {/* TABLE IDENTITY */}
        <div
            className="
                flex
                min-w-0
                items-center
                gap-3
            "
        >
            {/* <div
                className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#40332a]
                    shadow-sm
                "
            >
                <Armchair className="h-5 w-5 text-white" />
            </div> */}

            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    <h1
                        className="
                            truncate
                            text-lg
                            font-bold
                            tracking-tight
                            text-[#2f2924]
                            sm:text-xl
                        "
                    >
                        Dining Tables
                    </h1>

                    <span
                        className="
                            hidden
                            rounded-full
                            bg-[#f5f1ed]
                            px-2
                            py-0.5
                            text-[11px]
                            font-semibold
                            text-[#6b5849]
                            sm:inline-flex
                        "
                    >
                        {tables.length} tables
                    </span>
                </div>

                <p
                    className="
                        hidden
                        text-xs
                        text-[#81786f]
                        sm:block
                    "
                >
                    Monitor tables and manage active orders
                </p>
            </div>
        </div>
    </div>
</header>

            <POSNav />

            {/* ========================================================= */}
            {/* CONTENT */}
            {/* ========================================================= */}

            <main
                className="
                    min-h-0
                    flex-1
                    overflow-hidden
                "
            >
                <div
                    className="
                        mx-auto
                        flex
                        h-full
                        w-full
                        max-w-[1800px]
                        min-h-0
                        flex-col
                        px-4
                        py-4
                        sm:px-5
                        lg:px-7
                        lg:py-5
                        xl:px-8
                    "
                >
                    {/* ------------------------------------------------- */}
                    {/* Filter bar */}
                    {/* ------------------------------------------------- */}

                    <div
                        className="
                            mb-4
                            flex
                            shrink-0
                            items-center
                            justify-between
                            gap-3
                        "
                    >
                        <div className="min-w-0">
                            <h2
                                className="
                                    text-sm
                                    font-semibold
                                    text-[#40332a]
                                    sm:text-base
                                "
                            >
                                Tables
                            </h2>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-[#8a8179]
                                "
                            >
                                {filteredTables.length}{" "}
                                {filteredTables.length ===
                                    1
                                    ? "table"
                                    : "tables"}{" "}
                                shown
                            </p>
                        </div>

                        <div
                            className="
                                flex
                                shrink-0
                                overflow-x-auto
                                rounded-xl
                                border
                                bg-white
                                p-1
                            "
                            style={{
                                borderColor:
                                    "#ded9d3",
                            }}
                        >
                            {FILTERS.map(
                                item => (
                                    <FilterButton
                                        key={
                                            item.value
                                        }
                                        active={
                                            filter ===
                                            item.value
                                        }
                                        onClick={() =>
                                            setFilter(
                                                item.value
                                            )
                                        }
                                    >
                                        {
                                            item.label
                                        }

                                        <span
                                            className="
                                                ml-1.5
                                                text-[11px]
                                                opacity-60
                                            "
                                        >
                                            {item.value ===
                                                "all"
                                                ? statistics.total
                                                : statistics[
                                                item.value
                                                ]}
                                        </span>
                                    </FilterButton>
                                )
                            )}
                        </div>
                    </div>

                    {/* ------------------------------------------------- */}
                    {/* Scrollable table area */}
                    {/* ------------------------------------------------- */}

                    <div
                        className="
                            min-h-0
                            flex-1
                            overflow-y-auto
                            pb-4
                        "
                    >
                        {/* ============================================= */}
                        {/* Loading */}
                        {/* ============================================= */}

                        {loading && (
                            <div
                                className="
                                    flex
                                    min-h-72
                                    items-center
                                    justify-center
                                "
                            >
                                <div
                                    className="
                                        flex
                                        flex-col
                                        items-center
                                        gap-3
                                        text-sm
                                        text-[#81786f]
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-white
                                            shadow-sm
                                        "
                                    >
                                        <RefreshCw
                                            className="
                                                h-4
                                                w-4
                                                animate-spin
                                            "
                                        />
                                    </div>

                                    <span>
                                        Loading tables...
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* ============================================= */}
                        {/* Error */}
                        {/* ============================================= */}

                        {!loading &&
                            error && (
                                <div
                                    className="
                                        flex
                                        min-h-72
                                        flex-col
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        border
                                        bg-white
                                        p-6
                                        text-center
                                        shadow-sm
                                    "
                                    style={{
                                        borderColor:
                                            "#e1ddd8",
                                    }}
                                >
                                    <div
                                        className="
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-[#f5f1ed]
                                        "
                                    >
                                        <Armchair
                                            className="
                                                h-5
                                                w-5
                                                text-[#6b5849]
                                            "
                                        />
                                    </div>

                                    <p
                                        className="
                                            mt-4
                                            font-semibold
                                            text-[#40332a]
                                        "
                                    >
                                        Unable to load
                                        tables
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            max-w-md
                                            text-sm
                                            text-[#81786f]
                                        "
                                    >
                                        {error}
                                    </p>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            loadTables(
                                                true
                                            )
                                        }
                                        className="
                                            mt-5
                                            rounded-xl
                                            border-[#ded9d3]
                                        "
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            )}

                        {/* ============================================= */}
                        {/* Empty */}
                        {/* ============================================= */}

                        {!loading &&
                            !error &&
                            filteredTables.length ===
                            0 && (
                                <EmptyTables
                                    filter={
                                        filter
                                    }
                                />
                            )}

                        {/* ============================================= */}
                        {/* Tables */}
                        {/* ============================================= */}

                        {!loading &&
                            !error &&
                            filteredTables.length >
                            0 && (
                                <div
                                    className="
                                        grid
                                        grid-cols-2
                                        gap-3
                                        sm:grid-cols-3
                                        md:grid-cols-4
                                        lg:grid-cols-4
                                        xl:grid-cols-5
                                        2xl:grid-cols-6
                                    "
                                >
                                    {filteredTables.map(
                                        table => (
                                            <TableCard
                                                key={
                                                    table.id
                                                }
                                                table={
                                                    table
                                                }

                                            />
                                        )
                                    )}
                                </div>
                            )}
                    </div>
                </div>
            </main>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Stat Card
|--------------------------------------------------------------------------
*/

function StatCard({
    label,
    value,
    icon,
    active,
    onClick,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                flex
                min-w-0
                items-center
                gap-3
                rounded-2xl
                border
                px-3
                py-3
                text-left
                transition-all
                ${active
                    ? "border-[#40332a] bg-[#40332a] text-white shadow-sm"
                    : "border-[#e3ded8] bg-white text-[#40332a] hover:border-[#cfc7bf] hover:shadow-sm"
                }
            `}
        >
            <div
                className={`
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    ${active
                        ? "bg-white/15"
                        : "bg-[#f5f2ef]"
                    }
                `}
            >
                <span
                    className="
                        [&>svg]:h-4
                        [&>svg]:w-4
                    "
                >
                    {icon}
                </span>
            </div>

            <div className="min-w-0">
                <p
                    className={`
                        text-xs
                        ${active
                            ? "text-white/70"
                            : "text-[#8a8179]"
                        }
                    `}
                >
                    {label}
                </p>

                <p
                    className="
                        mt-0.5
                        text-lg
                        font-bold
                        leading-none
                    "
                >
                    {value}
                </p>
            </div>
        </button>
    );
}

/*
|--------------------------------------------------------------------------
| Filter Button
|--------------------------------------------------------------------------
*/

function FilterButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                h-8
                shrink-0
                rounded-lg
                px-3
                text-xs
                font-medium
                transition
                ${active
                    ? "bg-[#40332a] text-white shadow-sm"
                    : "text-[#625950] hover:bg-[#f5f2ef]"
                }
            `}
        >
            {children}
        </button>
    );
}

/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

function EmptyTables({
    filter,
}: {
    filter: TableFilter;
}) {
    const label =
        filter === "all"
            ? "No tables available"
            : `No ${filter} tables`;

    const description =
        filter === "all"
            ? "There are currently no dining tables to display."
            : "Try selecting another table status.";

    return (
        <div
            className="
                flex
                min-h-72
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                bg-white
                p-6
                text-center
                shadow-sm
            "
            style={{
                borderColor:
                    "#e1ddd8",
            }}
        >
            <div
                className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#f5f1ed]
                "
            >
                <Armchair
                    className="
                        h-6
                        w-6
                        text-[#6b5849]
                    "
                />
            </div>

            <p
                className="
                    mt-4
                    font-semibold
                    text-[#40332a]
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-1
                    text-sm
                    text-[#81786f]
                "
            >
                {description}
            </p>
        </div>
    );
}
