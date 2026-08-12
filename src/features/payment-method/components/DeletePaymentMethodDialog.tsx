"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { PaymentMethod } from "@/types/payment-method";
import { deletePaymentMethod } from "../payment-method.service";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    paymentMethod: PaymentMethod;
    onSuccess: () => Promise<void>;
}

export default function DeletePaymentMethodDialog({
    open,
    onOpenChange,
    paymentMethod,
    onSuccess,
}: Props) {

    async function remove() {
        try {
            await deletePaymentMethod(paymentMethod.id);

            await onSuccess();

            onOpenChange(false);
            toast.success("payment Method Deleted successfully.");
        }
        catch{
            toast.error(
            "Failed to delete."
            );
        }
    }

    return (

        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent className="sm:max-w-md">

                <DialogHeader>

                    <DialogTitle>
                        Delete Discount
                    </DialogTitle>

                    <DialogDescription>
                        Are you sure you want to delete{" "}
                        <strong>{paymentMethod.name}</strong>?
                        <br />
                        This action cannot be undone.
                    </DialogDescription>

                </DialogHeader>

                <DialogFooter>

                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={remove}
                    >
                        Delete
                    </Button>

                </DialogFooter>

            </DialogContent>

        </Dialog>

    );

}