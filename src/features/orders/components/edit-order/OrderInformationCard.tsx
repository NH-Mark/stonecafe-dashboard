"use client"

import { useEffect, useState } from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Loader2 } from "lucide-react"

import { Order } from "../../orders.types"
import { getLocations } from "@/features/locations/location.service"
import { getTables } from "@/features/walk-in/components/tables/tables.service"
import { getOrderSources } from "@/features/order-sources/order-sources.service"
import { getOrderTypes } from "@/features/sales/sales.service"

interface OrderInformationCardProps {
    order: Order
    onChange: (order: Order) => void
}

const orderStatuses = [
    {
        value: "pending",
        label: "Pending",
    },
    {
        value: "confirmed",
        label: "Confirmed",
    },
    {
        value: "completed",
        label: "Completed",
    },
    {
        value: "cancelled",
        label: "Cancelled",
    },
]

const paymentStatuses = [
    {
        value: "unpaid",
        label: "Unpaid",
    },
    {
        value: "partial",
        label: "Partial",
    },
    {
        value: "paid",
        label: "Paid",
    },
    // {
    //     value: "refunded",
    //     label: "Refunded",
    // },
]

const kitchenStatuses = [
    {
        value: "pending",
        label: "Pending",
    },
    {
        value: "preparing",
        label: "Preparing",
    },
    {
        value: "ready",
        label: "Ready",
    },
    // {
    //     value: "completed",
    //     label: "Completed",
    // },
]

interface SelectOption {
    value: string
    label: string
}

export default function OrderInformationCard({
    order,
    onChange,
}: OrderInformationCardProps) {
    const [locations, setLocations] =
        useState<SelectOption[]>([])

    const [tables, setTables] =
        useState<SelectOption[]>([])

    const [orderSources, setOrderSources] =
        useState<SelectOption[]>([])

    const [orderTypes, setOrderTypes] =
        useState<SelectOption[]>([])

    const [loading, setLoading] =
        useState(true)

    // -------------------------------------------------
    // Load dynamic data
    // -------------------------------------------------

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true)

                const [
                    locationsResponse,
                    tablesResponse,
                    orderSourcesResponse,
                    orderTypesResponse,
                ] = await Promise.all([
                    getLocations({
                        page: 1,
                        per_page: 100,
                    }),

                    getTables(),

                    getOrderSources({
                        page: 1,
                        per_page: 100,
                    }),

                    getOrderTypes(),
                ])

                // -------------------------------------------------
                // Locations
                // -------------------------------------------------

                const locationData =
                    locationsResponse.data?.data ?? []

                setLocations(
                    locationData.map(
                        (location: any) => ({
                            value: String(
                                location.id
                            ),
                            label:
                                location.name ??
                                location.title ??
                                String(
                                    location.id
                                ),
                        })
                    )
                )

                // -------------------------------------------------
                // Tables
                // -------------------------------------------------

                const tableData =
                    tablesResponse ?? []

                setTables(
                    tableData.map(
                        (table: any) => ({
                            value: String(
                                table.id
                            ),
                            label:
                                table.name ??
                                table.table_no ??
                                table.number ??
                                `Table ${table.id}`,
                        })
                    )
                )

                // -------------------------------------------------
                // Order Sources
                // -------------------------------------------------

                const sourceData =
                    orderSourcesResponse.data?.data ??
                    []

                setOrderSources(
                    sourceData.map(
                        (source: any) => ({
                            value: String(
                                source.id
                            ),
                            label:
                                source.name ??
                                source.title ??
                                String(
                                    source.id
                                ),
                        })
                    )
                )

                // -------------------------------------------------
                // Order Types
                // -------------------------------------------------

                const typeResponse =
                    orderTypesResponse.data

                const typeData =
                    typeResponse?.data ??
                    typeResponse ??
                    []

                setOrderTypes(
                    typeData.map(
                        (type: any) => ({
                            value: String(
                                type.id ??
                                ""
                            ),
                            label:
                                type.name ??
                                type.label ??
                                type.title ??
                                String(
                                    type.id
                                ),
                        })
                    )
                )
            } catch (error) {
                console.error(
                    "Failed to load order information data:",
                    error
                )
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    // -------------------------------------------------
    // Generic update
    // -------------------------------------------------

    function update<K extends keyof Order>(
        field: K,
        value: Order[K]
    ) {
        onChange({
            ...order,
            [field]: value,
        })
    }

    // -------------------------------------------------
    // Order Type
    // -------------------------------------------------

    function handleOrderTypeChange(
        value: string
    ) {
        const selectedType =
            orderTypes.find(
                type =>
                    type.value === value
            )

        onChange({
            ...order,
            type:
                selectedType?.label ??
                value,
            order_type_id:
                Number(value),
        })
    }

    // -------------------------------------------------
    // Order Source
    // -------------------------------------------------

    function handleOrderSourceChange(
        value: string
    ) {
        const selectedSource =
            orderSources.find(
                source =>
                    source.value === value
            )

        onChange({
            ...order,
            source:
                selectedSource?.label ??
                value,
            order_source_id:
                Number(value),
        })
    }

    // -------------------------------------------------
    // Location
    // -------------------------------------------------

   function handleLocationChange(value: string) {
        const selectedLocation = locations.find(
            location => location.value === value
        )

        onChange({
            ...order,
            location_id: value
                ? Number(value)
                : null,
            location:
                selectedLocation?.label ?? "",
        })
    }

    // -------------------------------------------------
    // Table
    // -------------------------------------------------

    function handleTableChange(value: string) {
        const selectedTable = tables.find(
            table => table.value === value
        )

        onChange({
            ...order,

            restaurant_table_id: value
                ? Number(value)
                : null,

            table:
                selectedTable?.label ?? "",
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Order Information
                </CardTitle>

                <CardDescription>
                    Manage the basic information for
                    this order.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {/* -------------------------------------------------
                        Order Number
                    ------------------------------------------------- */}

                    <div className="space-y-2">
                        <Label htmlFor="order_no">
                            Order Number
                        </Label>

                        <Input
                            id="order_no"
                            value={
                                order.order_no ?? ""
                            }
                            onChange={e =>
                                update(
                                    "order_no",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    {/* -------------------------------------------------
                        Order Type
                    ------------------------------------------------- */}

                    <div className="space-y-2">
                        <Label htmlFor="order_type">
                            Order Type
                        </Label>

                        <select
                            id="order_type"
                            className="w-full rounded-md border bg-background p-2"
                            value={
                                order.order_type_id ? String(
                                    order.order_type_id
                                ) :
                                    ""
                            }
                            onChange={e =>
                                handleOrderTypeChange(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                        >
                            <option value="">
                                {loading
                                    ? "Loading..."
                                    : "Select Order Type"}
                            </option>

                            {orderTypes.map(
                                type => (
                                    <option
                                        key={
                                            type.value
                                        }
                                        value={
                                            type.value
                                        }
                                    >
                                        {
                                            type.label
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* -------------------------------------------------
                        Order Source
                    ------------------------------------------------- */}

                    <div className="space-y-2">
                        <Label htmlFor="order_source">
                            Order Source
                        </Label>

                        <select
                            id="order_source"
                            className="w-full rounded-md border bg-background p-2"
                            value={
                                order.order_source_id
                                    ? String(
                                        order.order_source_id
                                    )
                                    : ""
                            }
                            onChange={e =>
                                handleOrderSourceChange(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                        >
                            <option value="">
                                {loading
                                    ? "Loading..."
                                    : "Select Source"}
                            </option>

                            {orderSources.map(
                                source => (
                                    <option
                                        key={
                                            source.value
                                        }
                                        value={
                                            source.value
                                        }
                                    >
                                        {
                                            source.label
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* -------------------------------------------------
                        Customer
                    ------------------------------------------------- */}

                    {/* <div className="space-y-2">
                        <Label htmlFor="customer">
                            Customer
                        </Label>

                        <Input
                            id="customer"
                            value={
                                order.customer ?? ""
                            }
                            onChange={e =>
                                update(
                                    "customer",
                                    e.target.value
                                )
                            }
                            placeholder="Customer name"
                        />
                    </div> */}

                    {/* -------------------------------------------------
                        Table
                    ------------------------------------------------- */}

                    <div className="space-y-2">
                        <Label htmlFor="table">
                            Table
                        </Label>

                        <select
                            id="table"
                            className="w-full rounded-md border bg-background p-2"
                            value={
                                order.restaurant_table_id
                                    ? String(order.restaurant_table_id)
                                    : ""
                            }
                            onChange={e =>
                                handleTableChange(e.target.value)
                            }
                            disabled={loading}
                        >
                            <option value="">
                                {loading
                                    ? "Loading..."
                                    : "Select Table"}
                            </option>

                            {tables.map(table => (
                                <option
                                    key={table.value}
                                    value={table.value}
                                >
                                    {table.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* -------------------------------------------------
                        Number Plate
                    ------------------------------------------------- */}

                    <div className="space-y-2">
                        <Label htmlFor="number_plate">
                            Number Plate
                        </Label>

                        <Input
                            id="number_plate"
                            value={
                                order.number_plate ??
                                ""
                            }
                            onChange={e =>
                                update(
                                    "number_plate",
                                    e.target.value
                                )
                            }
                            placeholder="Vehicle number plate"
                        />
                    </div>

                    {/* -------------------------------------------------
                        Location
                    ------------------------------------------------- */}

                    <div className="space-y-2">
                        <Label htmlFor="location">
                            Location
                        </Label>

                        <select
                            id="location"
                            className="w-full rounded-md border bg-background p-2"
                            value={
                                locations.find(
                                    location =>
                                        location.label ===
                                        order.location
                                )?.value ?? ""
                            }
                            onChange={e =>
                                handleLocationChange(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                        >
                            <option value="">
                                {loading
                                    ? "Loading..."
                                    : "Select Location"}
                            </option>

                            {locations.map(
                                location => (
                                    <option
                                        key={
                                            location.value
                                        }
                                        value={
                                            location.value
                                        }
                                    >
                                        {
                                            location.label
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* -------------------------------------------------
                        Order Status
                    ------------------------------------------------- */}

                    <div className="space-y-2">
                        <Label htmlFor="order_status">
                            Order Status
                        </Label>

                        <select
                            id="order_status"
                            className="w-full rounded-md border bg-background p-2"
                            value={
                                order.status ?? ""
                            }
                            onChange={e =>
                                update(
                                    "status",
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                Select Status
                            </option>

                            {orderStatuses.map(
                                status => (
                                    <option
                                        key={
                                            status.value
                                        }
                                        value={
                                            status.value
                                        }
                                    >
                                        {
                                            status.label
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* -------------------------------------------------
                        Payment Status
                    ------------------------------------------------- */}

                    <div className="space-y-2">
                        <Label htmlFor="payment_status">
                            Payment Status
                        </Label>

                        <select
                            id="payment_status"
                            className="w-full rounded-md border bg-background p-2"
                            value={
                                order.payment_status ??
                                ""
                            }
                            onChange={e =>
                                update(
                                    "payment_status",
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                Select Payment Status
                            </option>

                            {paymentStatuses.map(
                                status => (
                                    <option
                                        key={
                                            status.value
                                        }
                                        value={
                                            status.value
                                        }
                                    >
                                        {
                                            status.label
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* -------------------------------------------------
                        Kitchen Status
                    ------------------------------------------------- */}

                    {/* <div className="space-y-2">
                        <Label htmlFor="kitchen_status">
                            Kitchen Status
                        </Label>

                        <select
                            id="kitchen_status"
                            className="w-full rounded-md border bg-background p-2"
                            value={
                                order.kitchen_status ??
                                ""
                            }
                            onChange={e =>
                                update(
                                    "kitchen_status",
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                Select Kitchen Status
                            </option>

                            {kitchenStatuses.map(
                                status => (
                                    <option
                                        key={
                                            status.value
                                        }
                                        value={
                                            status.value
                                        }
                                    >
                                        {
                                            status.label
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div> */}
                </div>
            </CardContent>
        </Card>
    )
}