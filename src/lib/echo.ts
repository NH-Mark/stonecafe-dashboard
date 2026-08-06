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
    console.log("Echo created");

    if (typeof window === "undefined") {
        return null;
    }


    if (echo) {
        return echo;
    }


    window.Pusher = Pusher;


    echo = new Echo({

        broadcaster: "reverb",

        key: process.env
            .NEXT_PUBLIC_REVERB_APP_KEY,


        wsHost: process.env
            .NEXT_PUBLIC_REVERB_HOST,


        wsPort: Number(
            process.env
            .NEXT_PUBLIC_REVERB_PORT ?? 8080
        ),


        forceTLS: true,


        enabledTransports: [
            "ws",
            "wss"
        ],

    });


    return echo;
}