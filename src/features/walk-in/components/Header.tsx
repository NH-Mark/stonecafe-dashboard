"use client";

import {
    Search,
    Percent,
    MessageSquare,
    LayoutDashboard,
    Plus,
    ArrowLeft,
    RefreshCw,
    List,
    ShoppingCart,
    ArrowRightLeft,
    Home,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    useMemo,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import {
    DiscountDialog,
} from "./discount/DiscountDialog";

import {
    OrderNoteDialog,
} from "./order/OrderNoteDialog";

import {
    useMenuSearch,
} from "../store/useMenuSearch";

import {
    useOrderStore,
} from "../store/useOrderStore";

import {
    DiningSession,
} from "../dining-session.service";

import {
    TablePaymentDialog,
} from "./payment/TablePaymentDialog";

import { toast } from "sonner";
import { TransferTableDialog } from "./session/TransferTableDialog";

interface HeaderProps {
    /*
    |--------------------------------------------------------------------------
    | Session mode
    |--------------------------------------------------------------------------
    */

    sessionMode?: boolean;

    /*
    |--------------------------------------------------------------------------
    | Dining session
    |--------------------------------------------------------------------------
    */

    session?: DiningSession | null;

    /*
    |--------------------------------------------------------------------------
    | Session total
    |--------------------------------------------------------------------------
    */

    sessionTotal?: number;

    /*
    |--------------------------------------------------------------------------
    | Refresh
    |--------------------------------------------------------------------------
    */

    refreshing?: boolean;

    onRefresh?: () => void;

    /*
    |--------------------------------------------------------------------------
    | Back
    |--------------------------------------------------------------------------
    */

    onBack?: () => void;

    /*
    |--------------------------------------------------------------------------
    | New order
    |--------------------------------------------------------------------------
    */

    onNewOrder?: () => void;

    /*
    |--------------------------------------------------------------------------
    | Open order
    |--------------------------------------------------------------------------
    |
    | Used by the responsive tablet/mobile footer.
    |
    */

    onOpenOrder?: () => void;

    /*
    |--------------------------------------------------------------------------
    | Open categories
    |--------------------------------------------------------------------------
    */

    onOpenCategories?: () => void;

    /*
    |--------------------------------------------------------------------------
    | Payment success
    |--------------------------------------------------------------------------
    */

    onPaymentSuccess?: (
        paidOrderIds: string[],
        sessionClosed: boolean
    ) => void;
}

export function Header({
    sessionMode = false,
    session = null,
    sessionTotal = 0,
    refreshing = false,
    onRefresh,
    onBack,
    onNewOrder,
    onOpenOrder,
    onOpenCategories,
    onPaymentSuccess,
}: HeaderProps) {
    const router = useRouter();

    /*
    |--------------------------------------------------------------------------
    | Dialog state
    |--------------------------------------------------------------------------
    */

    const [
        transferTableOpen,
        setTransferTableOpen,
    ] = useState(false);

    const [
        noteOpen,
        setNoteOpen,
    ] = useState(false);

    const [
        discountOpen,
        setDiscountOpen,
    ] = useState(false);

    const [
        tablePaymentOpen,
        setTablePaymentOpen,
    ] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Zustand
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | Subscribe to the complete orders object.
    |
    | This keeps Header synchronized when OrderCart changes:
    |
    |     confirmed -> completed
    |
    */

    const orders =
        useOrderStore(
            state =>
                state.orders
        );

    const clear =
        useOrderStore(
            state =>
                state.clear
        );

    const activeOrderId =
        useOrderStore(
            state =>
                state.activeOrderId
        );

    const activeOrder =
        useOrderStore(
            state =>
                activeOrderId
                    ? state.orders[
                    activeOrderId
                    ]
                    : undefined
        );

    /*
    |--------------------------------------------------------------------------
    | Unsaved items in active order
    |--------------------------------------------------------------------------
    */

    const hasUnsavedItems =
        activeOrder?.cart.some(
            item =>
                !activeOrder.savedLineIds.includes(
                    item.lineId
                )
        ) ?? false;

    /*
    |--------------------------------------------------------------------------
    | Menu search
    |--------------------------------------------------------------------------
    */

    const search =
        useMenuSearch(
            state =>
                state.search
        );

    const setSearch =
        useMenuSearch(
            state =>
                state.setSearch
        );

    /*
    |--------------------------------------------------------------------------
    | Paid local order IDs
    |--------------------------------------------------------------------------
    |
    | These are orders which were paid individually from OrderCart.
    |
    | We use this list to override stale session.orders data.
    |
    */

    const locallyCompletedOrderIds =
        useMemo(() => {
            const completedIds =
                new Set<string>();

            Object.values(
                orders
            ).forEach(
                order => {
                    if (
                        order.status ===
                        "completed"
                    ) {
                        completedIds.add(
                            String(
                                order.id ??
                                ""
                            )
                        );
                    }
                }
            );

            return completedIds;
        }, [orders]);

    /*
    |--------------------------------------------------------------------------
    | Confirmed orders available for table payment
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | Keep this logic separate from the unsaved-items check.
    |
    | This prevents the "old confirmed order listing" issue.
    |
    | A locally completed order is removed even if session.orders
    | still contains stale "confirmed" data.
    |
    */

    const confirmedSessionOrders =
        useMemo(() => {
            if (
                !session?.orders?.length
            ) {
                return [];
            }

            return session.orders.filter(
                sessionOrder => {
                    const orderId =
                        String(
                            sessionOrder.id
                        );

                    /*
                    |--------------------------------------------------------------
                    | First check local Zustand state.
                    |--------------------------------------------------------------
                    */

                    const localOrder =
                        orders[
                        orderId
                        ];

                    /*
                    |--------------------------------------------------------------
                    | Locally completed/cancelled orders must not
                    | be available for Pay Table.
                    |--------------------------------------------------------------
                    */

                    if (
                        localOrder?.status ===
                        "completed" ||
                        localOrder?.status ===
                        "cancelled"
                    ) {
                        return false;
                    }

                    /*
                    |--------------------------------------------------------------
                    | Explicit protection for locally completed IDs.
                    |--------------------------------------------------------------
                    */

                    if (
                        locallyCompletedOrderIds.has(
                            orderId
                        )
                    ) {
                        return false;
                    }

                    /*
                    |--------------------------------------------------------------
                    | Only backend-confirmed orders are payable.
                    |--------------------------------------------------------------
                    */

                    return (
                        sessionOrder.status ===
                        "confirmed"
                    );
                }
            );
        }, [
            session,
            orders,
            locallyCompletedOrderIds,
        ]);

    /*
    |--------------------------------------------------------------------------
    | UNSAVED ITEMS IN ANY ORDER OF THIS TABLE
    |--------------------------------------------------------------------------
    |
    | This is intentionally separate from confirmedSessionOrders.
    |
    | We DO NOT modify the confirmed-order filtering above.
    |
    | We only use this value when the user clicks "Pay Table".
    |
    */

    const hasUnsavedSessionItems =
        useMemo(() => {
            if (!session) {
                return false;
            }

            /*
            |----------------------------------------------------------------------
            | First check the active order.
            |----------------------------------------------------------------------
            |
            | This also catches a newly-created local order which may not
            | have been added to session.orders yet.
            |
            */

            if (hasUnsavedItems) {
                return true;
            }

            /*
            |----------------------------------------------------------------------
            | Build IDs of orders belonging to this dining session.
            |----------------------------------------------------------------------
            */

            const sessionOrderIds =
                new Set(
                    (session.orders ?? []).map(
                        sessionOrder =>
                            String(
                                sessionOrder.id
                            )
                    )
                );

            /*
            |----------------------------------------------------------------------
            | Check local Zustand orders belonging to this session.
            |----------------------------------------------------------------------
            |
            | We only inspect orders which are actually part of the current
            | dining session.
            |
            | This avoids an unrelated takeaway/POS order blocking Pay Table.
            |
            */

            return Object.values(
                orders
            ).some(
                localOrder => {
                    const localOrderId =
                        String(
                            localOrder.id ??
                            ""
                        );

                    if (
                        !sessionOrderIds.has(
                            localOrderId
                        )
                    ) {
                        return false;
                    }

                    return localOrder.cart.some(
                        item =>
                            !localOrder.savedLineIds.includes(
                                item.lineId
                            )
                    );
                }
            );
        }, [
            session,
            orders,
            hasUnsavedItems,
        ]);

    /*
    |--------------------------------------------------------------------------
    | Session available for TablePaymentDialog
    |--------------------------------------------------------------------------
    |
    | This prevents individually-paid orders from appearing in
    | TablePaymentDialog even if the parent has not refreshed
    | the dining session yet.
    |
    */

    const paymentSession =
        useMemo(() => {
            if (!session) {
                return null;
            }

            return {
                ...session,
                orders:
                    confirmedSessionOrders,
            };
        }, [
            session,
            confirmedSessionOrders,
        ]);

    /*
    |--------------------------------------------------------------------------
    | Pay Table availability
    |--------------------------------------------------------------------------
    */

    const hasConfirmedOrders =
        confirmedSessionOrders.length >
        0;

    /*
    |--------------------------------------------------------------------------
    | New order
    |--------------------------------------------------------------------------
    */

    function handleNewOrder() {
        /*
        |----------------------------------------------------------------------
        | Dining session
        |----------------------------------------------------------------------
        */

        if (sessionMode) {
            onNewOrder?.();
            return;
        }

        /*
        |----------------------------------------------------------------------
        | Normal POS
        |----------------------------------------------------------------------
        */

        clear();

        setSearch("");

        onNewOrder?.();
    }

    /*
    |--------------------------------------------------------------------------
    | Open order
    |--------------------------------------------------------------------------
    */

    function handleOpenOrder() {
        if (onOpenOrder) {
            onOpenOrder();
            return;
        }

        /*
        |----------------------------------------------------------------------
        | Fallback
        |----------------------------------------------------------------------
        */

        if (activeOrderId) {
            return;
        }

        handleNewOrder();
    }

    /*
    |--------------------------------------------------------------------------
    | Open categories
    |--------------------------------------------------------------------------
    */

    function handleOpenCategories() {
        onOpenCategories?.();
    }

    /*
    |--------------------------------------------------------------------------
    | Back
    |--------------------------------------------------------------------------
    */

    function handleBack() {
        if (onBack) {
            onBack();
            return;
        }

        router.push(
            "/walk-in/tables"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Session display
    |--------------------------------------------------------------------------
    */

    const sessionName =
        session?.table?.name ??
        "Dining Session";

    /*
    |--------------------------------------------------------------------------
    | Open Table Payment
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | Confirmed-order filtering is NOT changed here.
    |
    | We simply add a warning if any order in this table/session
    | still contains unsaved items.
    |
    */

    function handleOpenTablePayment() {
        /*
        |----------------------------------------------------------------------
        | No session
        |----------------------------------------------------------------------
        */

        if (!session) {
            return;
        }

        /*
        |----------------------------------------------------------------------
        | No confirmed orders
        |----------------------------------------------------------------------
        */

        if (!hasConfirmedOrders) {
            return;
        }

        /*
        |----------------------------------------------------------------------
        | UNSAVED ITEMS WARNING
        |----------------------------------------------------------------------
        |
        | Do not open table payment until all new items have been
        | sent to the kitchen.
        |
        */

        if (hasUnsavedSessionItems) {
            toast.warning(
                "Please send all new items to the kitchen before paying the table."
            );

            return;
        }

        /*
        |----------------------------------------------------------------------
        | Everything is ready
        |----------------------------------------------------------------------
        */

        setTablePaymentOpen(
            true
        );
    }

    return (
        <>
            <header
                className="
                    relative
                    z-30
                    shrink-0
                    border-b
                    bg-white
                "
            >
                {/* ========================================================= */}
                {/* MAIN HEADER                                                */}
                {/* ========================================================= */}

            <div
    className="
        flex
        w-full
        flex-col
        gap-3
        px-2
        py-3

        sm:px-3

        md:h-16
        md:flex-row
        md:items-center
        md:gap-3
        md:px-4
        md:py-3

        lg:px-6
    "
>
    {/* HOME */}
    {!sessionMode && (
        <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard")}
            aria-label="Go to dashboard"
            title="Dashboard"
            className="
                h-10
                w-10
                shrink-0
                rounded-xl
                border-[#ded9d3]
                bg-white
                text-[#40332a]
                shadow-none
                hover:bg-[#faf9f7]
            "
        >
            <Home className="h-5 w-5" />
        </Button>
    )}

    {/* LEFT / TITLE */}
    <div
        className="
            flex
            min-w-0
            shrink-0
            items-center
            gap-3
        "
    >
        {sessionMode && (
            <Button
                type="button"
                variant="outline"
                size="icon"
                className="
                    h-9
                    w-9
                    shrink-0
                    rounded-xl
                "
                onClick={handleBack}
            >
                <ArrowLeft className="h-4 w-4" />
            </Button>
        )}

        <div className="min-w-0">
            <h1
                className="
                    truncate
                    text-lg
                    font-bold
                    text-[#2f2924]
                    lg:text-xl
                "
            >
                <span className="hidden sm:inline">
                    Walk-In POS
                </span>

                <span className="sm:hidden">
                    POS
                </span>
            </h1>

            <p
                className="
                    truncate
                    text-xs
                    text-[#81786f]
                    lg:text-sm
                "
            >
                {sessionMode
                    ? sessionName
                    : "New Order"}
            </p>
        </div>
    </div>

    {/* SESSION INFO */}
    {sessionMode && (
        <div
            className="
                hidden
                shrink-0
                items-center
                gap-4
                lg:flex
            "
        >
            <div className="h-8 w-px bg-[#e5e2dd]" />

            <div>
                <p className="text-[10px] uppercase tracking-wide text-[#81786f]">
                    Session
                </p>

                <p className="text-sm font-semibold text-[#40332a]">
                    #{session?.id}
                </p>
            </div>

            <div>
                <p className="text-[10px] uppercase tracking-wide text-[#81786f]">
                    Total
                </p>

                <p className="text-sm font-bold text-[#40332a]">
                    {Number(sessionTotal).toFixed(2)} QAR
                </p>
            </div>
        </div>
    )}

    {/* SEARCH */}
    <div
        className="
            relative
            w-full
            min-w-0

            md:flex-1
            md:max-w-xl
            lg:mx-auto
        "
    >
        <Search
            className="
                absolute
                left-3
                top-3
                h-4
                w-4
                text-muted-foreground
            "
        />

        <Input
            value={search}
            onChange={event =>
                setSearch(event.target.value)
            }
            placeholder="Search menu..."
            className="
                h-11
                w-full
                rounded-xl
                pl-9
            "
        />
    </div>

                    {/* ===================================================== */}
                    {/* DESKTOP / HEADER ACTIONS                               */}
                    {/* ===================================================== */}

                    <div
                        className="
                            hidden
                            items-center
                            justify-end
                            gap-2
                            lg:flex
                        "
                    >
                        {/* DISCOUNT */}

                        <Button
                            type="button"
                            variant="outline"
                            disabled={
                                !activeOrderId
                            }
                            onClick={() =>
                                setDiscountOpen(
                                    true
                                )
                            }
                        >
                            <Percent
                                className="
                                    mr-2
                                    h-4
                                    w-4
                                "
                            />

                            Discount
                        </Button>

                        {/* NOTE */}

                        <Button
                            type="button"
                            variant="outline"
                            disabled={
                                !activeOrderId ||
                                !hasUnsavedItems
                            }
                            onClick={() =>
                                setNoteOpen(
                                    true
                                )
                            }
                        >
                            <MessageSquare
                                className="
                                    mr-2
                                    h-4
                                    w-4
                                "
                            />

                            Note
                        </Button>

                        {/* PAY TABLE */}

                        {sessionMode && (
                            <Button
                                type="button"
                                variant="default"
                                className="
                                    rounded-lg
                                    bg-green-800
                                "
                                disabled={
                                    !session ||
                                    !hasConfirmedOrders
                                }
                                onClick={
                                    handleOpenTablePayment
                                }
                            >
                                Pay Table
                            </Button>
                        )}
                        {/* TRANSFER TABLE */}

                        {sessionMode && (
                            <Button
                                type="button"
                                variant="outline"
                                className="
                                        rounded-lg
                                    "
                                disabled={
                                    !session
                                }
                                onClick={() =>
                                    setTransferTableOpen(
                                        true
                                    )
                                }
                            >
                                <ArrowRightLeft
                                    className="
                                            mr-2
                                            h-4
                                            w-4
                                        "
                                />

                                Transfer Table
                            </Button>
                        )}

                        {/* REFRESH */}

                        {sessionMode && (
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="
                                    rounded-xl
                                "
                                disabled={
                                    refreshing
                                }
                                onClick={
                                    onRefresh
                                }
                            >
                                <RefreshCw
                                    className={`h-4 w-4 ${refreshing
                                        ? "animate-spin"
                                        : ""
                                        }`}
                                />
                            </Button>
                        )}

                        {/* NEW ORDER */}

                        <Button
                            type="button"
                            onClick={
                                handleNewOrder
                            }
                        >
                            <Plus
                                className="
                                    mr-2
                                    h-4
                                    w-4
                                "
                            />

                            New Order
                        </Button>

                        {/* DASHBOARD */}

                        {!sessionMode && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    router.push(
                                        "/dashboard"
                                    )
                                }
                            >
                                <LayoutDashboard
                                    className="
                                        mr-2
                                        h-4
                                        w-4
                                    "
                                />

                                Dashboard
                            </Button>
                        )}
                    </div>

                    {/* ===================================================== */}
                    {/* PHONE ACTIONS                                           */}
                    {/* ===================================================== */}

                    <div
                        className="
                            flex
                            items-center
                            justify-end
                            gap-2

                            lg:hidden
                        "
                    >
                        {/* Discount */}

                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="
                                h-10
                                w-10
                                rounded-xl
                            "
                            disabled={
                                !activeOrderId
                            }
                            onClick={() =>
                                setDiscountOpen(
                                    true
                                )
                            }
                        >
                            <Percent
                                className="
                                    h-5
                                    w-5
                                "
                            />
                        </Button>

                        {/* Note */}

                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="
                                h-10
                                w-10
                                rounded-xl
                            "
                            disabled={
                                !activeOrderId ||
                                !hasUnsavedItems
                            }
                            onClick={() =>
                                setNoteOpen(
                                    true
                                )
                            }
                        >
                            <MessageSquare
                                className="
                                    h-5
                                    w-5
                                "
                            />
                        </Button>

                        {/* Pay table */}

                        {sessionMode && (
                            <Button
                                type="button"
                                size="icon"
                                className="
                                    h-10
                                    w-10
                                    rounded-xl
                                "
                                disabled={
                                    !session ||
                                    !hasConfirmedOrders
                                }
                                onClick={
                                    handleOpenTablePayment
                                }
                            >
                                <span className="text-[10px] font-bold">
                                    PAY
                                </span>
                            </Button>
                        )}
                        {/* Transfer table */}

                        {sessionMode && (
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="
                                    h-10
                                    w-10
                                    rounded-xl
                                "
                                disabled={
                                    !session
                                }
                                onClick={() =>
                                    setTransferTableOpen(
                                        true
                                    )
                                }
                            >
                                <ArrowRightLeft
                                    className="
                                        h-4
                                        w-4
                                    "
                                />
                            </Button>
                        )}

                        {/* Refresh */}

                        {sessionMode && (
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="
                                    h-10
                                    w-10
                                    rounded-xl
                                "
                                disabled={
                                    refreshing
                                }
                                onClick={
                                    onRefresh
                                }
                            >
                                <RefreshCw
                                    className={`h-4 w-4 ${refreshing
                                        ? "animate-spin"
                                        : ""
                                        }`}
                                />
                            </Button>
                        )}
                        {!sessionMode && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    router.push(
                                        "/dashboard"
                                    )
                                }
                            >
                                <LayoutDashboard
                                    className="
                                        mr-2
                                        h-4
                                        w-4
                                    "
                                />

                            </Button>
                        )}
                    </div>
                </div>

                {/* ========================================================= */}
                {/* TABLET / IPAD FOOTER                                      */}
                {/* ========================================================= */}

                {/* ========================================================= */}
                {/* TABLET / IPAD FOOTER                                      */}
                {/* ========================================================= */}

                <div
                    className="
        fixed
        bottom-0
        left-0
        right-0
        z-50

        hidden
        border-t
        bg-white
        px-3
        pb-[env(safe-area-inset-bottom)]
        pt-2
        shadow-[0_-4px_20px_rgba(0,0,0,0.08)]

        md:flex
        lg:hidden
    "
                >
                    <div
                        className="
            mx-auto
            flex
            w-full
            max-w-3xl
            items-center
            justify-around
            gap-2
        "
                    >
                        {/* CATEGORIES */}

                        <Button
                            type="button"
                            variant="ghost"
                            className="
                flex
                h-14
                flex-1
                flex-col
                gap-1
                rounded-xl
                text-xs
            "
                            onClick={handleOpenCategories}
                        >
                            <List className="h-5 w-5" />

                            <span>
                                Categories
                            </span>
                        </Button>

                        {/* ORDER */}

                        <Button
                            type="button"
                            variant="ghost"
                            className="
                flex
                h-14
                flex-1
                flex-col
                gap-1
                rounded-xl
                text-xs
            "
                            onClick={handleOpenOrder}
                        >
                            <div className="relative">
                                <ShoppingCart className="h-5 w-5" />

                                {activeOrderId && (
                                    <span
                                        className="
                            absolute
                            -right-2
                            -top-2
                            flex
                            h-4
                            min-w-4
                            items-center
                            justify-center
                            rounded-full
                            bg-primary
                            px-1
                            text-[9px]
                            font-bold
                            text-primary-foreground
                        "
                                    >
                                        •
                                    </span>
                                )}
                            </div>

                            <span>
                                Order
                            </span>
                        </Button>

                        {/* NEW ORDER */}

                        <Button
                            type="button"
                            variant="ghost"
                            className="
                flex
                h-14
                flex-1
                flex-col
                gap-1
                rounded-xl
                text-xs
            "
                            onClick={handleNewOrder}
                        >
                            <Plus className="h-5 w-5" />

                            <span>
                                New
                            </span>
                        </Button>

                        {/* DASHBOARD */}

                        {!sessionMode && (
                            <Button
                                type="button"
                                variant="ghost"
                                className="
                    flex
                    h-14
                    flex-1
                    flex-col
                    gap-1
                    rounded-xl
                    text-xs
                "
                                onClick={() =>
                                    router.push("/dashboard")
                                }
                            >
                                <LayoutDashboard className="h-5 w-5" />

                            </Button>
                        )}
                    </div>
                </div>


                {/* ========================================================= */}
                {/* TABLE PAYMENT                                             */}
                {/* ========================================================= */}

                {sessionMode &&
                    paymentSession &&
                    hasConfirmedOrders && (
                        <TablePaymentDialog
                            open={
                                tablePaymentOpen
                            }
                            onClose={() =>
                                setTablePaymentOpen(
                                    false
                                )
                            }
                            session={
                                paymentSession
                            }
                            onPaymentSuccess={
                                onPaymentSuccess
                            }
                        />
                    )}

                {/* ========================================================= */}
                {/* TRANSFER TABLE                                            */}
                {/* ========================================================= */}

                {sessionMode && (
                    <TransferTableDialog
                        open={
                            transferTableOpen
                        }
                        onClose={() =>
                            setTransferTableOpen(
                                false
                            )
                        }
                        currentTableId={
                            session?.table?.id
                        }
                        currentTableName={
                            session?.table?.name
                        }
                        sessionId={
                            session?.id
                        }
                        onTransferred={
                            table => {
                                toast.success(
                                    `Table transferred to ${table.name}.`
                                );

                                setTransferTableOpen(
                                    false
                                );

                                onRefresh?.();
                            }
                        }
                    />
                )}

                {/* ========================================================= */}
                {/* ORDER NOTE / DISCOUNT                                      */}
                {/* ========================================================= */}

                {activeOrderId && (
                    <>
                        <OrderNoteDialog
                            open={
                                noteOpen
                            }
                            onClose={() =>
                                setNoteOpen(
                                    false
                                )
                            }
                        />

                        <DiscountDialog
                            open={
                                discountOpen
                            }
                            onClose={() =>
                                setDiscountOpen(
                                    false
                                )
                            }
                            type="order"
                        />
                    </>
                )}
            </header>
        </>
    );
}