"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import PermissionGuard from "@/components/guards/PermissionGuard";

import {
    ListTree,
    MoreHorizontal,
    Pencil,
    Trash2,
} from "lucide-react";

import { InventoryIngredient } from "@/types/inventory-ingredient";
import DeleteIngredientDialog from "./DeleteIngredientDialog";
import IngredientUsageDialog from "./IngredientUsageDialog";

interface Props {
    ingredient: InventoryIngredient;
    onSuccess: () => Promise<void>;
}

export default function IngredientActions({
    ingredient,
    onSuccess,
}: Props) {
    const router = useRouter();

    const [deleteOpen, setDeleteOpen] =
        useState(false);
    const [usageOpen, setUsageOpen] =
        useState(false);

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
                            onClick={() =>
                                setUsageOpen(true)
                            }
                        >
                            <ListTree className="mr-2 h-4 w-4" />
                            Usage
                        </DropdownMenuItem>
                    </PermissionGuard>

                    <PermissionGuard permission="inventory.view">
                        <DropdownMenuItem
                            onClick={() =>
                                router.push(
                                    `/ingredients/${ingredient.id}`
                                )
                            }
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                    </PermissionGuard>

                    <PermissionGuard permission="inventory.view">
                        <DropdownMenuItem
                            onClick={() =>
                                setDeleteOpen(true)
                            }
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </PermissionGuard>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteIngredientDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                ingredient={ingredient}
                onSuccess={onSuccess}
            />

            <IngredientUsageDialog
                open={usageOpen}
                onOpenChange={setUsageOpen}
                ingredient={ingredient}
            />
        </>
    );
}
