// features/walk-in/components/session/SessionLoading.tsx

import {
    RefreshCw,
} from "lucide-react";


export function SessionLoading() {

    return (

        <div
            className="
                flex
                h-dvh
                items-center
                justify-center
            "
            style={{
                backgroundColor:
                    "#f3f3f3",
            }}
        >

            <div
                className="
                    flex
                    items-center
                    gap-2
                    text-sm
                "
                style={{
                    color:
                        "#40332a",

                    opacity:
                        0.65,
                }}
            >

                <RefreshCw
                    className="
                        h-5
                        w-5
                        animate-spin
                    "
                />

                Loading table session...

            </div>

        </div>

    );
}