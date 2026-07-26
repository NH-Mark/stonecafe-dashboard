"use client";

import { Category } from "@/types/category";
import { MenuItem } from "@/types/menu-item";
import { useEffect, useState } from "react";
import { getCategories } from "../category.service";
import CategorySidebar from "./category/CategorySidebar";
import MenuItemsTable from "./menu-item/MenuItemsTable";
import { getMenuItems } from "../menu.service";



export default function MenuManagement() {

    const [categories, setCategories] =
        useState<Category[]>([]);

    const [items, setItems] =
        useState<MenuItem[]>([]);

    const [selectedCategory, setSelectedCategory] =
        useState<number | null>(null);

    async function loadCategories() {

        const response =
            await getCategories();

        setCategories(
            response.data.data ?? response.data
        );

    }

    async function loadItems() {

        const response =
            await getMenuItems(selectedCategory);

        setItems(
            response.data.data ?? response.data
        );

    }

    useEffect(() => {

        loadCategories();

    }, []);

    useEffect(() => {

        loadItems();

    }, [selectedCategory]);

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

                    items={items}

                    categories={categories}

                    selectedCategory={selectedCategory}

                    onSuccess={loadItems}

                />

            </div>

        </div>

    );

}