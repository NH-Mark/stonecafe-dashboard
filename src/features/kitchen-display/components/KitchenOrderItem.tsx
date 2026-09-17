import { Sparkles } from "lucide-react"
import { KitchenOrderItem as OrderItem } from "../kitchen.types"

interface Props {
    item: OrderItem
    isNew?: boolean
}

export function KitchenOrderItem({
    item,
    isNew = false,
}: Props) {
    return (
        <div
            className={`
                relative
                overflow-hidden
                rounded-xl
                border
                p-3
                transition-all
                duration-500

                ${
                    isNew
                        ? `
                            border-[#d6a85f]
                            bg-[#fffaf2]
                            shadow-[0_4px_16px_rgba(214,168,95,0.18)]
                        `
                        : `
                            border-transparent
                            bg-[#f3f3f3]
                        `
                }
            `}
        >
            {/* New item indicator */}
            {isNew && (
                <div
                    className="
                        absolute
                        inset-y-0
                        left-0
                        w-1
                        animate-pulse
                        bg-[#d6a85f]
                    "
                />
            )}

            <div className="flex justify-between gap-3">
                <div className="flex items-center gap-2 font-semibold text-[#40332a]">
                    <span>
                        {item.quantity} ×
                    </span>

                    <span>
                        {item.menu_item.name}
                    </span>

                    {isNew && (
                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-full
                                bg-[#f2d9ad]
                                px-2
                                py-0.5
                                text-[10px]
                                font-extrabold
                                uppercase
                                tracking-wider
                                text-[#805b28]
                            "
                        >
                            <Sparkles size={10} />
                            New
                        </span>
                    )}
                </div>

                <div
                    className="
                        shrink-0
                        text-sm
                        font-bold
                        text-[#40332a]
                    "
                >
                    {item.total_price}
                </div>
            </div>

            {/* Modifiers */}
            {item.modifiers?.length > 0 && (
                <div
                    className="
                        mt-2
                        space-y-1
                        pl-4
                        text-xs
                        text-[#a5765f]
                    "
                >
                    {item.modifiers.map((mod) => (
                        <div
                            key={mod.id}
                            className="flex items-center gap-2"
                        >
                            <span>+</span>

                            <span>
                                {mod.quantity} ×{" "}
                                {mod.modifier.name}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Item Notes */}
            {item.notes && (
                <div
                    className="
                        mt-2
                        rounded-lg
                        bg-[#ddcfbe]
                        p-2
                        text-xs
                        text-[#40332a]
                    "
                >
                    <strong>Item Note:</strong>{" "}
                    {item.notes}
                </div>
            )}
        </div>
    )
}