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
import { InventoryIngredientCategory } from "@/types/inventory-ingredient-category";
import { deleteIngredientCategory } from "../ingredient-category.service";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ingredientCategory: InventoryIngredientCategory;
    onSuccess: () => Promise<void>;
}

export default function DeleteIngredientCategoryDialog({
    open,
    onOpenChange,
    ingredientCategory,
    onSuccess,
}: Props) {
    async function remove() {
        try {
            await deleteIngredientCategory(ingredientCategory.id);

            await onSuccess();

            onOpenChange(false);
            toast.success("Ingredient category deleted successfully.");
        } catch {
            toast.error(
                "Failed to delete ingredient category."
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
                        Delete Ingredient Category
                    </DialogTitle>

                    <DialogDescription>
                        Are you sure you want to delete{" "}
                        <strong>{ingredientCategory.name}</strong>?
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
