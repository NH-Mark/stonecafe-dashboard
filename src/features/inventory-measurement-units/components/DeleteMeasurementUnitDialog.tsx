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
import { InventoryMeasurementUnit } from "@/types/inventory-measurement-unit";
import { deleteMeasurementUnit } from "../measurement-unit.service";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    measurementUnit: InventoryMeasurementUnit;
    onSuccess: () => Promise<void>;
}

export default function DeleteMeasurementUnitDialog({
    open,
    onOpenChange,
    measurementUnit,
    onSuccess,
}: Props) {
    async function remove() {
        try {
            await deleteMeasurementUnit(measurementUnit.id);

            await onSuccess();

            onOpenChange(false);
            toast.success("Measurement unit deleted successfully.");
        } catch {
            toast.error(
                "Failed to delete measurement unit."
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
                        Delete Measurement Unit
                    </DialogTitle>

                    <DialogDescription>
                        Are you sure you want to delete{" "}
                        <strong>{measurementUnit.name}</strong>?
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
