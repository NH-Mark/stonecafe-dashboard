"use client";

import { Category } from "@/types/category";
import { useEffect, useState } from "react";

import { getCategories } from "../category.service";
import { getMenuItems } from "../menu.service";

import CategorySidebar from "./category/CategorySidebar";
import MenuItemsTable from "./menu-item/MenuItemsTable";

export default function MenuManagement() {
    const [categories, setCategories] =
        useState<Category[]>([]);

    const [selectedCategory, setSelectedCategory] =
        useState<number | null>(null);

    async function loadCategories() {
        const response =
            await getCategories();

        setCategories(
            response.data.data ??
            response.data
        );
    }

    useEffect(() => {
        loadCategories();
    }, []);

    return (
        <div className="grid lg:grid-cols-4 gap-6">

            <div>
                <CategorySidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelect={setSelectedCategory}
                    onRefresh={loadCategories}
                />
            </div>

            <div className="lg:col-span-3">
                <MenuItemsTable
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSuccess={async () => {}}
                />
            </div>

        </div>
    );
}