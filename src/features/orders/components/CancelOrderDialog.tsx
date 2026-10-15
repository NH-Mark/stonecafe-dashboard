"use client";

import { useState } from "react";
import { Order } from "../orders.types";
import api from "@/lib/axios";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cancelConfirmedOrder } from "@/features/walk-in/order.service";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: Order;
    onSuccess: () => Promise<void>;
}

export default function CancelOrderDialog({
    open,
    onOpenChange,
    order,
    onSuccess,
}: Props) {
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleCancel() {
        if (!reason.trim()) {
            setError("Please provide a cancellation reason.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await cancelConfirmedOrder(
                Number(order.id),
                reason.trim()
            );

            onOpenChange(false);
            setReason("");
            await onSuccess();
            toast.error(
                    "Order Cancelled Successfully"
            )
        } catch (err: any) {
            setError(
                err?.response?.data?.message ??
                err?.response?.data?.errors?.status?.[0] ??
                err?.response?.data?.errors?.payment?.[0] ??
                err?.response?.data?.errors?.reason?.[0] ??
                "Failed to cancel the order."
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancel Order</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to cancel order #{order.id}?
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                    <Label htmlFor="cancel-reason">
                        Cancellation reason
                    </Label>
                    <Textarea
                        id="cancel-reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter the reason for cancellation..."
                        maxLength={500}
                        required
                    />
                    {error && (
                        <p className="text-sm text-destructive">
                            {error}
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Keep Order
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleCancel}
                        disabled={loading || !reason.trim()}
                    >
                        {loading ? "Cancelling..." : "Confirm Cancellation"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}