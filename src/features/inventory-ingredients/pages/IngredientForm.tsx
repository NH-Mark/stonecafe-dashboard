"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    FormProvider,
    UseFormReturn,
    useFieldArray,
    useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { InventoryIngredientCategory } from "@/types/inventory-ingredient-category";
import { InventoryIngredient } from "@/types/inventory-ingredient";
import { InventoryMeasurementUnit } from "@/types/inventory-measurement-unit";
import { InventorySupplier } from "@/types/inventory-supplier";
import { Location } from "@/types/location";

import {
    IngredientFormInput,
    IngredientFormValues,
    ingredientSchema,
} from "../ingredient.schema";

interface IngredientFormProps {
    mode?: "create" | "edit";
    ingredient?: InventoryIngredient;
    categories: InventoryIngredientCategory[];
    measurementUnits: InventoryMeasurementUnit[];
    suppliers: InventorySupplier[];
    locations: Location[];
    onSubmit: (
        values: IngredientFormValues,
        form: UseFormReturn<
            IngredientFormInput,
            unknown,
            IngredientFormValues
        >
    ) => Promise<void>;
}

function toNullableNumber(value: unknown): number | null {
    if (value == null || value === "") {
        return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function mapIngredientToFormValues(
    ingredient: InventoryIngredient
): Partial<IngredientFormInput> {
    const supplierRows =
        ingredient.suppliers ??
        ingredient.inventory_ingredient_suppliers ??
        [];

    const locationRows =
        ingredient.locations ??
        ingredient.location_ingredients ??
        ingredient.inventory_location_ingredients ??
        [];

    return {
        ingredient_type:
            ingredient.ingredient_type ?? "ingredient",
        name: ingredient.name ?? "",
        sku: ingredient.sku ?? "",
        description: ingredient.description ?? "",
        category_id: toNullableNumber(
            ingredient.category_id
        ),
        measurement_unit_id:
            toNullableNumber(
                ingredient.measurement_unit_id ??
                    ingredient.measurement_unit?.id
            ) ?? 0,
        buying_unit_name:
            ingredient.buying_unit_name ?? "",
        has_sub_unit: Boolean(
            ingredient.has_sub_unit
        ),
        sub_unit_name:
            ingredient.sub_unit_name ?? null,
        unit_to_sub_unit_quantity:
            toNullableNumber(
                ingredient.unit_to_sub_unit_quantity ??
                    ingredient.buying_unit_quantity
            ),
        sub_unit_to_base_quantity:
            toNullableNumber(
                ingredient.sub_unit_to_base_quantity
            ),
        buying_unit_quantity:
            toNullableNumber(
                ingredient.buying_unit_quantity
            ) ?? 1,
        net_quantity: toNullableNumber(
            ingredient.net_quantity
        ),
        last_buying_price:
            toNullableNumber(
                ingredient.last_buying_price
            ),
        cost_per_unit:
            toNullableNumber(
                ingredient.cost_per_unit
            ),
        is_active:
            ingredient.is_active == null
                ? true
                : Boolean(
                      ingredient.is_active
                  ),
        suppliers: supplierRows.map((row) => ({
            supplier_id:
                toNullableNumber(
                    row.supplier_id ??
                        row.supplier?.id
                ) ?? 0,
            price:
                toNullableNumber(row.price) ?? 0,
            buying_unit:
                row.buying_unit ?? "",
            has_sub_unit: Boolean(
                row.has_sub_unit
            ),
            sub_unit_name:
                row.sub_unit_name ?? null,
            unit_to_sub_unit_quantity:
                toNullableNumber(
                    row.unit_to_sub_unit_quantity
                ),
            sub_unit_to_base_quantity:
                toNullableNumber(
                    row.sub_unit_to_base_quantity
                ),
            net_quantity:
                toNullableNumber(
                    row.net_quantity
                ),
            is_default: Boolean(
                row.is_default
            ),
        })),
        locations: locationRows.map((row) => ({
            location_id:
                toNullableNumber(
                    row.location_id ??
                        row.location?.id
                ) ?? 0,
            opening_balance:
                toNullableNumber(
                    row.opening_balance
                ) ?? 0,
            reorder_level:
                toNullableNumber(
                    row.reorder_level
                ) ?? 0,
            track_inventory:
                row.track_inventory == null
                    ? true
                    : Boolean(
                          row.track_inventory
                      ),
        })),
    };
}

export default function IngredientForm({
    mode = "create",
    ingredient,
    categories,
    measurementUnits,
    suppliers,
    locations,
    onSubmit,
}: IngredientFormProps) {
    const form = useForm<IngredientFormInput, unknown, IngredientFormValues>({
        resolver: zodResolver(ingredientSchema),
        defaultValues: {
            ingredient_type: "ingredient",
            name: "",
            sku: "",
            description: "",
            category_id: null,
            measurement_unit_id: 0,
            buying_unit_name: "",
            has_sub_unit: false,
            sub_unit_name: null,
            unit_to_sub_unit_quantity: null,
            sub_unit_to_base_quantity: null,
            buying_unit_quantity: 1,
            net_quantity: null,
            last_buying_price: null,
            cost_per_unit: null,
            is_active: true,
            suppliers: [],
            locations: [],
        },
    });

    const {
        register,
        control,
        watch,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = form;

    const supplierFields = useFieldArray({
        control,
        name: "suppliers",
    });

    useEffect(() => {
        if (!ingredient) {
            return;
        }

        form.reset({
            ingredient_type: "ingredient",
            name: "",
            sku: "",
            description: "",
            category_id: null,
            measurement_unit_id: 0,
            buying_unit_name: "",
            has_sub_unit: false,
            sub_unit_name: null,
            unit_to_sub_unit_quantity: null,
            sub_unit_to_base_quantity: null,
            buying_unit_quantity: 1,
            net_quantity: null,
            last_buying_price: null,
            cost_per_unit: null,
            is_active: true,
            suppliers: [],
            locations: [],
            ...mapIngredientToFormValues(
                ingredient
            ),
        });
    }, [ingredient, form]);

    useEffect(() => {
        const locationRows = getValues("locations") ?? [];

        if (locationRows.length > 0 || locations.length === 0) {
            return;
        }

        setValue(
            "locations",
            locations.map((location) => ({
                location_id: Number(location.id),
                opening_balance: 0,
                reorder_level: 0,
                track_inventory: true,
            })),
            {
                shouldDirty: false,
                shouldValidate: false,
            }
        );
    }, [locations, getValues, setValue]);

    const hasSubUnit = watch("has_sub_unit");
    const suppliersValue = watch("suppliers") ?? [];
    const locationsValue = watch("locations") ?? [];
    const measurementUnitId = watch("measurement_unit_id");
    const buyingUnitName = watch("buying_unit_name");
    const buyingUnitQuantityValue = watch("buying_unit_quantity");
    const subUnitNameValue = watch("sub_unit_name");
    const subUnitToBaseQuantityValue = watch(
        "sub_unit_to_base_quantity"
    );
    const netQuantityValue = watch("net_quantity");
    const lastBuyingPriceValue = watch(
        "last_buying_price"
    );

    const [customUnitOpen, setCustomUnitOpen] =
        useState(false);
    const [activeSupplierIndex, setActiveSupplierIndex] =
        useState<number | null>(null);
    const [supplierBuyingUnitName, setSupplierBuyingUnitName] =
        useState("");
    const [supplierHasSubUnit, setSupplierHasSubUnit] =
        useState(false);
    const [supplierSubUnitName, setSupplierSubUnitName] =
        useState("");
    const [supplierBuyingUnitQuantity, setSupplierBuyingUnitQuantity] =
        useState("1");
    const [supplierSubUnitQuantity, setSupplierSubUnitQuantity] =
        useState("0");
    const [supplierNetQuantity, setSupplierNetQuantity] =
        useState("0");

    useEffect(() => {
        setValue(
            "unit_to_sub_unit_quantity",
            buyingUnitQuantityValue == null ||
                buyingUnitQuantityValue === ""
                ? null
                : Number(
                      buyingUnitQuantityValue
                  ),
            {
                shouldDirty: false,
                shouldValidate: false,
            }
        );
    }, [
        buyingUnitQuantityValue,
        setValue,
    ]);

    useEffect(() => {
        if (hasSubUnit) {
            return;
        }

        setValue("sub_unit_name", null, {
            shouldDirty: true,
            shouldValidate: true,
        });

        setValue(
            "sub_unit_to_base_quantity",
            null,
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );
    }, [hasSubUnit, setValue]);

    useEffect(() => {
        const isNetEmpty =
            netQuantityValue == null ||
            netQuantityValue === "";

        if (!isNetEmpty) {
            return;
        }

        const parsed = hasSubUnit
            ? Number(buyingUnitQuantityValue ?? 0) *
              Number(subUnitToBaseQuantityValue ?? 0)
            : Number(
                  buyingUnitQuantityValue ?? 0
              );

        if (!Number.isFinite(parsed) || parsed <= 0) {
            return;
        }

        setValue("net_quantity", parsed, {
            shouldDirty: false,
            shouldValidate: false,
        });
    }, [
        hasSubUnit,
        buyingUnitQuantityValue,
        subUnitToBaseQuantityValue,
        netQuantityValue,
        setValue,
    ]);

    const selectedMeasurementUnitName =
        measurementUnits.find(
            (unit) =>
                Number(unit.id) ===
                Number(measurementUnitId)
        )?.name ?? "unit";

    const resolvedBuyingUnitName =
        buyingUnitName?.trim() || "Buying Unit";

    const resolvedBuyingSubUnitName =
        subUnitNameValue?.trim() || "Sub Unit";

    const buyingUnitQuantity = Number(
        buyingUnitQuantityValue ?? 0
    );

    const netQuantity = Number(
        netQuantityValue ?? 0
    );

    const subUnitToBaseQuantity = Number(
        subUnitToBaseQuantityValue ?? 0
    );

    const totalBaseQuantity =
        buyingUnitQuantity > 0 &&
        subUnitToBaseQuantity > 0
            ? buyingUnitQuantity *
              subUnitToBaseQuantity
            : 0;

    const backendCostPerUnit = Number(
        ingredient?.cost_per_unit ?? NaN
    );

    const defaultSupplier =
        suppliersValue.find(
            (item) => item?.is_default
        ) ?? suppliersValue[0];

    const purchaseUnitPrice = Number(
        defaultSupplier?.price ??
            lastBuyingPriceValue ??
            0
    );

    const openingBalanceQty =
        (locationsValue ?? []).reduce(
            (sum, row) =>
                sum +
                Number(
                    row?.opening_balance ?? 0
                ),
            0
        );

    const openingBalanceQtyForFormula =
        mode === "create" &&
        openingBalanceQty < 0
            ? 0
            : openingBalanceQty;

    const openingBalanceValue =
        Number.isFinite(backendCostPerUnit)
            ? openingBalanceQtyForFormula *
              backendCostPerUnit
            : 0;

    const totalPurchaseAmount =
        Number.isFinite(purchaseUnitPrice)
            ? purchaseUnitPrice
            : 0;

    const closingBalance =
        openingBalanceQtyForFormula +
        netQuantity;

    const hasNegativeOpeningBalance =
        openingBalanceQty < 0;

    const shouldLockForNegativeOpening =
        mode !== "create" &&
        hasNegativeOpeningBalance;

    const calculatedCostPerUnit =
        !shouldLockForNegativeOpening &&
        closingBalance !== 0
            ? (openingBalanceValue +
                  totalPurchaseAmount) /
              closingBalance
            : NaN;

    const costPerUnitValue = Number.isFinite(
        calculatedCostPerUnit
    )
        ? calculatedCostPerUnit
        : backendCostPerUnit;

    const supplierUnitToSubUnit = Number(
        supplierBuyingUnitQuantity || 0
    );
    const supplierSubUnitToBase = Number(
        supplierSubUnitQuantity || 0
    );
    const supplierTotalBase =
        supplierUnitToSubUnit > 0 &&
        supplierSubUnitToBase > 0
            ? supplierUnitToSubUnit *
              supplierSubUnitToBase
            : 0;

    function formatQty(value: number) {
        if (!Number.isFinite(value)) {
            return "0";
        }

        return value
            .toFixed(4)
            .replace(/\.0+$/, "")
            .replace(/(\.\d*?)0+$/, "$1");
    }

    function formatCost(value: number) {
        if (!Number.isFinite(value)) {
            return "-";
        }

        return value
            .toFixed(6)
            .replace(/\.0+$/, "")
            .replace(/(\.\d*?)0+$/, "$1");
    }

    function addSupplierRow() {
        supplierFields.append({
            supplier_id: 0,
            price: 0,
            buying_unit: "",
            has_sub_unit: false,
            sub_unit_name: "",
            unit_to_sub_unit_quantity: null,
            sub_unit_to_base_quantity: null,
            net_quantity: null,
            is_default: supplierFields.fields.length === 0,
        });
    }

    function setDefaultSupplier(index: number) {
        const current = getValues("suppliers") ?? [];

        setValue(
            "suppliers",
            current.map((item, itemIndex) => ({
                ...item,
                is_default: itemIndex === index,
            })),
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );
    }

    function openCustomUnitDialog(index: number) {
        const supplierRow =
            getValues(
                `suppliers.${index}`
            );

        const supplierBuyingUnit =
            supplierRow?.buying_unit ?? "";
        const existingHasSubUnit =
            Boolean(
                supplierRow?.has_sub_unit
            );
        const existingSubUnitName =
            supplierRow?.sub_unit_name ?? "";
        const existingUnitToSubUnitQty =
            supplierRow?.unit_to_sub_unit_quantity;
        const existingSubUnitToBaseQty =
            supplierRow?.sub_unit_to_base_quantity;
        const existingNetQuantity =
            supplierRow?.net_quantity;

        setActiveSupplierIndex(index);
        setSupplierBuyingUnitName(
            supplierBuyingUnit || ""
        );
        setSupplierHasSubUnit(
            existingHasSubUnit
        );
        setSupplierSubUnitName(
            existingSubUnitName || ""
        );
        setSupplierBuyingUnitQuantity(
            existingUnitToSubUnitQty == null
                ? "1"
                : String(
                      existingUnitToSubUnitQty
                  )
        );
        setSupplierSubUnitQuantity(
            existingSubUnitToBaseQty == null
                ? "0"
                : String(
                      existingSubUnitToBaseQty
                  )
        );
        setSupplierNetQuantity(
            existingNetQuantity == null
                ? "0"
                : String(existingNetQuantity)
        );
        setCustomUnitOpen(true);
    }

    function clearCustomUnit() {
        if (activeSupplierIndex == null) {
            return;
        }

        setValue(
            `suppliers.${activeSupplierIndex}.buying_unit`,
            "",
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );

        setValue(
            `suppliers.${activeSupplierIndex}.has_sub_unit`,
            false,
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );

        setValue(
            `suppliers.${activeSupplierIndex}.sub_unit_name`,
            null,
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );

        setValue(
            `suppliers.${activeSupplierIndex}.unit_to_sub_unit_quantity`,
            null,
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );

        setValue(
            `suppliers.${activeSupplierIndex}.sub_unit_to_base_quantity`,
            null,
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );

        setValue(
            `suppliers.${activeSupplierIndex}.net_quantity`,
            null,
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );

        setCustomUnitOpen(false);
    }

    function saveCustomUnit() {
        if (activeSupplierIndex == null) {
            return;
        }

        setValue(
            `suppliers.${activeSupplierIndex}.buying_unit`,
            supplierBuyingUnitName,
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );

        setValue(
            `suppliers.${activeSupplierIndex}.has_sub_unit`,
            supplierHasSubUnit,
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );

        setValue(
            `suppliers.${activeSupplierIndex}.sub_unit_name`,
            supplierHasSubUnit
                ? supplierSubUnitName
                : null,
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );

        setValue(
            `suppliers.${activeSupplierIndex}.unit_to_sub_unit_quantity`,
            supplierBuyingUnitQuantity === ""
                ? null
                : Number(
                      supplierBuyingUnitQuantity
                  ),
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );

        setValue(
            `suppliers.${activeSupplierIndex}.sub_unit_to_base_quantity`,
            supplierHasSubUnit
                ? supplierSubUnitQuantity === ""
                    ? null
                    : Number(
                          supplierSubUnitQuantity
                      )
                : null,
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );

        setValue(
            `suppliers.${activeSupplierIndex}.net_quantity`,
            supplierNetQuantity === ""
                ? null
                : Number(supplierNetQuantity),
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );

        setCustomUnitOpen(false);
    }

    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(async (values) => {
                    const payload = {
                        ...values,
                        cost_per_unit:
                            Number.isFinite(
                                costPerUnitValue
                            )
                                ? Number(
                                      costPerUnitValue
                                  )
                                : null,
                    };

                    await onSubmit(payload, form);
                })}
                className="space-y-6"
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <Link
                            href="/ingredients"
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back to Inventory Setup
                        </Link>

                        <h1 className="text-2xl font-semibold">
                            {mode === "edit"
                                ? "Edit Ingredient"
                                : "Create Ingredient"}
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            Add ingredient details, supplier prices, and location inventory configuration.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            nativeButton={false}
                            render={
                                <Link href="/ingredients">
                                    Cancel
                                </Link>
                            }
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={isSubmitting}>
                            {mode === "edit"
                                ? "Update Ingredient"
                                : "Save Ingredient"}
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>General Information</CardTitle>
                        <CardDescription>Basic identity and stock unit settings.</CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                            <Label>Ingredient Type</Label>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="radio"
                                        value="ingredient"
                                        checked={watch("ingredient_type") === "ingredient"}
                                        onChange={() =>
                                            setValue("ingredient_type", "ingredient", {
                                                shouldDirty: true,
                                                shouldValidate: true,
                                            })
                                        }
                                    />
                                    Ingredient
                                </label>

                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="radio"
                                        value="sub_recipe"
                                        checked={watch("ingredient_type") === "sub_recipe"}
                                        onChange={() =>
                                            setValue("ingredient_type", "sub_recipe", {
                                                shouldDirty: true,
                                                shouldValidate: true,
                                            })
                                        }
                                    />
                                    Sub Recipe
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input placeholder="e.g. Chicken" {...register("name")} />
                            <p className="text-sm text-destructive">{errors.name?.message}</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Code / SKU</Label>
                            <Input placeholder="e.g. 10031" {...register("sku")} />
                            <p className="text-sm text-destructive">{errors.sku?.message}</p>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label>Description</Label>
                            <Textarea rows={3} placeholder="Short ingredient description" {...register("description")} />
                        </div>

                        <div className="space-y-2">
                            <Label>Category</Label>
                            <select
                                className="w-full rounded-md border px-3 py-2 text-sm"
                                {...register("category_id")}
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-sm text-destructive">{errors.category_id?.message}</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Measurement Unit</Label>
                            <select
                                className="w-full rounded-md border px-3 py-2 text-sm"
                                {...register("measurement_unit_id")}
                            >
                                <option value="">Select Measurement Unit</option>
                                {measurementUnits.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-sm text-destructive">{errors.measurement_unit_id?.message}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Purchasing Details</CardTitle>
                        <CardDescription>Define buying unit and conversion values.</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Buying Unit</Label>
                                <Input
                                    placeholder="e.g. Bag"
                                    {...register("buying_unit_name")}
                                />
                                <p className="text-sm text-destructive">
                                    {errors.buying_unit_name?.message}
                                </p>
                            </div>

                            <label className="mt-8 flex items-center gap-2 text-sm">
                                <Checkbox
                                    checked={watch("has_sub_unit")}
                                    onCheckedChange={(checked) =>
                                        setValue("has_sub_unit", checked === true, {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        })
                                    }
                                />
                                Has Sub Unit
                            </label>

                            {hasSubUnit && (
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Buying Sub Unit</Label>
                                    <Input
                                        placeholder="e.g. Bottle, Slice"
                                        {...register(
                                            "sub_unit_name"
                                        )}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="rounded-md border bg-muted/20 p-4 md:p-5">
                            <div className="grid gap-4 md:grid-cols-12 md:items-center">
                                <p className="text-sm md:col-span-4">
                                    1 {resolvedBuyingUnitName} =
                                </p>

                                <div className="space-y-2 md:col-span-4">
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.0001"
                                        placeholder="1"
                                        {...register("buying_unit_quantity")}
                                    />
                                    <p className="text-sm text-destructive">
                                        {errors.buying_unit_quantity?.message}
                                    </p>
                                </div>

                                <p className="text-sm text-muted-foreground md:col-span-4">
                                    {hasSubUnit
                                        ? resolvedBuyingSubUnitName
                                        : selectedMeasurementUnitName}
                                </p>
                            </div>

                            {hasSubUnit && (
                                <>
                                    <div className="mt-4 grid gap-4 md:grid-cols-12 md:items-center">
                                        <p className="text-sm md:col-span-4">
                                            1 {resolvedBuyingSubUnitName} =
                                        </p>

                                        <div className="space-y-2 md:col-span-4">
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.0001"
                                                placeholder="0.0000"
                                                {...register(
                                                    "sub_unit_to_base_quantity"
                                                )}
                                            />
                                        </div>

                                        <p className="text-sm text-muted-foreground md:col-span-4">
                                            {selectedMeasurementUnitName}
                                        </p>
                                    </div>

                                    <p className="mt-5 text-lg font-medium text-muted-foreground">
                                        1 {resolvedBuyingUnitName} = {formatQty(buyingUnitQuantity)} {resolvedBuyingSubUnitName} = {formatQty(totalBaseQuantity)} {selectedMeasurementUnitName}
                                    </p>
                                </>
                            )}

                            <div className="my-4 border-t" />

                            <div className="grid gap-4 md:grid-cols-12 md:items-center">
                                <div className="md:col-span-4">
                                    <Label>Net {selectedMeasurementUnitName}</Label>
                                </div>

                                <div className="space-y-2 md:col-span-4">
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.0001"
                                        placeholder="0.0000"
                                        {...register("net_quantity")}
                                    />
                                    <p className="text-sm text-destructive">
                                        {errors.net_quantity?.message}
                                    </p>
                                </div>

                                <p className="text-sm text-muted-foreground md:col-span-4">
                                    {selectedMeasurementUnitName}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Last Buying Price</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.0001"
                                    placeholder="0.0000"
                                    {...register("last_buying_price")}
                                />
                                <p className="text-sm text-destructive">
                                    {errors.last_buying_price?.message}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>
                                    Cost Per Unit
                                </Label>

                                <div className="flex h-10 items-center rounded-md border bg-muted/20 px-3 text-sm font-medium">
                                    {Number.isFinite(
                                        costPerUnitValue
                                    )
                                        ? `${formatCost(costPerUnitValue)} QAR`
                                        : "-"}
                                </div>

                                <p className="text-xs text-muted-foreground">
                                                                        {shouldLockForNegativeOpening
                                        ? "Opening balance is negative, so cost per unit stays on backend value"
                                                                                : mode === "create" &&
                                                                                    hasNegativeOpeningBalance
                                                                                ? "Opening balance is negative; calculation uses opening balance as 0"
                                        : Number.isFinite(
                                        calculatedCostPerUnit
                                    )
                                        ? "Cost Per Unit = (Opening balance value + Total purchase amount) / Closing balance"
                                        : Number.isFinite(
                                              backendCostPerUnit
                                          )
                                        ? "Using backend cost per unit"
                                        : "Enter supplier price and quantities to calculate"}
                                </p>
                            </div>

                            <label className="mt-8 flex items-center gap-2 text-sm">
                                <Checkbox
                                    checked={watch("is_active")}
                                    onCheckedChange={(checked) =>
                                        setValue("is_active", checked === true, {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        })
                                    }
                                />
                                Active ingredient
                            </label>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Suppliers</CardTitle>
                            <CardDescription>Add supplier price and preferred vendor.</CardDescription>
                        </div>

                        <Button type="button" variant="outline" onClick={addSupplierRow}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Supplier
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        {supplierFields.fields.length === 0 && (
                            <p className="text-sm text-muted-foreground">No suppliers added yet.</p>
                        )}

                        {supplierFields.fields.map((field, index) => {
                            const supplierId = suppliersValue[index]?.supplier_id;

                            return (
                                <div key={field.id} className="grid gap-3 rounded-md border p-3 md:grid-cols-12">
                                    <div className="space-y-2 md:col-span-4">
                                        <Label>Supplier</Label>
                                        <select
                                            className="w-full rounded-md border px-3 py-2 text-sm"
                                            {...register(`suppliers.${index}.supplier_id`)}
                                        >
                                            <option value="">Select Supplier</option>
                                            {suppliers.map((supplier) => (
                                                <option key={supplier.id} value={supplier.id}>
                                                    {supplier.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-sm text-destructive">
                                            {errors.suppliers?.[index]?.supplier_id?.message}
                                        </p>
                                    </div>

                                    <div className="space-y-2 md:col-span-3">
                                        <Label>Price</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.0001"
                                            {...register(`suppliers.${index}.price`)}
                                        />
                                        <p className="text-sm text-destructive">
                                            {errors.suppliers?.[index]?.price?.message}
                                        </p>
                                    </div>

                                    <div className="space-y-2 md:col-span-3">
                                        <Label>Buying Unit</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            onClick={() =>
                                                openCustomUnitDialog(
                                                    index
                                                )
                                            }
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add custom unit
                                        </Button>
                                        <p className="text-sm text-muted-foreground">
                                            {suppliersValue[
                                                index
                                            ]?.buying_unit ||
                                                "No unit selected"}
                                        </p>
                                    </div>

                                    <div className="flex items-end gap-2 md:col-span-2">
                                        <label className="flex items-center gap-2 text-sm">
                                            <Checkbox
                                                checked={Boolean(suppliersValue[index]?.is_default)}
                                                onCheckedChange={() => setDefaultSupplier(index)}
                                                disabled={!supplierId}
                                            />
                                            Default
                                        </label>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => supplierFields.remove(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Inventory by Location</CardTitle>
                        <CardDescription>Set opening stock and reorder level for each location.</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        {locationsValue.map((row, index) => {
                            const location = locations.find(
                                (item) => Number(item.id) === Number(row.location_id)
                            );

                            return (
                                <div key={index} className="grid gap-3 rounded-md border p-3 md:grid-cols-12">
                                    <div className="space-y-2 md:col-span-4">
                                        <Label>Location</Label>
                                        <Input value={location?.name ?? "Unknown location"} disabled />
                                    </div>

                                    <div className="space-y-2 md:col-span-3">
                                        <Label>Opening Balance</Label>
                                        <Input
                                            type="number"
                                            step="0.0001"
                                            {...register(`locations.${index}.opening_balance`)}
                                        />
                                        <p className="text-sm text-destructive">
                                            {errors.locations?.[index]?.opening_balance?.message}
                                        </p>
                                    </div>

                                    <div className="space-y-2 md:col-span-3">
                                        <Label>Reorder Level</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.0001"
                                            {...register(`locations.${index}.reorder_level`)}
                                        />
                                        <p className="text-sm text-destructive">
                                            {errors.locations?.[index]?.reorder_level?.message}
                                        </p>
                                    </div>

                                    <div className="flex items-end md:col-span-2">
                                        <label className="flex items-center gap-2 text-sm">
                                            <Checkbox
                                                checked={Boolean(locationsValue[index]?.track_inventory)}
                                                onCheckedChange={(checked) =>
                                                    setValue(
                                                        `locations.${index}.track_inventory`,
                                                        checked === true,
                                                        {
                                                            shouldDirty: true,
                                                            shouldValidate: true,
                                                        }
                                                    )
                                                }
                                            />
                                            Track
                                        </label>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {errors.root?.message && (
                    <p className="text-sm text-destructive">{errors.root.message}</p>
                )}

                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        nativeButton={false}
                        render={
                            <Link href="/ingredients">
                                Cancel
                            </Link>
                        }
                    >
                        Cancel
                    </Button>

                    <Button type="submit" disabled={isSubmitting}>
                        {mode === "edit"
                            ? "Update Ingredient"
                            : "Save Ingredient"}
                    </Button>
                </div>
            </form>

            <Dialog
                open={customUnitOpen}
                onOpenChange={setCustomUnitOpen}
            >
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            Supplier Buying Unit
                        </DialogTitle>
                        <DialogDescription>
                            Configure custom buying unit for this supplier.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Buying Unit</Label>
                                <Input
                                    placeholder="e.g. Box"
                                    value={supplierBuyingUnitName}
                                    onChange={(event) =>
                                        setSupplierBuyingUnitName(
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <label className="mt-8 flex items-center gap-2 text-sm">
                                <Checkbox
                                    checked={supplierHasSubUnit}
                                    onCheckedChange={(checked) =>
                                        setSupplierHasSubUnit(
                                            checked === true
                                        )
                                    }
                                />
                                Has sub-unit
                            </label>

                            {supplierHasSubUnit && (
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Buying Sub Unit</Label>
                                    <Input
                                        placeholder="e.g. Bottle"
                                        value={supplierSubUnitName}
                                        onChange={(event) =>
                                            setSupplierSubUnitName(
                                                event.target.value
                                            )
                                        }
                                    />
                                </div>
                            )}
                        </div>

                        <div className="rounded-md border bg-muted/20 p-4">
                            <div className="grid gap-4 md:grid-cols-12 md:items-center">
                                <p className="text-sm md:col-span-4">
                                    1 {supplierBuyingUnitName || "Buying Unit"} =
                                </p>
                                <div className="md:col-span-4">
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.0001"
                                        value={supplierBuyingUnitQuantity}
                                        onChange={(event) =>
                                            setSupplierBuyingUnitQuantity(
                                                event.target.value
                                            )
                                        }
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground md:col-span-4">
                                    {supplierHasSubUnit
                                        ? supplierSubUnitName ||
                                          "Sub Unit"
                                        : selectedMeasurementUnitName}
                                </p>
                            </div>

                            {supplierHasSubUnit && (
                                <>
                                    <div className="mt-4 grid gap-4 md:grid-cols-12 md:items-center">
                                        <p className="text-sm md:col-span-4">
                                            1 {supplierSubUnitName || "Sub Unit"} =
                                        </p>
                                        <div className="md:col-span-4">
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.0001"
                                                value={supplierSubUnitQuantity}
                                                onChange={(event) =>
                                                    setSupplierSubUnitQuantity(
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <p className="text-sm text-muted-foreground md:col-span-4">
                                            {selectedMeasurementUnitName}
                                        </p>
                                    </div>

                                    <p className="mt-4 text-base text-muted-foreground">
                                        1 {supplierBuyingUnitName || "Buying Unit"} = {formatQty(supplierUnitToSubUnit)} {supplierSubUnitName || "Sub Unit"} = {formatQty(supplierTotalBase)} {selectedMeasurementUnitName}
                                    </p>
                                </>
                            )}

                            <div className="my-4 border-t" />

                            <div className="grid gap-4 md:grid-cols-12 md:items-center">
                                <p className="text-sm md:col-span-4">
                                    Net {selectedMeasurementUnitName}
                                </p>
                                <div className="md:col-span-4">
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.0001"
                                        value={supplierNetQuantity}
                                        onChange={(event) =>
                                            setSupplierNetQuantity(
                                                event.target.value
                                            )
                                        }
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground md:col-span-4">
                                    {selectedMeasurementUnitName}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={clearCustomUnit}
                            >
                                Delete
                            </Button>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setCustomUnitOpen(
                                            false
                                        )
                                    }
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="button"
                                    onClick={saveCustomUnit}
                                >
                                    Add
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </FormProvider>
    );
}
