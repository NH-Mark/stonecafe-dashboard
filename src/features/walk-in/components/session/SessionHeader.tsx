// features/walk-in/components/session/SessionHeader.tsx

"use client";

import {
    ArrowLeft,
    RefreshCw,
    UtensilsCrossed,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    DiningSession,
} from "@/features/walk-in/dining-session.service";


interface SessionHeaderProps {

    session:
        DiningSession;

    total:
        number;

    refreshing:
        boolean;

    onBack:
        () => void;

    onRefresh:
        () => void;
}


export function SessionHeader({

    session,

    total,

    refreshing,

    onBack,

    onRefresh,

}: SessionHeaderProps) {

    return (

        <header
            className="
                shrink-0
                border-b
                bg-white
            "
            style={{
                borderColor:
                    "#d9d9d8",
            }}
        >

            <div
                className="
                    flex
                    min-h-16
                    items-center
                    gap-3
                    px-3
                    py-2
                    sm:px-4
                    lg:px-5
                "
            >

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onBack}
                    className="
                        h-11
                        w-11
                        shrink-0
                        rounded-xl
                    "
                    style={{
                        borderColor:
                            "#d9d9d8",

                        color:
                            "#40332a",
                    }}
                >

                    <ArrowLeft
                        className="
                            h-5
                            w-5
                        "
                    />

                </Button>


                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <UtensilsCrossed
                            className="
                                h-5
                                w-5
                                shrink-0
                            "
                            style={{
                                color:
                                    "#a5765a",
                            }}
                        />


                        <h1
                            className="
                                truncate
                                text-lg
                                font-bold
                                sm:text-xl
                            "
                            style={{
                                color:
                                    "#40332a",
                            }}
                        >
                            {session.table?.name ??
                                "Dining Table"}
                        </h1>


                        <SessionStatus
                            status={
                                session.status
                            }
                        />

                    </div>


                    <p
                        className="
                            text-xs
                        "
                        style={{
                            color:
                                "#40332a",

                            opacity:
                                0.55,
                        }}
                    >
                        Session #{session.id}
                    </p>

                </div>


                <div
                    className="
                        hidden
                        text-right
                        sm:block
                    "
                >

                    <p
                        className="
                            text-[11px]
                        "
                        style={{
                            color:
                                "#40332a",

                            opacity:
                                0.55,
                        }}
                    >
                        Table Total
                    </p>


                    <p
                        className="
                            text-lg
                            font-bold
                        "
                        style={{
                            color:
                                "#40332a",
                        }}
                    >
                        {total.toFixed(2)}
                        {" "}QAR
                    </p>

                </div>


                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="
                        h-11
                        w-11
                        shrink-0
                        rounded-xl
                    "
                    style={{
                        borderColor:
                            "#d9d9d8",

                        color:
                            "#40332a",
                    }}
                >

                    <RefreshCw
                        className={`
                            h-4
                            w-4
                            ${
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        `}
                    />

                </Button>

            </div>

        </header>

    );
}


/*
|--------------------------------------------------------------------------
| Session status
|--------------------------------------------------------------------------
*/

function SessionStatus({

    status,

}: {

    status:
        DiningSession["status"];

}) {

    const label =
        status === "open"
            ? "Open"
            : status === "billing"
                ? "Billing"
                : status;


    return (

        <span
            className="
                rounded-full
                px-2
                py-1
                text-[10px]
                font-bold
                uppercase
            "
            style={{
                backgroundColor:
                    status === "billing"
                        ? "#ddcfbe"
                        : "#c3b6a4",

                color:
                    "#40332a",
            }}
        >
            {label}
        </span>

    );
}