import { Clock, Sparkles } from "lucide-react"

import { KitchenOrderItem } from "./KitchenOrderItem"
import { KitchenOrder } from "../kitchen.types"
import { formatOrderTime } from "../utils/date"
import { KitchenStatusButton } from "./KitchenStatusButton"

interface Props {
    order: KitchenOrder
    isHighlighted?: boolean
}

export function KitchenOrderCard({
    order,
    isHighlighted = false,
}: Props) {
    return (
        <div
            className={`
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                bg-white
                transition-all
                duration-500

                ${
                    isHighlighted
                        ? `
                            border-[#d6a85f]
                            shadow-[0_0_0_2px_rgba(214,168,95,0.15),0_8px_30px_rgba(214,168,95,0.18)]
                        `
                        : `
                            border-[#d9d9d8]
                            shadow-sm
                        `
                }
            `}
        >
            {/* Highlight accent */}
            {isHighlighted && (
                <div className="absolute inset-y-0 left-0 w-1 bg-[#d6a85f]">
                    <div className="h-full w-full animate-pulse bg-[#e8b96b]" />
                </div>
            )}

            {/* Header */}
            <div
                className={`
                    border-b
                    p-4
                    transition-colors
                    duration-500

                    ${
                        isHighlighted
                            ? "border-[#ead9bd] bg-[#fffaf2]"
                            : "border-[#d9d9d8] bg-[#f3f3f3]"
                    }
                `}
            >
                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        lg:flex-row
                        lg:items-start
                        lg:justify-between
                    "
                >
                    {/* Order Info */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h3
                                className="
                                    whitespace-nowrap
                                    text-lg
                                    font-extrabold
                                    tracking-wide
                                    text-[#40332a]
                                "
                            >
                                {order.order_no}
                            </h3>

                            {isHighlighted && (
                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1
                                        rounded-full
                                        bg-[#f2d9ad]
                                        px-2
                                        py-1
                                        text-[10px]
                                        font-extrabold
                                        uppercase
                                        tracking-wider
                                        text-[#805b28]
                                        shadow-sm
                                    "
                                >
                                    <Sparkles size={11} />
                                    New
                                </span>
                            )}
                        </div>

                        {order.customer?.name && (
                            <p
                                className="
                                    mt-1
                                    text-base
                                    font-medium
                                    text-[#a5765f]
                                "
                            >
                                {order.customer.name}
                            </p>
                        )}
                    </div>

                    {/* Timer */}
                    <div
                        className={`
                            flex
                            h-10
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            px-4
                            text-base
                            font-bold
                            transition-colors
                            duration-500

                            lg:w-auto
                            lg:min-w-[150px]

                            ${
                                isHighlighted
                                    ? "bg-[#f2d9ad] text-[#805b28]"
                                    : "bg-[#ddcfbe] text-[#40332a]"
                            }
                        `}
                    >
                        <Clock
                            size={20}
                            className="shrink-0"
                        />

                        <span>
                            {formatOrderTime(order.ordered_at)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="space-y-3 p-4">
                {order.items.map((item) => (
                    <KitchenOrderItem
                        key={item.id}
                        item={item}
                    />
                ))}

                {/* Order Notes */}
                {order.notes && (
                    <div
                        className="
                            rounded-xl
                            border
                            border-[#c3b6a4]
                            bg-[#c3b6a4]
                            p-3
                            text-sm
                            text-[#40332a]
                        "
                    >
                        <p className="font-bold">
                            Order Note
                        </p>

                        <p className="mt-1">
                            {order.notes}
                        </p>
                    </div>
                )}

                <KitchenStatusButton order={order} />
            </div>
        </div>
    )
}