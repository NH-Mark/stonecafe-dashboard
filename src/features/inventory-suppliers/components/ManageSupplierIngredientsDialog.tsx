"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { InventorySupplier } from "@/types/inventory-supplier";
import { InventoryIngredient } from "@/types/inventory-ingredient";
import { getIngredients } from "@/features/inventory-ingredients/ingredient.service";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    supplier: InventorySupplier;
}

function isIngredientLinkedToSupplier(
    ingredient: InventoryIngredient,
    supplierId: number
) {
    const rows =
        ingredient.suppliers ??
        ingredient.inventory_ingredient_suppliers ??
        [];

    return rows.some((row) => {
        const linkedSupplierId = Number(
            row.supplier_id ?? row.supplier?.id
        );

        return linkedSupplierId === supplierId;
    });
}

function resolveDefaultSupplierFlag(
    ingredient: InventoryIngredient,
    supplierId: number
) {
    const rows =
        ingredient.suppliers ??
        ingredient.inventory_ingredient_suppliers ??
        [];

    const linkedRow = rows.find((row) => {
        const linkedSupplierId = Number(
            row.supplier_id ?? row.supplier?.id
        );

        return linkedSupplierId === supplierId;
    });

    return Boolean(linkedRow?.is_default);
}

export default function ManageSupplierIngredientsDialog({
    open,
    onOpenChange,
    supplier,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [ingredients, setIngredients] = useState<InventoryIngredient[]>([]);

    useEffect(() => {
        async function loadLinkedIngredients() {
            try {
                setLoading(true);

                const response = await getIngredients({
                    per_page: 1000,
                });

                const items =
                    response.data?.data ??
                    response.data ??
                    [];

                const linkedItems = (Array.isArray(items)
                    ? items
                    : []
                ).filter((ingredient) =>
                    isIngredientLinkedToSupplier(
                        ingredient,
                        Number(supplier.id)
                    )
                );

                setIngredients(linkedItems);
            } catch (error) {
                console.error(
                    "Failed to load supplier ingredients:",
                    error
                );
                toast.error(
                    "Failed to load linked ingredients."
                );
            } finally {
                setLoading(false);
            }
        }

        if (!open) {
            return;
        }

        void loadLinkedIngredients();
    }, [open, supplier.id]);

    const title = useMemo(
        () => `Manage Ingredients - ${supplier.name}`,
        [supplier.name]
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        List of ingredients connected to this supplier.
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[55vh] overflow-auto rounded-md border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                                <th className="px-3 py-2">Ingredient</th>
                                <th className="px-3 py-2">Code</th>
                                <th className="px-3 py-2">Default</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td
                                        className="px-3 py-4 text-muted-foreground"
                                        colSpan={3}
                                    >
                                        Loading ingredients...
                                    </td>
                                </tr>
                            )}

                            {!loading && ingredients.length === 0 && (
                                <tr>
                                    <td
                                        className="px-3 py-4 text-muted-foreground"
                                        colSpan={3}
                                    >
                                        No ingredients connected to this supplier.
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                ingredients.map((ingredient) => {
                                    const isDefault = resolveDefaultSupplierFlag(
                                        ingredient,
                                        Number(supplier.id)
                                    );

                                    return (
                                        <tr
                                            key={ingredient.id}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="px-3 py-2">
                                                {ingredient.name}
                                            </td>
                                            <td className="px-3 py-2">
                                                {ingredient.sku || "-"}
                                            </td>
                                            <td className="px-3 py-2">
                                                {isDefault ? (
                                                    <Badge>Default</Badge>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
