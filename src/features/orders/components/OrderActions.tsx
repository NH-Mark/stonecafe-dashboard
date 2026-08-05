"use client";

import { useState } from "react";
import { Order } from "../orders.types";
import ViewOrderDialog from "./ViewOrderDialog";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { CreditCard, Eye, MoreHorizontal, Package } from "lucide-react";
import ChangePaymentStatusDialog from "./ReceivePaymentDialog";
import OrderStatusDialog from "./OrderStatusDialog";
import ReceivePaymentDialog from "./ReceivePaymentDialog";

interface Props {
    order: Order;
    onSuccess: () => Promise<void>;
}

export default function OrderActions({
    order,
    onSuccess,
}: Props) {
    const [viewOpen, setViewOpen] = useState(false);
    const [changePaymentOpen, setChangePaymentOpen] = useState(false);
    const [orderStatusOpen, setOrderStatusOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger render={
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                }>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="w-56"
                >
                    <DropdownMenuItem onClick={() => setViewOpen(true)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                    </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setOrderStatusOpen(true)}
                    >
                        <Package className="mr-2 h-4 w-4" />
                        Change Order Status
                    </DropdownMenuItem>
                   {["unpaid", "partial"].includes(order.payment_status) && (
                        <DropdownMenuItem
                            onClick={() => setChangePaymentOpen(true)}
                            className="whitespace-nowrap"
                        >
                            <CreditCard className="mr-2 h-4 w-4 shrink-0" />
                            Receive Payment
                        </DropdownMenuItem>
                    )}
                    </DropdownMenuContent>
            </DropdownMenu>

            <ViewOrderDialog
                open={viewOpen}
                onOpenChange={setViewOpen}
                order={order}
            />
            <ReceivePaymentDialog
                open={changePaymentOpen}
                onOpenChange={setChangePaymentOpen}
                order={order}
                onSuccess={onSuccess}
            />
            <OrderStatusDialog
                open={orderStatusOpen}
                onOpenChange={setOrderStatusOpen}
                order={order}
                onSuccess={onSuccess}
            />
        </>
    );
}