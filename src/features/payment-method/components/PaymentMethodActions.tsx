"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Button
} from "@/components/ui/button";

import {
    MoreHorizontal,
    Pencil,
    Trash2
} from "lucide-react";
import { PaymentMethod } from "@/types/payment-method";
import EditPaymentMethodDialog from "./EditPaymentMethodDialog";
import DeletePaymentMethodDialog from "./DeletePaymentMethodDialog";

interface Props {
  paymentMethod: PaymentMethod;
  onSuccess: () => Promise<void>;

} 
export default function PaymentMethodActions({
    paymentMethod,
    onSuccess,
}: Props) {

    const [editOpen, setEditOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <>
            <DropdownMenu>

                <DropdownMenuTrigger
                    render={
                        <Button
                            variant="ghost"
                            size="icon"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    }
                />

                <DropdownMenuContent align="end">

                    <DropdownMenuItem
                        onClick={() => setEditOpen(true)}
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => setDeleteOpen(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>

                </DropdownMenuContent>

            </DropdownMenu>

             <EditPaymentMethodDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                paymentMethod={paymentMethod}
                onSuccess={onSuccess}
            />

             <DeletePaymentMethodDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                paymentMethod={paymentMethod}
                onSuccess={onSuccess}
            />

           
        </>
    );
}