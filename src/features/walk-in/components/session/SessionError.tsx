// features/walk-in/components/session/SessionError.tsx

import { Button } from "@/components/ui/button";


interface SessionErrorProps {

    message:
        string;

    onBack:
        () => void;

    onRetry:
        () => void;
}


export function SessionError({

    message,

    onBack,

    onRetry,

}: SessionErrorProps) {

    return (

        <div
            className="
                flex
                h-dvh
                items-center
                justify-center
                p-6
            "
            style={{
                backgroundColor:
                    "#f3f3f3",
            }}
        >

            <div
                className="
                    w-full
                    max-w-md
                    rounded-3xl
                    border
                    bg-white
                    p-6
                    text-center
                "
                style={{
                    borderColor:
                        "#d9d9d8",
                }}
            >

                <h2
                    className="
                        text-lg
                        font-bold
                    "
                    style={{
                        color:
                            "#40332a",
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
                        color:
                            "#40332a",

                        opacity:
                            0.6,
                    }}
                >
                    {message}
                </p>


                <div
                    className="
                        mt-5
                        flex
                        justify-center
                        gap-2
                    "
                >

                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="
                            rounded-xl
                        "
                    >
                        Back to Tables
                    </Button>


                    <Button
                        type="button"
                        onClick={onRetry}
                        className="
                            rounded-xl
                        "
                        style={{
                            backgroundColor:
                                "#40332a",

                            color:
                                "#ffffff",
                        }}
                    >
                        Try Again
                    </Button>

                </div>

            </div>

        </div>

    );
}