"use client";

import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
    interface Window {
        Pusher: typeof Pusher;
    }
}

let echo: Echo<any> | null = null;

export function getEcho() {
    if (typeof window === "undefined") return null;
    if (echo) return echo;

    window.Pusher = Pusher;

    const isHttps =
        process.env.NEXT_PUBLIC_REVERB_SCHEME === "https";

    const port = Number(
        process.env.NEXT_PUBLIC_REVERB_PORT ?? (isHttps ? 443 : 8080)
    );

    echo = new Echo({
        broadcaster: "reverb",
        key: process.env.NEXT_PUBLIC_REVERB_APP_KEY!,
        wsHost: process.env.NEXT_PUBLIC_REVERB_HOST!,
        wsPort: port,
        wssPort: port,
        forceTLS: isHttps,
        enabledTransports: ["ws", "wss"],
    });

    const pusher = (echo.connector as any).pusher;

    pusher.connection.bind("connected", () => {
        console.log("Reverb connected");
    });

    pusher.connection.bind("error", (error: unknown) => {
        console.error("Reverb connection error:", error);
    });

    return echo;
}