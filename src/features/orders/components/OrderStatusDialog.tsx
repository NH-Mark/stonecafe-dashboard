"use client";

import { useEffect, useState } from "react";
import { Order } from "../orders.types";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { updateOrderStatus } from "../orders.service";
import { toast } from "sonner";


interface Props {
    order: Order;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => Promise<void>;
}


const statuses = [
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
];


type Status = typeof statuses[number]["value"];


export default function ChangePaymentStatusDialog({
    order,
    open,
    onOpenChange,
    onSuccess,
}: Props) {

    const [status, setStatus] = useState<Status>(
        order.status as Status
    );

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (open) {
            setStatus(
                order.status as Status
            );
        }
    }, [open, order.status]);


    const selectedStatus = statuses.find(
        (item) => item.value === status
    );


    async function handleSubmit() {
        try {
            setLoading(true);

            await updateOrderStatus(
                order.id,
                status
            );

            toast.success(
                "Order status updated"
            );

            await onSuccess?.();

            onOpenChange(false);

        } catch (error) {
            console.error(error);

            toast.error(
                "Failed to update payment status"
            );

        } finally {
            setLoading(false);
        }
    }


    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent className="sm:max-w-[420px]">

                <DialogHeader>
                    <DialogTitle>
                        Change Status
                    </DialogTitle>

                    <DialogDescription>
                        Update status for this order.
                    </DialogDescription>
                </DialogHeader>


                <div className="space-y-5 py-4">


                    {/* Order Info */}
                    <div className="rounded-lg border bg-muted/30 p-4">

                        <p className="text-sm text-muted-foreground">
                            Order Number
                        </p>

                        <p className="font-semibold">
                            {order.order_no}
                        </p>


                        <div className="mt-3 flex items-center justify-between">

                            <span className="text-sm text-muted-foreground">
                                Current Status
                            </span>

                            <span
                                className={`rounded-full px-3 py-1 text-xs font-medium`}
                            >
                                {selectedStatus?.label}
                            </span>

                        </div>

                    </div>


                    {/* Select */}
                    <div className="space-y-2">

                        <label className="text-sm font-medium">
                            New Status
                        </label>


                        <Select
                            value={status}
                            onValueChange={(value) => {
                                if (value) {
                                    setStatus(
                                        value as Status
                                    );
                                }
                            }}
                        >

                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>


                            <SelectContent>
                                {statuses.map((item) => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>

                        </Select>

                    </div>


                </div>


                <DialogFooter className="gap-2">

                    <Button
                        variant="outline"
                        disabled={loading}
                        onClick={() =>
                            onOpenChange(false)
                        }
                    >
                        Cancel
                    </Button>


                    <Button
                        disabled={
                            loading ||
                            status === order.payment_status
                        }
                        onClick={handleSubmit}
                    >
                        {loading
                            ? "Updating..."
                            : "Update Status"}
                    </Button>

                </DialogFooter>

            </DialogContent>

        </Dialog>
    );
}