"use client";

import {
    useState,
} from "react";

import {
    CategorySidebar,
} from "@/features/walk-in/components/CategorySidebar";

import {
    MenuGrid,
} from "@/features/walk-in/components/MenuGrid";

import {
    OrderCart,
} from "@/features/walk-in/components/OrderCart";

import {
    EmptyActiveOrder,
} from "./EmptyActiveOrder";

import {
    Category,
} from "@/types/category";

import {
    Button,
} from "@/components/ui/button";

import {
    ChevronDown,
    ChevronUp,
    ListFilter,
    ShoppingCart,
    X,
} from "lucide-react";

interface SessionMainLayoutProps {
    sessionId: number;

    categories: Category[];

    selectedCategory:
        number | null;

    onSelectCategory:
        (categoryId: number | null) => void;

    activeOrderId:
        string | null;

    activeOrderNo?:
        string | null;

    onOrderSaved:
        (orderId: string) => void;
}

export function SessionMainLayout({
    sessionId,
    categories,
    selectedCategory,
    onSelectCategory,
    activeOrderId,
    activeOrderNo,
    onOrderSaved,
}: SessionMainLayoutProps) {

    const [
        categoryOpen,
        setCategoryOpen,
    ] = useState(false);

    const [
        orderOpen,
        setOrderOpen,
    ] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Category selection
    |--------------------------------------------------------------------------
    */

    function handleSelectCategory(
        categoryId: number | null
    ) {
        onSelectCategory(
            categoryId
        );

        setCategoryOpen(
            false
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Close drawers
    |--------------------------------------------------------------------------
    */

    function closeDrawers() {
        setCategoryOpen(false);
        setOrderOpen(false);
    }

    return (
        <main
            className="
                relative
                min-h-0
                flex-1
                overflow-hidden
                p-2
                pb-[76px]
                sm:p-3
                sm:pb-[82px]
                lg:pb-3
            "
        >

            {/* ========================================================= */}
            {/* DESKTOP MAIN AREA                                        */}
            {/* ========================================================= */}

            <div
                className="
                    grid
                    h-full
                    min-h-0
                    gap-3

                    lg:grid-cols-12
                "
            >

                {/* ===================================================== */}
                {/* CATEGORIES                                            */}
                {/* ===================================================== */}

                <aside
                    className="
                        hidden
                        min-h-0
                        overflow-hidden

                        lg:col-span-2
                        lg:block
                    "
                >
                    <div
                        className="
                            h-full
                            min-h-0
                            overflow-hidden
                            rounded-2xl
                            border
                            bg-white
                        "
                        style={{
                            borderColor:
                                "#d9d9d8",
                        }}
                    >
                        <CategorySidebar
                            categories={
                                categories
                            }
                            selectedCategory={
                                selectedCategory
                            }
                            onSelectCategory={
                                onSelectCategory
                            }
                        />
                    </div>
                </aside>

                {/* ===================================================== */}
                {/* MENU                                                   */}
                {/* ===================================================== */}

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

                {/* ===================================================== */}
                {/* ORDER CART                                             */}
                {/* ===================================================== */}

                <aside
                    className="
                        hidden
                        min-h-0
                        overflow-hidden

                        lg:col-span-3
                        lg:block
                    "
                >
                    <div
                        className="
                            h-full
                            min-h-0
                            overflow-hidden
                            rounded-2xl
                            border
                            bg-white
                        "
                        style={{
                            borderColor:
                                "#d9d9d8",
                        }}
                    >
                        {activeOrderId ? (
                            <OrderCart
                                orderId={
                                    activeOrderId
                                }

                                activeOrderNo={
                                    activeOrderNo ??
                                    undefined
                                }

                                sessionId={
                                    sessionId
                                }

                                onOrderSaved={
                                    onOrderSaved
                                }
                            />
                        ) : (
                            <EmptyActiveOrder />
                        )}
                    </div>
                </aside>

            </div>

            {/* ========================================================= */}
            {/* TABLET / IPAD FOOTER                                      */}
            {/* ========================================================= */}

            <div
                className="
                    fixed
                    inset-x-0
                    bottom-0
                    z-40

                    border-t
                    bg-white/95

                    px-3
                    pb-[max(10px,env(safe-area-inset-bottom))]
                    pt-2

                    shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
                    backdrop-blur

                    lg:hidden
                "
            >
                <div
                    className="
                        mx-auto
                        flex
                        max-w-2xl
                        items-center
                        gap-2
                    "
                >

                    {/* Categories */}

                    <Button
                        type="button"
                        variant="outline"
                        className="
                            h-12
                            flex-1
                            gap-2
                            rounded-xl
                            font-semibold
                        "
                        onClick={() => {
                            setOrderOpen(false);
                            setCategoryOpen(true);
                        }}
                    >
                        <ListFilter
                            className="
                                h-5
                                w-5
                            "
                        />

                        Categories
                    </Button>

                    {/* Order */}

                    <Button
                        type="button"
                        variant="outline"
                        className="
                            h-12
                            flex-1
                            gap-2
                            rounded-xl
                            font-semibold
                        "
                        disabled={
                            !activeOrderId
                        }
                        onClick={() => {
                            setCategoryOpen(false);
                            setOrderOpen(true);
                        }}
                    >
                        <ShoppingCart
                            className="
                                h-5
                                w-5
                            "
                        />

                        Order
                    </Button>

                </div>
            </div>

            {/* ========================================================= */}
            {/* DRAWER BACKDROP                                           */}
            {/* ========================================================= */}

            {(categoryOpen ||
                orderOpen) && (
                <button
                    type="button"
                    aria-label="Close drawer"
                    className="
                        fixed
                        inset-0
                        z-50
                        bg-black/30
                        backdrop-blur-[1px]
                        lg:hidden
                    "
                    onClick={
                        closeDrawers
                    }
                />
            )}

            {/* ========================================================= */}
            {/* CATEGORY DRAWER                                           */}
            {/* ========================================================= */}

            <div
                className={`
                    fixed
                    inset-y-0
                    left-0
                    z-[60]
                    flex
                    w-[min(85vw,360px)]
                    flex-col
                    bg-white
                    shadow-2xl
                    transition-transform
                    duration-200
                    lg:hidden

                    ${
                        categoryOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        px-5
                        py-4
                    "
                >
                    <div>
                        <p
                            className="
                                text-base
                                font-bold
                            "
                        >
                            Categories
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                text-muted-foreground
                            "
                        >
                            Select a menu category
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="
                            h-10
                            w-10
                            rounded-xl
                        "
                        onClick={() =>
                            setCategoryOpen(
                                false
                            )
                        }
                    >
                        <X
                            className="
                                h-5
                                w-5
                            "
                        />
                    </Button>
                </div>

                <div
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        p-3
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
                            handleSelectCategory
                        }
                    />
                </div>

            </div>

            {/* ========================================================= */}
            {/* ORDER DRAWER                                              */}
            {/* ========================================================= */}

            <div
                className={`
                    fixed
                    inset-y-0
                    right-0
                    z-[60]
                    flex
                    w-full
                    max-w-md
                    flex-col
                    bg-white
                    shadow-2xl
                    transition-transform
                    duration-200
                    lg:hidden

                    ${
                        orderOpen &&
                        activeOrderId
                            ? "translate-x-0"
                            : "translate-x-full"
                    }
                `}
            >

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        px-5
                        py-4
                    "
                >
                    <div>
                        <p
                            className="
                                text-base
                                font-bold
                            "
                        >
                            {activeOrderNo
                                ? `Order #${activeOrderNo}`
                                : "Current Order"}
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                text-muted-foreground
                            "
                        >
                            Review and manage your order
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="
                            h-10
                            w-10
                            rounded-xl
                        "
                        onClick={() =>
                            setOrderOpen(
                                false
                            )
                        }
                    >
                        <X
                            className="
                                h-5
                                w-5
                            "
                        />
                    </Button>
                </div>

                <div
                    className="
                        min-h-0
                        flex-1
                        overflow-hidden
                    "
                >
                    {activeOrderId ? (
                        <OrderCart
                            orderId={
                                activeOrderId
                            }

                            activeOrderNo={
                                String(activeOrderNo)
                            }

                            sessionId={
                                sessionId
                            }

                            onOrderSaved={
                                onOrderSaved
                            }
                        />
                    ) : (
                        <EmptyActiveOrder />
                    )}
                </div>

            </div>

        </main>
    );
}