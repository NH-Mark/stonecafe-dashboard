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
import { OrderSource } from "@/types/order-sources";
import { deleteOrderSource } from "../order-sources.service";
interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orderSource: OrderSource;
    onSuccess: () => Promise<void>;
}

export default function DeleteOrderSourceDialog({
    open,
    onOpenChange,
    orderSource,
    onSuccess,
}: Props) {

    async function remove() {
        try {
            await deleteOrderSource(orderSource.id);

            await onSuccess();

            onOpenChange(false);
            toast.success("Order Source Deleted successfully.");
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
                        <strong>{orderSource.name}</strong>?
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