// app/pos/session/new/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { createDiningSession } from "@/features/walk-in/dining-session.service";




export default function NewDiningSessionPage() {

    const router = useRouter();

    const searchParams =
        useSearchParams();

    const tableId =
        searchParams.get("table");


    const [error, setError] =
        useState<string | null>(null);


    useEffect(() => {

        if (!tableId) {

            setError(
                "No table was selected."
            );

            return;

        }


        let cancelled = false;


        async function createSession() {

            try {

                const session =
                    await createDiningSession(
                        Number(tableId)
                    );


                if (cancelled) {
                    return;
                }


                router.replace(
                    `/walk-in/session/${session.id}`
                );

            } catch (error) {

                console.error(
                    "Failed to create dining session:",
                    error
                );


                if (cancelled) {
                    return;
                }


                setError(
                    error instanceof Error
                        ? error.message
                        : "Unable to start table."
                );

            }

        }


        createSession();


        return () => {
            cancelled = true;
        };

    }, [tableId, router]);


    if (error) {

        return (

            <div
                className="
                    flex
                    h-full
                    items-center
                    justify-center
                    p-6
                "
            >

                <div
                    className="
                        rounded-2xl
                        border
                        bg-white
                        p-6
                        text-center
                    "
                >

                    <h2
                        className="
                            font-semibold
                        "
                        style={{
                            color: "#40332a",
                        }}
                    >
                        Unable to open table
                    </h2>

                    <p
                        className="
                            mt-2
                            text-sm
                        "
                        style={{
                            color: "#40332a",
                            opacity: 0.65,
                        }}
                    >
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            router.back()
                        }
                        className="
                            mt-4
                            rounded-xl
                            px-4
                            py-2
                            text-sm
                            font-semibold
                        "
                        style={{
                            backgroundColor:
                                "#40332a",
                            color: "#ffffff",
                        }}
                    >
                        Go Back
                    </button>

                </div>

            </div>

        );
    }


    return (

        <div
            className="
                flex
                h-full
                flex-col
                items-center
                justify-center
                gap-3
            "
        >

            <RefreshCw
                className="
                    h-6
                    w-6
                    animate-spin
                "
                style={{
                    color: "#c3b6a4",
                }}
            />

            <p
                className="
                    text-sm
                "
                style={{
                    color: "#40332a",
                    opacity: 0.65,
                }}
            >
                Opening table...
            </p>

        </div>

    );
}