"use client";

import { useEffect, useRef, useState } from "react";
import { BellRing, X } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getEcho } from "@/lib/echo";
import { getOrder } from "@/features/walk-in/orders.service";

interface OrderAlertItem {
    id: number;
    title: string;
    message: string;
    orderId?: number;
}

const stopOrderAlertSound = (
    audioContextRef: React.MutableRefObject<AudioContext | null>,
    intervalRef: React.MutableRefObject<number | null>,
    sequenceRef: React.MutableRefObject<number>
) => {
    if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
    }

    sequenceRef.current = 0;

    if (audioContextRef.current) {
        const context = audioContextRef.current;
        audioContextRef.current = null;

        void context.close().catch(() => undefined);
    }
};

const playOrderAlertSound = (
    audioContextRef: React.MutableRefObject<AudioContext | null>,
    intervalRef: React.MutableRefObject<number | null>,
    sequenceRef: React.MutableRefObject<number>
) => {
    if (typeof window === "undefined") {
        return;
    }

    if (intervalRef.current) {
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
        const playChime = () => {
            const now = audioContext.currentTime;
            const isAltPattern = sequenceRef.current % 2 === 1;

            const playTone = (
                frequency: number,
                start: number,
                duration: number,
                volume: number,
                type: OscillatorType
            ) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.type = type;
                oscillator.frequency.setValueAtTime(frequency, start);

                gainNode.gain.setValueAtTime(0.0001, start);
                gainNode.gain.exponentialRampToValueAtTime(
                    volume,
                    start + 0.02
                );
                gainNode.gain.exponentialRampToValueAtTime(
                    0.0001,
                    start + duration
                );

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.start(start);
                oscillator.stop(start + duration);
            };

            if (isAltPattern) {
                playTone(620, now, 0.26, 0.09, "triangle");
                playTone(760, now + 0.12, 0.24, 0.08, "sine");
                playTone(890, now + 0.26, 0.34, 0.07, "triangle");
            } else {
                playTone(660, now, 0.28, 0.09, "triangle");
                playTone(820, now + 0.14, 0.27, 0.08, "sine");
                playTone(960, now + 0.3, 0.32, 0.07, "triangle");
            }

            sequenceRef.current += 1;
        };

        playChime();
        audioContextRef.current = audioContext;
        intervalRef.current = window.setInterval(playChime, 1200);
        void audioContext.resume();
    } catch (error) {
        console.warn("Unable to play order alert sound:", error);
    }
};

export function OrderPushNotification() {
    const router = useRouter();
    const [alerts, setAlerts] = useState<OrderAlertItem[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const soundIntervalRef = useRef<number | null>(null);
    const soundSequenceRef = useRef(0);

    const dismissAlert = (id: number) => {
        setAlerts((current) => {
            const nextAlerts = current.filter((alert) => alert.id !== id);

            if (nextAlerts.length === 0) {
                stopOrderAlertSound(audioContextRef, soundIntervalRef, soundSequenceRef);
            }

            return nextAlerts;
        });
    };

    useEffect(() => {
        if (alerts.length === 0) {
            stopOrderAlertSound(audioContextRef, soundIntervalRef, soundSequenceRef);
            return;
        }

        playOrderAlertSound(audioContextRef, soundIntervalRef, soundSequenceRef);

        return () => {
            stopOrderAlertSound(audioContextRef, soundIntervalRef, soundSequenceRef);
        };
    }, [alerts.length]);

    useEffect(() => {
        const echo = getEcho();

        if (!echo) {
            return;
        }

        const channel = echo.channel("orders");

        const handleOrderCreated = async (event: { order_id?: number }) => {
            if (!event.order_id) {
                return;
            }

            const activeLocationId = Number(Cookies.get("active_location_id"));

            if (!activeLocationId || !Number.isFinite(activeLocationId)) {
                return;
            }

            try {
                const order = await getOrder(event.order_id);

                if (Number(order.location_id) !== activeLocationId) {
                    return;
                }

                const newAlert: OrderAlertItem = {
                    id: Date.now() + Math.random(),
                    title: "New customer order",
                    message: `Order #${order.order_no || order.id} just came in.`,
                    orderId: order.id,
                };

                if (alerts.length === 0) {
                    playOrderAlertSound(audioContextRef, soundIntervalRef, soundSequenceRef);
                }

                setAlerts((current) => [newAlert, ...current].slice(0, 3));
            } catch (error) {
                console.warn("Unable to validate order location for notification:", error);
            }
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
