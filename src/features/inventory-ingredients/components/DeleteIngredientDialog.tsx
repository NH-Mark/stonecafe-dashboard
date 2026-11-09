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

import { InventoryIngredient } from "@/types/inventory-ingredient";
import { deleteIngredient } from "../ingredient.service";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ingredient: InventoryIngredient;
    onSuccess: () => Promise<void>;
}

export default function DeleteIngredientDialog({
    open,
    onOpenChange,
    ingredient,
    onSuccess,
}: Props) {
    async function remove() {
        try {
            await deleteIngredient(ingredient.id);

            await onSuccess();

            onOpenChange(false);
            toast.success("Ingredient deleted successfully.");
        } catch {
            toast.error("Failed to delete ingredient.");
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
                        Delete Ingredient
                    </DialogTitle>

                    <DialogDescription>
                        Are you sure you want to delete{" "}
                        <strong>{ingredient.name}</strong>?
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
