"use client";

import { useEffect, useState } from "react";
import { CategorySidebar } from "./components/CategorySidebar";
import { Header } from "./components/Header";
import { MenuGrid } from "./components/MenuGrid";
import { OrderCart } from "./components/OrderCart";
import { getCategories } from "../menu/category.service";
import { ModifierDialog } from "./components/modifier-dialog/ModifierDialog";
import { Button } from "@/components/ui/button";


export function WalkInPOS() {

    const [categories, setCategories] = useState([]);

    const [selectedCategory, setSelectedCategory] =
        useState<number | null>(null);


    const [showCategories, setShowCategories] =
        useState(false);


    const [showCart, setShowCart] =
        useState(false);



    useEffect(() => {

        loadCategories();

    }, []);



    async function loadCategories() {

        const response = await getCategories();

        setCategories(response.data.data);

    }



    return (

        <div
            className="
                flex
                h-screen
                flex-col
                bg-slate-100
            "
        >


            <Header />



            <main
                className="
                    flex-1
                    min-h-0
                    overflow-hidden
                    p-3
                "
            >


                <div
                    className="
                        grid
                        h-full
                        min-h-0

                        lg:grid-cols-12
                        gap-3
                    "
                >



                    {/* Desktop Categories */}

                    <aside
                        className="
                            hidden
                            lg:block
                            lg:col-span-2
                        "
                    >

                        <CategorySidebar
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                        />

                    </aside>



                    {/* Menu */}

                    <section
                        className="
                            min-h-0

                            lg:col-span-7
                        "
                    >

                        <MenuGrid
                            categoryId={selectedCategory}
                        />

                    </section>



                    {/* Desktop Cart */}

                    <aside
                        className="
                            hidden
                            lg:block
                            lg:col-span-3
                        "
                    >

                        <OrderCart />

                    </aside>


                </div>


            </main>



            {/* Tablet / Mobile Actions */}

            <div
                className="
                    flex
                    gap-3
                    border-t
                    bg-white
                    p-3

                    lg:hidden
                "
            >

                <Button
                    className="flex-1"
                    onClick={() =>
                        setShowCategories(true)
                    }
                >
                    Categories
                </Button>


                <Button
                    className="flex-1"
                    onClick={() =>
                        setShowCart(true)
                    }
                >
                    Order
                </Button>

            </div>



            {/* Category Drawer */}

            {
                showCategories && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-50
                            bg-black/30
                        "
                    >

                        <div
                            className="
                                h-full
                                w-72
                                bg-white
                                p-3
                            "
                        >

                            <CategorySidebar
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onSelectCategory={
                                    setSelectedCategory
                                }
                            />

                        </div>

                    </div>

                )
            }



            {/* Cart Drawer */}

            {
                showCart && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-50
                            bg-black/30
                        "
                    >

                        <div
                            className="
                                ml-auto
                                h-full
                                w-full
                                max-w-md
                                bg-white
                                p-3
                            "
                        >

                            <OrderCart />

                        </div>

                    </div>

                )
            }



            <ModifierDialog />


        </div>

    );

}