"use client";

import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import {
    MoreHorizontal,
    Pencil,
    Trash2,
} from "lucide-react";
import { InventoryIngredientCategory } from "@/types/inventory-ingredient-category";
import EditIngredientCategoryDialog from "./EditIngredientCategoryDialog";
import DeleteIngredientCategoryDialog from "./DeleteIngredientCategoryDialog";
import PermissionGuard from "@/components/guards/PermissionGuard";

interface Props {
    ingredientCategory: InventoryIngredientCategory;
    onSuccess: () => Promise<void>;
}

export default function IngredientCategoryActions({
    ingredientCategory,
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
                    <PermissionGuard permission="inventory.view">
                        <DropdownMenuItem
                            onClick={() => setEditOpen(true)}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                    </PermissionGuard>

                    <PermissionGuard permission="inventory.view">
                        <DropdownMenuItem
                            onClick={() => setDeleteOpen(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </PermissionGuard>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditIngredientCategoryDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                ingredientCategory={
                    ingredientCategory
                }
                onSuccess={onSuccess}
            />

            <DeleteIngredientCategoryDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                ingredientCategory={
                    ingredientCategory
                }
                onSuccess={onSuccess}
            />
        </>
    );
}
