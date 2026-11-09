"use client";

import { useEffect, useMemo, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { listMenuItems } from "@/features/menu/menu.service";
import { getIngredientUsage } from "../ingredient.service";
import { InventoryIngredient } from "@/types/inventory-ingredient";
import { MenuItem, MenuItemIngredient } from "@/types/menu-item";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ingredient: InventoryIngredient;
}

interface UsageRow {
    menuItemId: number;
    menuItemName: string;
    usedQty: number;
    unitName: string;
    costPerUnit: number;
    costInRecipe: number;
}

interface IngredientUsageApiRow {
    menu_item_id?: number;
    menu_item_name?: string;
    used_qty?: number;
    quantity?: number;
    unit_name?: string | null;
    cost_per_unit?: number;
    cost_in_recipe?: number;
    subtotal?: number;
    menu_item?: {
        id?: number;
        name?: string;
    };
}

function toNumber(value: unknown) {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
}

function formatNumber(value: number, digits = 3) {
    return value.toFixed(digits);
}

function mapUsageFromApiRows(
    rows: IngredientUsageApiRow[],
    ingredient: InventoryIngredient
): UsageRow[] {
    return rows.map((row, index) => {
        const usedQty = toNumber(
            row.used_qty ?? row.quantity
        );
        const costPerUnit = toNumber(
            row.cost_per_unit
        );
        const costInRecipe =
            row.cost_in_recipe == null
                ? row.subtotal == null
                    ? usedQty * costPerUnit
                    : toNumber(row.subtotal)
                : toNumber(row.cost_in_recipe);

        return {
            menuItemId: Number(
                row.menu_item_id ??
                    row.menu_item?.id ??
                    index + 1
            ),
            menuItemName:
                row.menu_item_name ??
                row.menu_item?.name ??
                "-",
            usedQty,
            unitName:
                row.unit_name ||
                ingredient.measurement_unit?.name ||
                ingredient.measurement_unit_name ||
                ingredient.buying_unit_name ||
                "-",
            costPerUnit,
            costInRecipe,
        };
    });
}

export default function IngredientUsageDialog({
    open,
    onOpenChange,
    ingredient,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [usageRows, setUsageRows] = useState<UsageRow[]>([]);
    const [loadedIngredientId, setLoadedIngredientId] = useState<number | null>(null);

    useEffect(() => {
        function mapFromMenuItems(
            menuItems: MenuItem[]
        ) {
            const nextRows: UsageRow[] = [];

            menuItems.forEach((menuItem) => {
                const ingredientRows =
                    menuItem.menu_item_ingredients ?? [];

                ingredientRows.forEach((row: MenuItemIngredient) => {
                    if (
                        Number(row.ingredient_id) !==
                        Number(ingredient.id)
                    ) {
                        return;
                    }

                    const usedQty = toNumber(row.quantity);
                    const costPerUnit = toNumber(row.cost_per_unit);
                    const costInRecipe =
                        row.subtotal == null
                            ? usedQty * costPerUnit
                            : toNumber(row.subtotal);

                    nextRows.push({
                        menuItemId: Number(menuItem.id),
                        menuItemName: menuItem.name,
                        usedQty,
                        unitName:
                            row.unit_name ||
                            ingredient.measurement_unit?.name ||
                            ingredient.measurement_unit_name ||
                            ingredient.buying_unit_name ||
                            "-",
                        costPerUnit,
                        costInRecipe,
                    });
                });
            });

            return nextRows;
        }

        async function loadUsage() {
            try {
                setLoading(true);

                try {
                    const usageResponse =
                        await getIngredientUsage(
                            Number(ingredient.id)
                        );

                    const usagePayload =
                        usageResponse.data?.data ??
                        usageResponse.data ??
                        [];

                    const usageRowsFromApi =
                        mapUsageFromApiRows(
                            Array.isArray(
                                usagePayload
                            )
                                ? usagePayload
                                : [],
                            ingredient
                        );

                    setUsageRows(usageRowsFromApi);
                    setLoadedIngredientId(Number(ingredient.id));
                    return;
                } catch {
                    const response = await listMenuItems(
                        undefined,
                        undefined,
                        false
                    );

                    const menuItems: MenuItem[] =
                        response.data?.data ?? [];

                    setUsageRows(
                        mapFromMenuItems(menuItems)
                    );
                }

                setLoadedIngredientId(Number(ingredient.id));
            } finally {
                setLoading(false);
            }
        }

        if (!open) {
            return;
        }

        if (loadedIngredientId === Number(ingredient.id)) {
            return;
        }

        void loadUsage();
    }, [open, ingredient, loadedIngredientId]);

    const totalCostInRecipe = useMemo(
        () =>
            usageRows.reduce(
                (sum, row) => sum + toNumber(row.costInRecipe),
                0
            ),
        [usageRows]
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-6xl">
                <DialogHeader>
                    <DialogTitle>
                        {ingredient.name} - Recipe Usage
                    </DialogTitle>
                    <DialogDescription>
                        All menu items using this ingredient with usage and costing details.
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-auto rounded-md border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                                <th className="px-3 py-2">Recipes</th>
                                <th className="px-3 py-2">Used Qty</th>
                                <th className="px-3 py-2">Unit Name</th>
                                <th className="px-3 py-2">Cost/Unit</th>
                                <th className="px-3 py-2">Cost in Recipe</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-3 py-4 text-muted-foreground"
                                    >
                                        Loading usage...
                                    </td>
                                </tr>
                            )}

                            {!loading && usageRows.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-3 py-4 text-muted-foreground"
                                    >
                                        No menu items are currently using this ingredient.
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                usageRows.map((row) => (
                                    <tr
                                        key={`${row.menuItemId}-${row.menuItemName}`}
                                        className="border-b"
                                    >
                                        <td className="px-3 py-2">{row.menuItemName}</td>
                                        <td className="px-3 py-2">{formatNumber(row.usedQty, 4)}</td>
                                        <td className="px-3 py-2">{row.unitName}</td>
                                        <td className="px-3 py-2">{formatNumber(row.costPerUnit, 3)}</td>
                                        <td className="px-3 py-2">{formatNumber(row.costInRecipe, 3)}</td>
                                    </tr>
                                ))}
                        </tbody>

                        {!loading && usageRows.length > 0 && (
                            <tfoot>
                                <tr className="font-medium">
                                    <td colSpan={4} className="px-3 py-2 text-right">
                                        Total:
                                    </td>
                                    <td className="px-3 py-2">
                                        {formatNumber(totalCostInRecipe, 3)}
                                    </td>
                                </tr>
                            </tfoot>
                        )}
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
