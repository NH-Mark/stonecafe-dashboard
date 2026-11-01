"use client";

import { useEffect, useState } from "react";
import { BellRing, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getEcho } from "@/lib/echo";

interface OrderAlertItem {
    id: number;
    title: string;
    message: string;
    orderId?: number;
}

const playOrderAlertSound = () => {
    if (typeof window === "undefined") {
        return;
    }

    const AudioCtor =
        window.AudioContext ||
        (window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;

    if (!AudioCtor) {
        return;
    }

    try {
        const audioContext = new AudioCtor();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
            620,
            audioContext.currentTime + 0.2
        );

        gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.22,
            audioContext.currentTime + 0.03
        );
        gainNode.gain.exponentialRampToValueAtTime(
            0.0001,
            audioContext.currentTime + 0.55
        );

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.6);
        void audioContext.resume();
    } catch (error) {
        console.warn("Unable to play order alert sound:", error);
    }
};

export function OrderPushNotification() {
    const router = useRouter();
    const [alerts, setAlerts] = useState<OrderAlertItem[]>([]);

    const dismissAlert = (id: number) => {
        setAlerts((current) => current.filter((alert) => alert.id !== id));
    };

    useEffect(() => {
        const echo = getEcho();

        if (!echo) {
            return;
        }

        const channel = echo.channel("orders");

        const handleOrderCreated = (event: { order_id?: number }) => {
            if (!event.order_id) {
                return;
            }

            const newAlert: OrderAlertItem = {
                id: Date.now() + Math.random(),
                title: "New customer order",
                message: `Order #${event.order_id} just came in.`,
                orderId: event.order_id,
            };

            playOrderAlertSound();
            setAlerts((current) => [newAlert, ...current].slice(0, 3));
        };

        channel.listen(".customer.order.created", handleOrderCreated);

        return () => {
            channel.stopListening(".customer.order.created");
            echo.leave("orders");
        };
    }, []);

    if (alerts.length === 0) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed right-4 top-4 z-100 flex flex-col gap-3">
            {alerts.map((alert) => (
                <div
                    key={alert.id}
                    className="pointer-events-auto w-90 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[#e7d9c8] bg-white shadow-[0_18px_50px_rgba(63,41,28,0.18)]"
                >
                    <div className="flex items-start gap-3 bg-[#fffaf4] p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7e8d7] text-[#7c4e2d]">
                            <BellRing className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[#2d211b]">
                                {alert.title}
                            </p>
                            <p className="mt-1 text-sm leading-5 text-[#61554d]">
                                {alert.message}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => dismissAlert(alert.id)}
                            className="mt-0.5 rounded-full p-1 text-[#8b7b72] transition hover:bg-[#f4efe9] hover:text-[#3f2f24]"
                            aria-label="Close notification"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-[#f1e7e0] bg-white px-4 py-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-9 rounded-xl border-[#d7cfc7] text-[#40332a] hover:bg-[#f7f3ef]"
                            onClick={() => dismissAlert(alert.id)}
                        >
                            OK
                        </Button>

                        <Button
                            type="button"
                            size="sm"
                            className="h-9 rounded-xl bg-[#40332a] text-white hover:bg-[#2e241d]"
                            onClick={() => {
                                dismissAlert(alert.id);
                                router.push("/walk-in/orders");
                            }}
                        >
                            Open Orders
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
