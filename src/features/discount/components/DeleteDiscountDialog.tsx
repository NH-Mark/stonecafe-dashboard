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
import { Discount } from "@/types/discount";
import { deleteDiscount } from "../discount.service";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    discount: Discount;
    onSuccess: () => Promise<void>;
}

export default function DeleteDiscountDialog({
    open,
    onOpenChange,
    discount,
    onSuccess,
}: Props) {

    async function remove() {
        try {
            await deleteDiscount(discount.id);

            await onSuccess();

            onOpenChange(false);
            toast.success("Discount Deleted successfully.");
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
                        <strong>{discount.name}</strong>?
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