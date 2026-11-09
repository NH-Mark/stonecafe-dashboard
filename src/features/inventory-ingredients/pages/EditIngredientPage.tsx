"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import PageLoader from "@/components/common/PageLoader";
import { applyApiErrors } from "@/lib/form-errors";

import { getIngredientCategories } from "@/features/inventory-ingredient-categories/ingredient-category.service";
import { getMeasurementUnits } from "@/features/inventory-measurement-units/measurement-unit.service";
import { getSuppliers } from "@/features/inventory-suppliers/supplier.service";
import { getLocationSelectors } from "@/features/locations/location.service";

import { InventoryIngredient } from "@/types/inventory-ingredient";
import { InventoryIngredientCategory } from "@/types/inventory-ingredient-category";
import { InventoryMeasurementUnit } from "@/types/inventory-measurement-unit";
import { InventorySupplier } from "@/types/inventory-supplier";
import { Location } from "@/types/location";

import IngredientForm from "./IngredientForm";
import {
    IngredientFormInput,
    IngredientFormValues,
} from "../ingredient.schema";
import {
    getIngredient,
    updateIngredient,
} from "../ingredient.service";

function normalizeCollection<T>(input: any): T[] {
    const payload = input?.data ?? input;

    if (Array.isArray(payload)) {
        return payload as T[];
    }

    if (Array.isArray(payload?.data)) {
        return payload.data as T[];
    }

    return [];
}

export default function EditIngredientPage() {
    const router = useRouter();
    const params = useParams();

    const id = Number(params.id);

    const [loading, setLoading] = useState(true);
    const [ingredient, setIngredient] =
        useState<InventoryIngredient | null>(null);
    const [categories, setCategories] = useState<InventoryIngredientCategory[]>([]);
    const [measurementUnits, setMeasurementUnits] = useState<InventoryMeasurementUnit[]>([]);
    const [suppliers, setSuppliers] = useState<InventorySupplier[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);

                const [
                    ingredientResponse,
                    categoriesResponse,
                    measurementUnitsResponse,
                    suppliersResponse,
                    locationItems,
                ] = await Promise.all([
                    getIngredient(id),
                    getIngredientCategories({ per_page: 1000 }),
                    getMeasurementUnits({ per_page: 1000 }),
                    getSuppliers({ per_page: 1000 }),
                    getLocationSelectors(),
                ]);

                setIngredient(
                    ingredientResponse?.data?.data ??
                        ingredientResponse?.data
                );

                setCategories(
                    normalizeCollection<InventoryIngredientCategory>(categoriesResponse?.data)
                );

                setMeasurementUnits(
                    normalizeCollection<InventoryMeasurementUnit>(measurementUnitsResponse?.data)
                );

                setSuppliers(
                    normalizeCollection<InventorySupplier>(suppliersResponse?.data)
                );

                setLocations(locationItems ?? []);
            } catch (error) {
                console.error("Failed to load ingredient edit data", error);
                toast.error("Failed to load ingredient details.");
                router.push("/ingredients");
            } finally {
                setLoading(false);
            }
        }

        if (!Number.isFinite(id) || id <= 0) {
            toast.error("Invalid ingredient id.");
            router.push("/ingredients");
            return;
        }

        void loadData();
    }, [id, router]);

    async function handleSubmit(
        values: IngredientFormValues,
        form: UseFormReturn<
            IngredientFormInput,
            unknown,
            IngredientFormValues
        >
    ) {
        try {
            await updateIngredient(id, values);

            toast.success("Ingredient updated successfully.");

            router.push("/ingredients");
            router.refresh();
        } catch (error) {
            applyApiErrors(form, error);

            toast.error(
                (error as any)?.message ??
                    "Failed to update ingredient."
            );
        }
    }

    if (loading || !ingredient) {
        return <PageLoader />;
    }

    return (
        <IngredientForm
            mode="edit"
            ingredient={ingredient}
            categories={categories}
            measurementUnits={measurementUnits}
            suppliers={suppliers}
            locations={locations}
            onSubmit={handleSubmit}
        />
    );
}
