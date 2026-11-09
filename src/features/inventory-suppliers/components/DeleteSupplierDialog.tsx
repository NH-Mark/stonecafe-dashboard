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
import { InventorySupplier } from "@/types/inventory-supplier";
import { deleteSupplier } from "../supplier.service";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    supplier: InventorySupplier;
    onSuccess: () => Promise<void>;
}

export default function DeleteSupplierDialog({
    open,
    onOpenChange,
    supplier,
    onSuccess,
}: Props) {
    async function remove() {
        try {
            await deleteSupplier(supplier.id);

            await onSuccess();

            onOpenChange(false);
            toast.success("Supplier deleted successfully.");
        } catch {
            toast.error(
                "Failed to delete supplier."
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
                        Delete Supplier
                    </DialogTitle>

                    <DialogDescription>
                        Are you sure you want to delete{" "}
                        <strong>{supplier.name}</strong>?
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
