// features/walk-in/WalkInPOS.tsx
"use client";

import { useEffect, useState } from "react";
import { CategorySidebar } from "./components/CategorySidebar";
import { Header } from "./components/Header";
import { MenuGrid } from "./components/MenuGrid";
import { OrderCart } from "./components/OrderCart";
import { getCategories } from "../menu/category.service";
import { ModifierDialog } from "./components/modifier-dialog/ModifierDialog";


export function WalkInPOS() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    useEffect(() => {

        loadCategories();

    }, []);

    async function loadCategories() {

        try {

            const response = await getCategories();

            setCategories(response.data.data);

        } catch (error) {

            console.error(error);

        }

    }

    return (
            <div className="flex h-screen flex-col bg-slate-100">
                <Header />
                <main className="flex-1 min-h-0 overflow-hidden p-4">
                    <div
                        className="
                            grid
                            h-full
                            min-h-0
                            grid-cols-12
                            gap-4
                            overflow-hidden
                        "
>
                        <aside className="col-span-2 min-h-0">
                            <CategorySidebar
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onSelectCategory={setSelectedCategory}
                            />
                        </aside>
                        <section className="col-span-7 min-h-0">
                            <MenuGrid
                                categoryId={selectedCategory}
                            />
                        </section>
                        <aside className="col-span-3 min-h-0">
                            <OrderCart />
                        </aside>
                    </div>
                </main>
                <ModifierDialog />
            </div>
    );
}