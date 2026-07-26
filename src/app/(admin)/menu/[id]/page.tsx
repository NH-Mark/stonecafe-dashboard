"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

import MenuItemForm from "@/features/menu/pages/MenuItemForm";
import { getMenuItem, updateMenuItem } from "@/features/menu/menu.service";
import PageLoader from "@/components/common/PageLoader";

import { getCategories } from "@/features/menu/category.service";
import { getModifierGroups } from "@/features/modifiers/modifier.service";
import { getMenuItemTags } from "@/features/menu-item-tag/menu-item-tag.service";
import { getFoodSymbols } from "@/features/food-symbol/food-symbol.service";
import { MenuItem } from "@/types/menu-item";
import { applyApiErrors } from "@/lib/form-errors";


export default function EditMenuItemPage() {

    const router = useRouter();
    const params = useParams();

    const id = Number(params.id);

    const [loading, setLoading] = useState(true);

    const [categories, setCategories] = useState([]);
    const [modifierGroups, setModifierGroups] = useState([]);
    const [tags, setTags] = useState([]);
    const [foodSymbols, setFoodSymbols] = useState([]);
    const [menuItem, setMenuItem] = useState<MenuItem | undefined>();

    async function load() {
        try {

            setLoading(true);

            const [
                itemRes,
                categoryRes,
                groupRes,
                tagRes,
                foodRes
            ] = await Promise.all([
                getMenuItem(id),
                getCategories(),
                getModifierGroups(),
                getMenuItemTags(),
                getFoodSymbols(),
            ]);


            setCategories(categoryRes.data.data);
            setModifierGroups(groupRes.data.data);
            setTags(tagRes.data.data);
            setFoodSymbols(foodRes.data.data);
            setMenuItem(itemRes.data.data);

        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        load();
    }, []);


    async function handleSubmit(values: any,form:any) {
        try {
            await updateMenuItem(id, values);

            toast.success("Menu item updated successfully.");

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
            mode="edit"
            menuItem={menuItem}
            categories={categories}
            allModifierGroups={modifierGroups}
            allTags={tags}
            foodSymbols={foodSymbols}
            onSubmit={handleSubmit}
        />
    );
}