"use client";

import { useEffect, useState } from "react";

import { CategorySidebar } from "./components/CategorySidebar";
import { Header } from "./components/Header";
import { MenuGrid } from "./components/MenuGrid";
import { OrderCart } from "./components/OrderCart";

import { getActiveMenuCategories, getCategories } from "../menu/category.service";

import { ModifierDialog } from "./components/modifier-dialog/ModifierDialog";

import { Button } from "@/components/ui/button";

import { OrderDiscount, useOrderStore } from "./store/useOrderStore";

import { getLineTotal } from "./utils/cart-price";

import {
    List,
    ShoppingCart,
} from "lucide-react";

import { POSNav } from "./components/POSNav";
import { useOrderKitchenSync } from "./hooks/useOrderKitchenSync";
import { useSearchParams } from "next/navigation";
import { getOrder } from "./orders.service";
import { MenuItem } from "@/types/menu-item";
import { listMenuItems } from "../menu/menu.service";
import { CartItem } from "./cart.types";

export function WalkInPOS() {
    useOrderKitchenSync();

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

    const searchParams = useSearchParams();
    const requestedOrderId = searchParams.get("orderId");

    const [cartOrderId, setCartOrderId] =
        useState<string | null>(null);

    const [loadingRequestedOrder, setLoadingRequestedOrder] =
        useState(false);
    const displayedOrderId = cartOrderId ?? takeawayOrderId;
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
        const targetOrderId = cartOrderId ?? takeawayOrderId;

        if (targetOrderId && activeOrderId !== targetOrderId) {
            setActiveOrder(targetOrderId);
        }
    }, [
        cartOrderId,
        takeawayOrderId,
        activeOrderId,
        setActiveOrder,
    ]);


    useEffect(() => {
        if (!requestedOrderId) {
            setCartOrderId(null);
            return;
        }

        let cancelled = false;


        async function loadRequestedOrder() {
            try {
                setLoadingRequestedOrder(true);

                // Fetch the order and the full menu catalogue.
                const [orderResponse, menuResponse] = await Promise.all([
                    getOrder(Number(requestedOrderId)),
                    listMenuItems(),
                ]);

                if (cancelled) return;

                // Support APIs that return either { data: [...] } or { data: { data: [...] } }.
                const order: any =
                    (orderResponse as any).data?.data ??
                    (orderResponse as any).data ??
                    orderResponse;

                const menuItems: MenuItem[] =
                    (menuResponse as any).data?.data ??
                    (menuResponse as any).data ??
                    [];

                console.log("Loaded menu items:", menuItems);
                console.log("Loaded order:", order);


                const cartItems: CartItem[] = (order.items ?? []).map((item: any) => {
                    const menuItem = menuItems.find(
                        (menu) => Number(menu.id) === Number(item.menu_item_id)
                    );

                    if (!menuItem) {
                        throw new Error(
                            `Menu item "${item.menu_item}" (ID: ${item.menu_item_id}) was not found.`
                        );
                    }

                    const modifiers = (item.modifiers ?? []).map((modifier: any) => {
                        const group = menuItem.modifier_groups?.find((g: any) =>
                            g.modifiers?.some(
                                (m: any) => Number(m.id) === Number(modifier.id)
                            )
                        );

                        return {
                            id: Number(modifier.id),
                            groupId: group?.id ?? 0,
                            groupName: group?.name ?? "",
                            name: modifier.modifier,
                            price: Number(modifier.price ?? 0),
                        };
                    });

                    // Backend may return discounts as an array.
                    const itemDiscounts = Array.isArray(item.discounts)
                        ? item.discounts
                        : item.discounts
                            ? [item.discounts]
                            : [];

                    // Adapt this mapping to the actual Discount type used by your cart.
                    const discount = itemDiscounts.length > 0
                        ? {
                            ...itemDiscounts[0],
                            id: Number(itemDiscounts[0].id),
                        }
                        : null;

                    return {
                        lineId: `order-item-${item.id}`,
                        orderItemId: Number(item.id),
                        menuItem,
                        quantity: Number(item.quantity ?? 1),
                        modifiers,
                        note: item.notes ?? "",
                        discount,
                        saved: true,
                    };
                });

                const id = String(order.id);
                const backendOrderDiscount = order.discounts?.[0];

                const orderDiscount: OrderDiscount | null = backendOrderDiscount
                    ? {
                        id: Number(backendOrderDiscount.id),
                        name: backendOrderDiscount.name,
                        type: backendOrderDiscount.type,
                        value: Number(backendOrderDiscount.value),
                    }
                    : null;

                initializeOrder(id, {
                    id,
                    orderNo: order.order_no ?? null,
                    cart: cartItems,
                    orderNote: order.notes ?? "",
                    orderDiscount,
                    status: order.status as
                        | "draft"
                        | "pending"
                        | "confirmed"
                        | "completed"
                        | "cancelled",
                    isNew: false,
                    savedLineIds: cartItems.map((item: CartItem) => item.lineId),
                    syncStatus: "synced",
                });

                setActiveOrder(id);
                setActiveOrderNo(order.order_no ?? "");
                setCartOrderId(id);
                // setShowCart(true);
            } catch (error) {
                if (!cancelled) {
                    console.error("Failed to load existing order:", error);
                }
            } finally {
                if (!cancelled) {
                    setLoadingRequestedOrder(false);
                }
            }
        }

        // Wait for categories/menu items before mapping backend items.
        // if (categories.length > 0) {
        void loadRequestedOrder();
        // }

        return () => {
            cancelled = true;
        };
    }, [
        requestedOrderId,
        initializeOrder,
        setActiveOrder,
        setActiveOrderNo,
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
                await getActiveMenuCategories();

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
        const savedId = String(newOrderId);

        if (cartOrderId) {
            setCartOrderId(savedId);
        } else {
            setTakeawayOrderId(savedId);
        }

        setActiveOrder(savedId);

        if (newOrderNo) {
            setActiveOrderNo(newOrderNo);
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
                h-full
                min-h-0
                flex-col
                overflow-hidden
                bg-slate-100
            "
        >
            <header className="shrink-0">
                <Header />
            </header>

            {/* ================================================= */}
            {/* POS NAVIGATION */}
            {/* ================================================= */}

            <nav className="shrink-0">
                <POSNav />
            </nav>

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

                        {displayedOrderId && (
                            <OrderCart
                                key={displayedOrderId}
                                orderId={displayedOrderId}
                                activeOrderNo={activeOrderNo ?? undefined}
                                mode="takeaway"
                                onOrderSaved={handleOrderSaved}
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
                        {displayedOrderId && (
                            <OrderCart
                                key={displayedOrderId}
                                orderId={displayedOrderId}
                                activeOrderNo={activeOrderNo ?? undefined}
                                mode="takeaway"
                                onOrderSaved={handleOrderSaved}
                            />
                        )}
                    </div>
                </div>
            )}

            <ModifierDialog />
        </div>
    );
}