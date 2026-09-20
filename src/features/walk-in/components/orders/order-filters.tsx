
"use client"

import { useEffect, useState } from "react"
import {
    CreditCard,
    Search,
    SlidersHorizontal,
} from "lucide-react"

import { Input } from "@/components/ui/input"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getOrderTypes } from "@/features/sales/sales.service"
import { OrderType } from "@/types/order-type"



interface OrderFiltersProps {
    search: string
    setSearch: (value: string) => void

    type: string
    setType: (value: string) => void

    paymentStatus: string
    setPaymentStatus: (value: string) => void
}

export default function OrderFilters({
    search,
    setSearch,
    type,
    setType,
    paymentStatus,
    setPaymentStatus,
}: OrderFiltersProps) {

    const [orderTypes, setOrderTypes] = useState<OrderType[]>([])
    const [loadingTypes, setLoadingTypes] = useState(true)

    useEffect(() => {
        async function loadOrderTypes() {
            try {
                const response = await getOrderTypes()
                setOrderTypes(response.data.data)
            } catch (error) {
                console.error("Failed to load order types:", error)
            } finally {
                setLoadingTypes(false)
            }
        }

        loadOrderTypes()
    }, [])

    return (
        <div
            className="border-b bg-white px-4 py-4"
            style={{
                borderColor: "#e8e3de",
            }}
        >

            {/* Search */}

            <div className="relative">

                <Search
                    className="
                        absolute
                        left-3
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        text-[#91877f]
                    "
                />

                <Input
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Search by order number, customer..."
                    className="
                        h-10
                        border-[#e1ddd8]
                        bg-[#faf9f7]
                        pl-9
                        pr-3
                        text-sm
                        shadow-none
                        placeholder:text-[#a29a93]
                        focus-visible:border-[#9b8979]
                        focus-visible:ring-[#d8cec5]
                    "
                />

            </div>

            {/* Filters */}

            <div className="mt-3 space-y-2">

                {/* Order Type */}

                <div className="space-y-1">

                    <label
                        className="
                            text-xs
                            font-medium
                            text-[#625950]
                        "
                    >
                        Order Type
                    </label>

                    <Select
                        value={type}
                        onValueChange={(value) => setType(value ?? "all")}
                    >
                        <SelectTrigger
                            className="
            h-11
            w-full
            border-[#e1ddd8]
            bg-white
            px-3
            text-sm
            shadow-none
            focus:ring-1
            focus:ring-[#d8cec5]
        "
                        >
                            <SelectValue placeholder="Select order type" />
                        </SelectTrigger>

                        <SelectContent>

                            <SelectItem value="all">
                                <span className="flex items-center gap-2">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    All Types
                                </span>
                            </SelectItem>

                            {orderTypes
                                .filter((orderType) => orderType.status)
                                .map((orderType) => (
                                    <SelectItem
                                        key={orderType.id}
                                        value={orderType.code}
                                    >
                                        {orderType.name}
                                    </SelectItem>
                                ))}

                        </SelectContent>
                    </Select>

                </div>

                {/* Payment Status */}

                <div className="space-y-1">

                    <label
                        className="
                            text-xs
                            font-medium
                            text-[#625950]
                        "
                    >
                        Payment Status
                    </label>

                    <Select
                        value={paymentStatus}
                        onValueChange={(value) =>
                            setPaymentStatus(value ?? "all")
                        }
                    >

                        <SelectTrigger
                            className="
                                h-11
                                w-full
                                border-[#e1ddd8]
                                bg-white
                                px-3
                                text-sm
                                shadow-none
                                focus:ring-1
                                focus:ring-[#d8cec5]
                            "
                        >
                            <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>

                        <SelectContent>

                            <SelectItem value="all">
                                <span className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    All Payments
                                </span>
                            </SelectItem>

                            <SelectItem value="paid">
                                Paid
                            </SelectItem>

                            <SelectItem value="unpaid">
                                Unpaid
                            </SelectItem>

                            <SelectItem value="partial">
                                Partial
                            </SelectItem>

                        </SelectContent>

                    </Select>

                </div>

            </div>

        </div>
    )
}
