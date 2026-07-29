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
import { Eye, MoreHorizontal } from "lucide-react";

interface Props {
    order: Order;
    onSuccess: () => Promise<void>;
}

export default function OrderActions({
    order,
    onSuccess,
}: Props) {
    const [viewOpen, setViewOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger render={
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                }>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setViewOpen(true)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ViewOrderDialog
                open={viewOpen}
                onOpenChange={setViewOpen}
                order={order}
            />
        </>
    );
}