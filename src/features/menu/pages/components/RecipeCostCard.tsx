"use client";

import { useEffect, useMemo } from "react";
import {
    useFieldArray,
    useFormContext,
    useWatch,
} from "react-hook-form";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { MenuItemFormValues } from "../../menu-item.schema";
import { InventoryIngredient } from "@/types/inventory-ingredient";
import { Info, Trash2 } from "lucide-react";

interface IngredientOption {
    id: number;
    name: string;
    unit_name: string;
    cost_per_unit: number;
}

interface Props {
    ingredients: InventoryIngredient[];
}

function buildIngredientOption(
    ingredient: InventoryIngredient
): IngredientOption {
    return {
        id: Number(ingredient.id),
        name: ingredient.name,
        unit_name:
            ingredient.measurement_unit?.name ||
            ingredient.measurement_unit_name ||
            ingredient.buying_unit_name ||
            "-",
        cost_per_unit: Number(
            ingredient.cost_per_unit ??
                ingredient.last_buying_price ??
                0
        ),
    };
}

export default function RecipeCostCard({
    ingredients,
}: Props) {
    const {
        control,
        getValues,
        watch,
        setValue,
        register,
    } = useFormContext<MenuItemFormValues>();

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "menu_item_ingredients",
    });

    const recipeRows =
        useWatch({
            control,
            name: "menu_item_ingredients",
        }) ?? [];

    const sellingPrice = Number(
        useWatch({
            control,
            name: "price",
        }) ?? 0
    );

    function toFiniteNumber(value: unknown) {
        const parsed = Number(value ?? 0);

        return Number.isFinite(parsed)
            ? parsed
            : 0;
    }

    function getRowSubtotal(row?: {
        quantity?: unknown;
        cost_per_unit?: unknown;
    }) {
        return (
            toFiniteNumber(
                row?.quantity
            ) *
            toFiniteNumber(
                row?.cost_per_unit
            )
        );
    }

    const ingredientOptions = useMemo(
        () =>
            ingredients.map(
                buildIngredientOption
            ),
        [ingredients]
    );

    const selectedIngredientIds =
        new Set(
            recipeRows.map((row) =>
                Number(row.ingredient_id)
            )
        );

    const availableOptions =
        ingredientOptions.filter(
            (option) =>
                !selectedIngredientIds.has(
                    option.id
                )
        );

    const recipeCostTotal = useMemo(
        () =>
            recipeRows.reduce(
                (sum, row) => {
                    return (
                        sum +
                        getRowSubtotal(
                            row
                        )
                    );
                },
                0
            ),
        [recipeRows]
    );

    const roundedRecipeCostTotal = useMemo(
        () =>
            Number(
                recipeCostTotal.toFixed(3)
            ),
        [recipeCostTotal]
    );

    useEffect(() => {
        const nextRows = recipeRows.map(
            (row, index) => {
                return {
                    ...row,
                    subtotal:
                        getRowSubtotal(
                            row
                        ),
                    sort_order: index,
                };
            }
        );

        const hasRowChange = nextRows.some(
            (row, index) => {
                const current =
                    recipeRows[index];

                return (
                    Number(
                        row.subtotal
                    ) !==
                        Number(
                            current?.subtotal
                        ) ||
                    Number(
                        row.sort_order
                    ) !==
                        Number(
                            current?.sort_order
                        )
                );
            }
        );

        if (hasRowChange) {
            setValue(
                "menu_item_ingredients",
                nextRows,
                {
                    shouldDirty: true,
                    shouldValidate: true,
                }
            );
        }

        const currentCostPrice = Number(
            getValues("cost_price") ?? 0
        );

        if (currentCostPrice !== roundedRecipeCostTotal) {
            setValue("cost_price", roundedRecipeCostTotal, {
                shouldDirty: true,
                shouldValidate: true,
            });
        }
    }, [
        recipeRows,
        recipeCostTotal,
        roundedRecipeCostTotal,
        getValues,
        setValue,
    ]);

    function addIngredient(
        ingredientId: number
    ) {
        const selected = ingredientOptions.find(
            (option) =>
                option.id === ingredientId
        );

        if (!selected) {
            return;
        }

        append({
            ingredient_id: selected.id,
            unit_name: selected.unit_name,
            cost_per_unit:
                selected.cost_per_unit,
            quantity: 1,
            subtotal:
                selected.cost_per_unit,
            sort_order: fields.length,
        });
    }

    function formatCurrency(value: number) {
        if (!Number.isFinite(value)) {
            return "0.000 QAR";
        }

        return `${value.toFixed(3)} QAR`;
    }

    function formatFullPrecision(value: number) {
        if (!Number.isFinite(value)) {
            return "0";
        }

        return value
            .toFixed(10)
            .replace(/\.0+$/, "")
            .replace(/(\.\d*?)0+$/, "$1");
    }

    const foodCostPercentage =
        sellingPrice > 0
            ? (recipeCostTotal / sellingPrice) * 100
            : 0;

    const grossProfitAmount =
        sellingPrice - recipeCostTotal;

    const grossProfitPercentage =
        sellingPrice > 0
            ? (grossProfitAmount / sellingPrice) * 100
            : 0;

    function updateRowSubtotal(
        index: number,
        overrides?: {
            cost_per_unit?: number;
            quantity?: number;
        }
    ) {
        const current =
            getValues(
                `menu_item_ingredients.${index}`
            );

        const subtotal = getRowSubtotal({
            cost_per_unit:
                overrides?.cost_per_unit ??
                current?.cost_per_unit ??
                0,
            quantity:
                overrides?.quantity ??
                current?.quantity ??
                0,
        });

        setValue(
            `menu_item_ingredients.${index}.subtotal`,
            subtotal,
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Recipe Cost
                </CardTitle>
                <CardDescription>
                    Add ingredients and quantity to auto-calculate cost price.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex items-end gap-3">
                    <div className="space-y-2 flex-1">
                        <Label>Add Ingredient</Label>
                        <select
                            className="w-full rounded-md border p-2"
                            onChange={(event) => {
                                const id = Number(
                                    event.target
                                        .value
                                );

                                if (
                                    Number.isFinite(id) &&
                                    id > 0
                                ) {
                                    addIngredient(id);
                                    event.target.value = "";
                                }
                            }}
                            defaultValue=""
                        >
                            <option value="">
                                Select ingredient
                            </option>
                            {availableOptions.map(
                                (option) => (
                                    <option
                                        key={
                                            option.id
                                        }
                                        value={
                                            option.id
                                        }
                                    >
                                        {option.name}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-left text-muted-foreground">
                                <th className="py-2 pr-3">Ingredient</th>
                                <th className="py-2 pr-3">Unit</th>
                                <th className="py-2 pr-3">Cost / Unit</th>
                                <th className="py-2 pr-3">Qty</th>
                                <th className="py-2 pr-3">Subtotal</th>
                                <th className="py-2">&nbsp;</th>
                            </tr>
                        </thead>

                        <tbody>
                            {fields.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-4 text-center text-muted-foreground"
                                    >
                                        No ingredients added yet.
                                    </td>
                                </tr>
                            )}

                            {fields.map(
                                (field, index) => {
                                    const row =
                                        recipeRows[
                                            index
                                        ];
                                    const option = ingredientOptions.find(
                                        (item) =>
                                            item.id ===
                                            Number(
                                                row?.ingredient_id
                                            )
                                    );

                                    return (
                                        <tr
                                            key={
                                                field.id
                                            }
                                            className="border-b"
                                        >
                                            <td className="py-2 pr-3">
                                                {option?.name ||
                                                    "-"}
                                            </td>

                                            <td className="py-2 pr-3">
                                                {row?.unit_name ||
                                                    "-"}
                                            </td>

                                            <td className="py-2 pr-3">
                                                <Input
                                                    type="number"
                                                    step="0.000001"
                                                    min="0"
                                                    {...register(
                                                        `menu_item_ingredients.${index}.cost_per_unit`,
                                                        {
                                                            valueAsNumber: true,
                                                            onChange: (event) => {
                                                                const next = Number(
                                                                    event.target.value
                                                                );

                                                                updateRowSubtotal(index, {
                                                                    cost_per_unit: Number.isFinite(next)
                                                                        ? next
                                                                        : 0,
                                                                });
                                                            },
                                                        }
                                                    )}
                                                    className="w-32"
                                                />
                                            </td>

                                            <td className="py-2 pr-3">
                                                <Input
                                                    type="number"
                                                    step="0.0001"
                                                    min="0"
                                                    {...register(
                                                        `menu_item_ingredients.${index}.quantity`,
                                                        {
                                                            valueAsNumber: true,
                                                            onChange: (event) => {
                                                                const next = Number(
                                                                    event.target.value
                                                                );

                                                                updateRowSubtotal(index, {
                                                                    quantity: Number.isFinite(next)
                                                                        ? next
                                                                        : 0,
                                                                });
                                                            },
                                                        }
                                                    )}
                                                    className="w-28"
                                                />
                                            </td>

                                            <td className="py-2 pr-3 font-medium">
                                                {getRowSubtotal(
                                                    row
                                                ).toFixed(4)}
                                            </td>

                                            <td className="py-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        remove(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="grid gap-4 lg:grid-cols-12">
                    <div className="lg:col-span-6 rounded-md border overflow-hidden">
                        <div className="grid grid-cols-3 border-b bg-muted/30 text-sm font-medium">
                            <div className="h-14 px-3 text-center flex items-center justify-center">Cost Price</div>
                            <div className="h-14 px-3 text-center border-x flex items-center justify-center leading-tight">Cost Price & Wastage</div>
                            <div className="h-14 px-3 text-center flex items-center justify-center">Food Cost %</div>
                        </div>
                        <div className="grid grid-cols-3 text-sm">
                            <div className="h-12 px-3 text-center flex flex-col items-center justify-center leading-tight">
                                <div className="inline-flex items-center gap-1.5">
                                    <span>{formatCurrency(recipeCostTotal)}</span>
                                    <span
                                        className="inline-flex items-center text-muted-foreground"
                                        title={`Full value: ${formatFullPrecision(recipeCostTotal)} QAR`}
                                    >
                                        <Info className="h-3.5 w-3.5" />
                                    </span>
                                </div>
                                {/* <span className="text-[11px] text-muted-foreground">
                                    Full: {formatFullPrecision(recipeCostTotal)} QAR
                                </span> */}
                            </div>
                            <div className="h-12 px-3 text-center border-x flex items-center justify-center">{formatCurrency(recipeCostTotal)}</div>
                            <div className="h-12 px-3 text-center flex items-center justify-center">{foodCostPercentage.toFixed(2)}%</div>
                        </div>
                    </div>

                    <div className="lg:col-span-3 rounded-md border overflow-hidden">
                        <div className="grid grid-cols-2 border-b bg-muted/30 text-sm font-medium">
                            <div className="h-14 px-3 text-center flex items-center justify-center">Suggested</div>
                            <div className="h-14 px-3 text-center border-l flex items-center justify-center">Actual</div>
                        </div>
                        <div className="grid grid-cols-2 text-sm">
                            <div className="h-12 px-3 text-center flex items-center justify-center">{formatCurrency(0)}</div>
                            <div className="h-12 px-3 text-center border-l flex items-center justify-center">{formatCurrency(sellingPrice)}</div>
                        </div>
                    </div>

                    <div className="lg:col-span-3 rounded-md border overflow-hidden">
                        <div className="grid grid-cols-2 border-b bg-muted/30 text-sm font-medium">
                            <div className="h-14 px-3 text-center flex items-center justify-center">Amount</div>
                            <div className="h-14 px-3 text-center border-l flex items-center justify-center">Percentage (%)</div>
                        </div>
                        <div className="grid grid-cols-2 text-sm">
                            <div className="h-12 px-3 text-center flex items-center justify-center">{formatCurrency(grossProfitAmount)}</div>
                            <div className="h-12 px-3 text-center border-l flex items-center justify-center">{grossProfitPercentage.toFixed(2)}%</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
