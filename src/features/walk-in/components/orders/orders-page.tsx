"use client"

import {
    useEffect,
    useState,
} from "react"

import {
    RefreshCw,
} from "lucide-react"

import {
    getTodayOrders,
} from "@/features/walk-in/orders.service"

import {
    Order,
} from "@/features/orders/orders.types"

import OrdersList from "./order-list"
import OrderDetails from "./order-details"
import { Header } from "../Header"
import { POSNav } from "../POSNav"
import { useRouter } from "next/navigation"
import { getEcho } from "@/lib/echo";

export default function OrdersPage() {
    const router = useRouter();
    const [
        orders,
        setOrders,
    ] = useState<Order[]>([])

    const [
        selectedOrder,
        setSelectedOrder,
    ] = useState<Order | null>(null)

    const [
        loading,
        setLoading,
    ] = useState(true)

    const [
        error,
        setError,
    ] = useState<string | null>(null)



    /*
    |--------------------------------------------------------------------------
    | Load Orders
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        async function loadOrders() {
            try {
                setLoading(true)
                setError(null)

                const data =
                    await getTodayOrders()

                setOrders(data)

                setSelectedOrder(
                    data[0] ?? null
                )
            } catch (error) {
                console.error(
                    "Failed to load orders:",
                    error
                )

                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load orders."
                )
            } finally {
                setLoading(false)
            }
        }

        void loadOrders()
    }, [])

    useEffect(() => {
        let mounted = true;

        const echo = getEcho();

        if (!echo) {
            return;
        }

        const channel = echo.channel("orders");

        channel.listen(
            ".customer.order.created",
            async (event: { order_id: number }) => {
                console.log("CUSTOMER ORDER EVENT RECEIVED:", event);

                if (!event.order_id) {
                    return;
                }

                try {
                    // Fetch the latest list, including the new order.
                    const latestOrders = await getTodayOrders();

                    if (!mounted) {
                        return;
                    }

                    setOrders((previousOrders) => {
                        const orderMap = new Map<number, (typeof latestOrders)[number]>();

                        // Keep existing orders first as the base.
                        previousOrders.forEach((order) => {
                            orderMap.set(order.id, order);
                        });

                        // Refresh existing orders with the latest data.
                        latestOrders.forEach((order) => {
                            orderMap.set(order.id, order);
                        });

                        const mergedOrders = Array.from(orderMap.values());

                        // Put the newly created order at the beginning.
                        const newOrderIndex = mergedOrders.findIndex(
                            (order) => order.id === event.order_id
                        );

                        if (newOrderIndex > 0) {
                            const [newOrder] = mergedOrders.splice(newOrderIndex, 1);
                            mergedOrders.unshift(newOrder);
                        }

                        return mergedOrders;
                    });

                    // Select the newly created order if it is in today's list.
                    const newOrder = latestOrders.find(
                        (order) => order.id === event.order_id
                    );

                    if (newOrder) {
                        setSelectedOrder(newOrder);
                    }
                } catch (error) {
                    console.error(
                        "Failed to refresh orders after broadcast:",
                        error
                    );
                }
            }
        );

        channel.subscribed(() => {
            console.log("Subscribed to orders channel");
        });

        return () => {
            mounted = false;
            channel.stopListening(".customer.order.created");
            echo.leave("orders");
        };
    }, []);


    function handleOrderUpdated(updatedOrder: Order) {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === updatedOrder.id
                    ? updatedOrder
                    : order
            )
        )

        setSelectedOrder(updatedOrder)
    }
    function handleGoToOrder(order: Order) {
        if (!order) return;
        const orderId = String(order.id);
        router.push(`/walk-in?orderId=${encodeURIComponent(orderId)}`);
    }

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
                w-full
                flex-col
                overflow-hidden
                bg-[#f5f5f3]
            "
        >
            <header className="shrink-0">
                <Header />
            </header>

            {/* ================================================= */}
            {/* POS NAVIGATION */}
            {/* ================================================= */}

            <nav className="shrink-0">
                <POSNav />
            </nav>
            <div
                className="
                    mx-auto
                    flex
                    h-full
                    min-h-0
                    w-full
                    max-w-[1800px]
                    flex-col
                    overflow-hidden
                    px-4
                    py-4
                    sm:px-5
                    lg:px-7
                    lg:py-5
                    xl:px-8
                "
            >
                {/* ================================================= */}
                {/* PAGE HEADER */}
                {/* ================================================= */}

                <div
                    className="
                        mb-4
                        flex
                        shrink-0
                        items-center
                        justify-between
                    "
                >
                    <div>
                        <h2
                            className="
                                text-sm
                                font-semibold
                                text-[#40332a]
                                sm:text-base
                            "
                        >
                            Orders
                        </h2>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                text-[#8a8179]
                            "
                        >
                            {orders.length}{" "}
                            {orders.length === 1
                                ? "order"
                                : "orders"}{" "}
                            today
                        </p>
                    </div>
                </div>

                {/* ================================================= */}
                {/* MAIN CARD */}
                {/* ================================================= */}

                <div
                    className="
                        flex
                        min-h-0
                        flex-1
                        flex-col
                        overflow-hidden
                        rounded-2xl
                        border
                        bg-white
                        shadow-sm
                    "
                    style={{
                        borderColor: "#e1ddd8",
                    }}
                >
                    {/* LOADING */}

                    {loading && (
                        <div
                            className="
                                flex
                                min-h-0
                                flex-1
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
                                        bg-[#f5f1ed]
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
                                    Loading orders...
                                </span>
                            </div>
                        </div>
                    )}

                    {/* ERROR */}

                    {!loading && error && (
                        <div
                            className="
                                flex
                                min-h-0
                                flex-1
                                items-center
                                justify-center
                                p-6
                            "
                        >
                            <div className="text-center">
                                <p
                                    className="
                                        font-semibold
                                        text-[#40332a]
                                    "
                                >
                                    Unable to load orders
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-[#81786f]
                                    "
                                >
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        orders.length === 0 && (
                            <div
                                className="
                                    flex
                                    min-h-0
                                    flex-1
                                    items-center
                                    justify-center
                                "
                            >
                                <div className="text-center">
                                    <p
                                        className="
                                            font-semibold
                                            text-[#40332a]
                                        "
                                    >
                                        No orders today
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-[#81786f]
                                        "
                                    >
                                        Orders will appear here
                                        when they are created.
                                    </p>
                                </div>
                            </div>
                        )}

                    {/* ================================================= */}
                    {/* ORDERS */}
                    {/* ================================================= */}

                    {!loading &&
                        !error &&
                        orders.length > 0 && (
                            <div
                                className="
                                    grid
                                    min-h-0
                                    flex-1
                                    grid-cols-[420px_minmax(0,1fr)]
                                    overflow-hidden
                                "
                            >
                                {/* ================================= */}
                                {/* LEFT ORDER LIST */}
                                {/* ================================= */}

                                <div
                                    className="
                                        min-h-0
                                        overflow-y-auto
                                        border-r
                                        bg-white
                                        p-3
                                    "
                                    style={{
                                        borderColor:
                                            "#e1ddd8",
                                    }}
                                >
                                    <OrdersList
                                        orders={orders}
                                        selectedOrderId={
                                            selectedOrder?.id
                                        }
                                        onSelect={
                                            setSelectedOrder
                                        }
                                    />
                                </div>

                                {/* ================================= */}
                                {/* RIGHT ORDER DETAILS */}
                                {/* ================================= */}

                                <div
                                    className="
                                        min-h-0
                                        overflow-y-auto
                                        bg-[#faf9f7]
                                    "
                                >
                                    <div
                                        className="
                                            mx-auto
                                            w-full
                                            max-w-[950px]
                                            px-6
                                            py-5
                                            lg:px-8
                                            lg:py-6
                                            xl:px-10
                                        "
                                    >
                                        <OrderDetails
                                            order={
                                                selectedOrder
                                            }
                                            onOrderUpdated={handleOrderUpdated}
                                            onGoToOrder={handleGoToOrder}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}