"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import { Order } from "../orders.types"

import { getOrder } from "@/features/walk-in/orders.service"
import OrderItemsCard from "./edit-order/OrderItemsCard"
import OrderNotesCard from "./edit-order/OrderNotesCard"
import OrderDiscountCard from "./edit-order/OrderDiscountCard"
import OrderSummaryCard from "./edit-order/OrderSummaryCard"
import OrderInformationCard from "./edit-order/OrderInformationCard"
import { useAdminOrderMutation } from "../hooks/useAdminOrderMutation"
import PermissionPageGuard from "@/components/guards/PermissionPageGuard"

interface Props {
    orderId: string
}

export default function EditOrderPage({
    orderId,
}: Props) {
    const router = useRouter()

    const [order, setOrder] =
        useState<Order | null>(null)

    const [loading, setLoading] =
        useState(true)

    const [saving, setSaving] =
        useState(false)

    /*
     * IMPORTANT:
     * This hook must always be called before any
     * conditional return.
     *
     * orderId is already available from the page props,
     * so we can safely pass it directly.
     */
    const {
        updateAdminOrder,
        updating,
    } = useAdminOrderMutation()

    useEffect(() => {
        async function loadOrder() {
            try {
                setLoading(true)

                const response = await getOrder(
                    Number(orderId)
                )

                setOrder(response)
            } catch (error) {
                console.error(
                    "Failed to load order:",
                    error
                )

                toast.error(
                    "Unable to load order."
                )

                router.push("/sales/orders")
            } finally {
                setLoading(false)
            }
        }

        loadOrder()
    }, [orderId, router])

    async function handleSave() {
        if (!order) {
            toast.error("Order not found.")
            return
        }

        try {
            setSaving(true)

            await updateAdminOrder(order)

            toast.success(
                "Order updated successfully."
            )

            // router.push("/sales/orders")
        } catch (error) {
            console.error(
                "Failed to update order:",
                error
            )

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to update order."
            )
        } finally {
            setSaving(false)
        }
    }

    /*
     * All hooks are above this point.
     * Conditional returns are now safe.
     */
    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        )
    }

    if (!order) {
        return null
    }

    const isSaving =
        saving || updating

    return (
        <PermissionPageGuard
            permission="orders.update"
            redirectTo="/sales/orders"
        >
        <div className="pb-24">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-xl font-bold">
                    Edit Order #{order.order_no}
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Manage order details, items,
                    modifiers, discounts and notes.
                </p>
            </div>

            {/* Content */}
            <div className="space-y-6">
                {/* Order information */}
                <OrderInformationCard
                    order={order}
                    onChange={setOrder}
                />

                {/* Order items */}
                <OrderItemsCard
                    order={order}
                    onChange={setOrder}
                />

                {/* Order notes */}
                <OrderNotesCard
                    order={order}
                    onChange={setOrder}
                />

                {/* Main content */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left */}
                    <div className="space-y-6 lg:col-span-2">
                        <OrderDiscountCard
                            order={order}
                            onChange={setOrder}
                        />
                    </div>

                    {/* Right */}
                    <div className="space-y-6">
                        <OrderSummaryCard
                            order={order}
                        />
                    </div>
                </div>
            </div>

            {/* Fixed actions */}
            <div
                className="
                    fixed
                    bottom-0
                    left-0
                    right-0
                    z-50
                    flex
                    justify-end
                    gap-3
                    border-t
                    bg-background
                    px-6
                    py-4
                "
            >
                <Button
                    type="button"
                    variant="outline"
                    disabled={isSaving}
                    onClick={() =>
                        router.push("/orders")
                    }
                >
                    Cancel
                </Button>

                <Button
                    type="button"
                    disabled={isSaving}
                    onClick={handleSave}
                >
                    {isSaving && (
                        <Loader2
                            className="
                                mr-2
                                h-4
                                w-4
                                animate-spin
                            "
                        />
                    )}

                    {isSaving
                        ? "Saving..."
                        : "Save Changes"}
                </Button>
            </div>
        </div>
        </PermissionPageGuard>
    )
}