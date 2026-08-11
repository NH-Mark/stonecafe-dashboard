"use client";

import {
    CheckCircle2,
    Clock3,
    Plus,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/*
|--------------------------------------------------------------------------
| Tab data
|--------------------------------------------------------------------------
*/

export interface SessionOrderTabData {

    id: string;

    orderNo?: string | number | null;

    status:
        | "draft"
        | "pending"
        | "confirmed"
        | "completed"
        | "cancelled";

    total: number;

    createdAt: string;

    isNew?: boolean;
}

/*
|--------------------------------------------------------------------------
| Props
|--------------------------------------------------------------------------
*/

interface SessionOrderTabsProps {

    orders: SessionOrderTabData[];

    activeOrderId: string | null;

    onSelectOrder: (
        orderId: string
    ) => void;

    onNewOrder: () => void;

    onRemoveOrder: (
        orderId: string
    ) => void;
}

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export function SessionOrderTabs({

    orders,

    activeOrderId,

    onSelectOrder,

    onNewOrder,

    onRemoveOrder,

}: SessionOrderTabsProps) {

    return (

        <div
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
                    gap-2
                    overflow-x-auto
                    p-2
                    sm:p-3
                "
            >

                {orders.map(
                    order => (

                        <SessionOrderTab

                            key={
                                order.id
                            }

                            order={
                                order
                            }

                            active={
                                activeOrderId ===
                                order.id
                            }

                            onClick={() =>
                                onSelectOrder(
                                    order.id
                                )
                            }

                            onRemove={() =>
                                onRemoveOrder(
                                    order.id
                                )
                            }

                        />

                    )
                )}

                <Button

                    type="button"

                    variant="outline"

                    onClick={
                        onNewOrder
                    }

                    className="
                        h-12
                        min-w-[130px]
                        shrink-0
                        rounded-xl
                        border-dashed
                    "

                    style={{
                        borderColor:
                            "#c3b6a4",

                        color:
                            "#40332a",
                    }}

                >

                    <Plus
                        className="
                            mr-2
                            h-4
                            w-4
                        "
                    />

                    New Order

                </Button>

            </div>

        </div>

    );

}

/*
|--------------------------------------------------------------------------
| Single tab
|--------------------------------------------------------------------------
*/

function SessionOrderTab({

    order,

    active,

    onClick,

    onRemove,

}: {

    order: SessionOrderTabData;

    active: boolean;

    onClick: () => void;

    onRemove: () => void;

}) {

    const completed =
        order.status ===
        "completed";

    const cancelled =
        order.status ===
        "cancelled";

    const isNew =
        order.isNew === true ||
        order.id.startsWith(
            "new-"
        );

    return (

        <button

            type="button"

            onClick={
                onClick
            }

            className="
                relative
                flex
                h-12
                min-w-[150px]
                shrink-0
                items-center
                justify-between
                gap-3
                rounded-xl
                border
                px-3
                pr-9
                text-left
                transition
                active:scale-[0.98]
            "

            style={{

                borderColor:
                    active
                        ? "#40332a"
                        : "#d9d9d8",

                backgroundColor:
                    active
                        ? "#ddcfbe"
                        : "#ffffff",

            }}

        >

            <div className="min-w-0">

                <p
                    className="
                        text-sm
                        font-bold
                    "
                    style={{
                        color:
                            "#40332a",
                    }}
                >

                   {isNew
                    ? "New Order"
                    : `Order #${order.orderNo ?? order.id}`}

                </p>

                <p
                    className="
                        truncate
                        text-[10px]
                    "
                    style={{
                        color:
                            "#40332a",
                        opacity:
                            0.55,
                    }}
                >

                    {isNew
                        ? "Draft"
                        : formatOrderTime(
                            order.createdAt
                        )}

                </p>

            </div>

            <div
                className="
                    flex
                    shrink-0
                    flex-col
                    items-end
                    gap-1
                "
            >

                <span
                    className="
                        text-xs
                        font-bold
                    "
                    style={{
                        color:
                            "#40332a",
                    }}
                >

                    {Number(
                        order.total
                    ).toFixed(2)}

                </span>

                <span
                    className="
                        flex
                        items-center
                        gap-1
                        text-[9px]
                        font-semibold
                        uppercase
                    "
                    style={{

                        color:
                            completed
                                ? "#5f7d55"
                                : cancelled
                                    ? "#b44a4a"
                                    : "#a5765a",

                    }}
                >

                    {completed ? (

                        <CheckCircle2
                            className="
                                h-3
                                w-3
                            "
                        />

                    ) : (

                        <Clock3
                            className="
                                h-3
                                w-3
                            "
                        />

                    )}

                    {order.status}

                </span>

            </div>

            {isNew && (

                <span

                    role="button"

                    tabIndex={0}

                    className="
                        absolute
                        right-1.5
                        top-1/2
                        flex
                        h-6
                        w-6
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-md
                        text-muted-foreground
                        transition
                        hover:bg-black/5
                        hover:text-red-600
                    "

                    onClick={event => {

                        event.stopPropagation();

                        onRemove();

                    }}

                    onKeyDown={event => {

                        if (
                            event.key ===
                                "Enter" ||
                            event.key ===
                                " "
                        ) {

                            event.preventDefault();

                            event.stopPropagation();

                            onRemove();

                        }

                    }}

                >

                    <X
                        className="
                            h-4
                            w-4
                        "
                    />

                </span>

            )}

        </button>

    );

}

/*
|--------------------------------------------------------------------------
| Date helper
|--------------------------------------------------------------------------
*/

function formatOrderTime(
    value: string
) {

    if (!value) {
        return "";
    }

    return new Date(
        value
    ).toLocaleTimeString(
        [],
        {
            hour:
                "2-digit",

            minute:
                "2-digit",
        }
    );

}