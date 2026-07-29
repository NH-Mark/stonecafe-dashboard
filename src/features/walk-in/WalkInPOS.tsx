"use client";

import { useEffect, useState } from "react";
import { CategorySidebar } from "./components/CategorySidebar";
import { Header } from "./components/Header";
import { MenuGrid } from "./components/MenuGrid";
import { OrderCart } from "./components/OrderCart";
import { getCategories } from "../menu/category.service";
import { ModifierDialog } from "./components/modifier-dialog/ModifierDialog";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "./store/useOrderStore";
import { getLineTotal } from "./utils/cart-price";
import { List, ShoppingCart } from "lucide-react";


export function WalkInPOS() {

    const [categories, setCategories] = useState([]);

    const [selectedCategory, setSelectedCategory] =
        useState<number | null>(null);


    const [showCategories, setShowCategories] =
        useState(false);


    const [showCart, setShowCart] =
        useState(false);


    const cart = useOrderStore(
        state => state.cart
    );


    const orderItemCount = cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );


    const orderTotal = cart.reduce(
        (total, item) =>
            total + getLineTotal(item),
        0
    );



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
                min-h-dvh
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
        pb-20
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
                    fixed
                    bottom-0
                    left-0
                    right-0
                    z-40

                    flex
                    gap-3

                    border-t
                    bg-white/95
                    p-3
                    shadow-lg
                    backdrop-blur

                    lg:hidden
                "
            >

                <Button
                    variant="outline"
                    className="
        h-12
        flex-1
        rounded-2xl
        text-base
        font-semibold
    "
                    onClick={() => setShowCategories(true)}
                >
                    <List className="mr-2 h-5 w-5" />

                    Categories
                </Button>


                <Button
                    className="
        h-12
        flex-1
        rounded-2xl
        text-base
        font-semibold
        shadow-md
    "
                    onClick={() => setShowCart(true)}
                >

                    <ShoppingCart
                        className="
            mr-2
            h-5
            w-5
        "
                    />


                    <span>
                        Order
                    </span>

                    {
                        orderItemCount > 0 && (
                            ` (${orderItemCount})`
                        )
                    }


                    {
                        orderItemCount > 0 && (

                            <span
                                className="
                    ml-auto
                    text-sm
                    opacity-90
                "
                            >
                                {orderTotal.toFixed(2)} QAR
                            </span>

                        )
                    }

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
                            bg-black/40
                            backdrop-blur-sm
                        "
                        onClick={() => setShowCategories(false)}
                    >

                        <div
                            className="
                                h-full
                                w-80
                                bg-white
                                p-3
                                shadow-xl
                            "
                            onClick={(e) => e.stopPropagation()}
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
                                    bg-black/40
                                    backdrop-blur-sm
                                "
                        onClick={() => setShowCart(false)}
                    >

                        <div
                            className="
                                ml-auto
                                h-full
                                w-full
                                max-w-md
                                bg-white
                                p-3
                                shadow-xl
                            "
                            onClick={(e) => e.stopPropagation()}
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