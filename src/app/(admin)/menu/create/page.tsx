"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import MenuItemForm from "@/features/menu/pages/MenuItemForm";
import { createMenuItem } from "@/features/menu/menu.service";
import PageLoader from "@/components/common/PageLoader";

import { getCategories } from "@/features/menu/category.service";
import { getModifierGroups } from "@/features/modifiers/modifier.service";
import { getMenuItemTags } from "@/features/menu-item-tag/menu-item-tag.service";
import { getFoodSymbols } from "@/features/food-symbol/food-symbol.service";
import { applyApiErrors } from "@/lib/form-errors";
import { getIngredients } from "@/features/inventory-ingredients/ingredient.service";

export default function NewMenuItemPage() {

    const router = useRouter();

    const [loading, setLoading] = useState(true);

    const [categories, setCategories] = useState([]);
    const [modifierGroups, setModifierGroups] = useState([]);
    const [tags, setTags] = useState([]);
    const [foodSymbols, setFoodSymbols] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    async function load() {
        try {

            setLoading(true);

            const [
                categoryRes,
                groupRes,
                tagRes,
                foodRes,
                ingredientRes,
            ] = await Promise.all([
                getCategories(),
                getModifierGroups(),
                getMenuItemTags(),
                getFoodSymbols(),
                getIngredients({ per_page: 1000 }),
            ]);

            setCategories(categoryRes.data.data);
            setModifierGroups(groupRes.data.data);
            setTags(tagRes.data.data);
            setFoodSymbols(foodRes.data.data);
            setIngredients(ingredientRes.data.data ?? []);

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleSubmit(values: any,form:any) {
        try {
            await createMenuItem(values);

            toast.success("Menu item created successfully.");

            router.push("/menu");
            router.refresh();
        
        } catch (error) {

        applyApiErrors(
            form,
            error
        );
        toast.error(
            (error as any)?.message ?? "Failed to create staff."
        );

    }


}

if (loading) {
    return <PageLoader />;
}

return (
    <MenuItemForm
        mode="create"
        categories={categories}
        allModifierGroups={modifierGroups}
        allTags={tags}
        foodSymbols={foodSymbols}
        allIngredients={ingredients}
        onSubmit={handleSubmit}
    />
);
}