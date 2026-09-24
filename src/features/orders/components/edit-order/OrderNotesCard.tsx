"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { Order } from "../../orders.types"

interface OrderNotesCardProps {
    order: Order
    onChange: (order: Order) => void
}

export default function OrderNotesCard({
    order,
    onChange,
}: OrderNotesCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Notes</CardTitle>

                <CardDescription>
                    Add instructions or additional notes
                    for this order.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="order-notes">
                        Notes
                    </Label>

                    <Textarea
                        id="order-notes"
                        value={order.notes ?? ""}
                        onChange={(e) =>
                            onChange({
                                ...order,
                                notes: e.target.value,
                            })
                        }
                        placeholder="Enter order notes..."
                        rows={6}
                    />
                </div>
            </CardContent>
        </Card>
    )
}