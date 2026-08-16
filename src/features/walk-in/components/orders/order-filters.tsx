"use client"

import {
    CalendarDays,
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

    const hasFilters =
        type !== "all" ||
        paymentStatus !== "all"

    return (
        <div
            className="
                border-b
                bg-white
                px-4
                py-4
            "
            style={{
                borderColor: "#e8e3de",
            }}
        >

            {/* ===================================================== */}
            {/* HEADER */}
            {/* ===================================================== */}

            {/* <div className="mb-3 flex items-center justify-between">

                <div className="flex items-center gap-2">

                    <div
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#f5f1ed]
                            text-[#6b5849]
                        "
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                    </div>

                    <div>

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-[#40332a]
                            "
                        >
                            Orders
                        </p>

                        <p
                            className="
                                text-[11px]
                                text-[#91877f]
                            "
                        >
                            Filter and search orders
                        </p>

                    </div>

                </div>

                {hasFilters && (
                    <span
                        className="
                            rounded-full
                            bg-[#f5f1ed]
                            px-2
                            py-1
                            text-[10px]
                            font-medium
                            text-[#6b5849]
                        "
                    >
                        Filters active
                    </span>
                )}

            </div> */}

            {/* ===================================================== */}
            {/* SEARCH */}
            {/* ===================================================== */}

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

            {/* ===================================================== */}
            {/* FILTERS */}
            {/* ===================================================== */}

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
            onValueChange={(value) =>
                setType(value ?? "all")
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
                <SelectValue placeholder="Select order type" />
            </SelectTrigger>

            <SelectContent>

                <SelectItem value="all">
                    <span className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        All Types
                    </span>
                </SelectItem>

                <SelectItem value="dine in">
                    Dine In
                </SelectItem>

                <SelectItem value="take away">
                    Take Away
                </SelectItem>

                <SelectItem value="delivery">
                    Delivery
                </SelectItem>

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

            {/* ===================================================== */}
            {/* TODAY CONTEXT */}
            {/* ===================================================== */}

            {/* <div
                className="
                    mt-3
                    flex
                    items-center
                    justify-between
                    rounded-lg
                    bg-[#faf9f7]
                    px-3
                    py-2
                "
            >

                <div className="flex items-center gap-2">

                    <CalendarDays
                        className="
                            h-3.5
                            w-3.5
                            text-[#806b59]
                        "
                    />

                    <span
                        className="
                            text-xs
                            font-medium
                            text-[#625950]
                        "
                    >
                        Today's orders
                    </span>

                </div>

                <span
                    className="
                        text-[11px]
                        text-[#9a9189]
                    "
                >
                    Latest first
                </span>

            </div> */}

        </div>
    )
}