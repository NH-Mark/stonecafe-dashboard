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

import {
    List,
    ShoppingCart,
} from "lucide-react";

import { POSNav } from "./components/POSNav";

export function WalkInPOS() {
    const [categories, setCategories] =
        useState<any[]>([]);

    const [
        selectedCategory,
        setSelectedCategory,
    ] = useState<number | null>(null);

    const [
        showCategories,
        setShowCategories,
    ] = useState(false);

    const [
        showCart,
        setShowCart,
    ] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Takeaway order ID
    |--------------------------------------------------------------------------
    */

    const [
        takeawayOrderId,
        setTakeawayOrderId,
    ] = useState<string | null>(null);

    /*
    |--------------------------------------------------------------------------
    | Store
    |--------------------------------------------------------------------------
    */

    const cart = useOrderStore(
        state => state.cart
    );

    const activeOrderId = useOrderStore(
        state => state.activeOrderId
    );

    const activeOrderNo = useOrderStore(
        state => state.activeOrderNo
    );

    const initializeOrder = useOrderStore(
        state => state.initializeOrder
    );

    const setActiveOrder = useOrderStore(
        state => state.setActiveOrder
    );

    const setActiveOrderNo = useOrderStore(
        state => state.setActiveOrderNo
    );

    /*
    |--------------------------------------------------------------------------
    | Create dedicated takeaway order
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (takeawayOrderId) {
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | IMPORTANT:
        | Do not reuse activeOrderId here.
        | Takeaway must have its own order.
        |--------------------------------------------------------------------------
        */

        const newOrderId =
            `new-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`;

        /*
        |--------------------------------------------------------------------------
        | Initialize takeaway order
        |--------------------------------------------------------------------------
        */

        initializeOrder(
            newOrderId,
            {
                id: newOrderId,
                orderNo: null,
                cart: [],
                orderNote: "",
                orderDiscount: null,
                status: "draft",
                isNew: true,
                savedLineIds: [],
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Save local takeaway ID
        |--------------------------------------------------------------------------
        */

        setTakeawayOrderId(
            newOrderId
        );

        /*
        |--------------------------------------------------------------------------
        | Make takeaway order active
        |--------------------------------------------------------------------------
        */

        setActiveOrder(
            newOrderId
        );
    }, [
        takeawayOrderId,
        initializeOrder,
        setActiveOrder,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Keep takeaway order active
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!takeawayOrderId) {
            return;
        }

        if (
            activeOrderId !==
            takeawayOrderId
        ) {
            setActiveOrder(
                takeawayOrderId
            );
        }
    }, [
        takeawayOrderId,
        activeOrderId,
        setActiveOrder,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Categories
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            const response =
                await getCategories();

            setCategories(
                response.data.data
            );
        } catch (error) {
            console.error(
                "Failed to load categories:",
                error
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Order saved
    |--------------------------------------------------------------------------
    */

    function handleOrderSaved(
        newOrderId: string,
        newOrderNo?: string | null
    ) {
        setTakeawayOrderId(
            newOrderId
        );

        setActiveOrder(
            newOrderId
        );
         console.log("newOrderNo");
        console.log(newOrderNo);
        if (newOrderNo) {
            setActiveOrderNo(
                newOrderNo
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Cart summary
    |--------------------------------------------------------------------------
    */

    const orderItemCount =
        cart.reduce(
            (total, item) =>
                total +
                item.quantity,
            0
        );

    const orderTotal =
        cart.reduce(
            (total, item) =>
                total +
                getLineTotal(item),
            0
        );

    return (
        <div
            className="
                flex
                h-dvh
                flex-col
                bg-slate-100
            "
        >
            <Header />

            <POSNav />

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
                        gap-3
                        overflow-hidden
                        lg:grid-cols-12
                    "
                >
                    {/* Categories */}

                    <aside
                        className="
                            hidden
                            min-h-0
                            lg:col-span-2
                            lg:block
                        "
                    >
                        <CategorySidebar
                            categories={
                                categories
                            }
                            selectedCategory={
                                selectedCategory
                            }
                            onSelectCategory={
                                setSelectedCategory
                            }
                        />
                    </aside>

                    {/* Menu */}

                    <section
                        className="
                            min-h-0
                            overflow-hidden
                            lg:col-span-7
                        "
                    >
                        <MenuGrid
                            categoryId={
                                selectedCategory
                            }
                        />
                    </section>

                    {/* Takeaway Cart */}

                    <aside
                        className="
                            hidden
                            min-h-0
                            lg:col-span-3
                            lg:block
                        "
                    >
                        {takeawayOrderId && (
                            <OrderCart
                                orderId={
                                    takeawayOrderId
                                }
                                activeOrderNo={
                                    activeOrderNo ??
                                    takeawayOrderId
                                }
                                mode="takeaway"
                                onOrderSaved={
                                    handleOrderSaved
                                }
                            />
                        )}
                    </aside>
                </div>
            </main>

            {/* Mobile actions */}

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
                    onClick={() =>
                        setShowCategories(
                            true
                        )
                    }
                >
                    <List
                        className="
                            mr-2
                            h-5
                            w-5
                        "
                    />

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
                    onClick={() =>
                        setShowCart(
                            true
                        )
                    }
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

                    {orderItemCount > 0 &&
                        ` (${orderItemCount})`}

                    {orderItemCount > 0 && (
                        <span
                            className="
                                ml-auto
                                text-sm
                                opacity-90
                            "
                        >
                            {orderTotal.toFixed(
                                2
                            )}{" "}
                            QAR
                        </span>
                    )}
                </Button>
            </div>

            {/* Category drawer */}

            {showCategories && (
                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        bg-black/40
                        backdrop-blur-sm
                    "
                    onClick={() =>
                        setShowCategories(
                            false
                        )
                    }
                >
                    <div
                        className="
                            h-full
                            w-80
                            bg-white
                            p-3
                            shadow-xl
                        "
                        onClick={e =>
                            e.stopPropagation()
                        }
                    >
                        <CategorySidebar
                            categories={
                                categories
                            }
                            selectedCategory={
                                selectedCategory
                            }
                            onSelectCategory={
                                setSelectedCategory
                            }
                        />
                    </div>
                </div>
            )}

            {/* Cart drawer */}

            {showCart && (
                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        bg-black/40
                        backdrop-blur-sm
                    "
                    onClick={() =>
                        setShowCart(
                            false
                        )
                    }
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
                        onClick={e =>
                            e.stopPropagation()
                        }
                    >
                        {takeawayOrderId && (
                            <OrderCart
                                orderId={
                                    takeawayOrderId
                                }
                                activeOrderNo={
                                    activeOrderNo ??
                                    undefined
                                }
                                mode="takeaway"
                                onOrderSaved={
                                    handleOrderSaved
                                }
                            />
                        )}
                    </div>
                </div>
            )}

            <ModifierDialog />
        </div>
    );
}