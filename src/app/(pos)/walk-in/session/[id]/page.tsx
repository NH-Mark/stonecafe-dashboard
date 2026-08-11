
"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useParams,
    useRouter,
} from "next/navigation";

import {
    getCategories,
} from "@/features/menu/category.service";

import {
    DiningSession,
    getDiningSession,
} from "@/features/walk-in/dining-session.service";

import {
    useOrderStore,
} from "@/features/walk-in/store/useOrderStore";

import {
    Category,
} from "@/types/category";

import {
    CartItem,
} from "@/features/walk-in/cart.types";

import {
    SessionOrderTabs,
    SessionOrderTabData,
} from "@/features/walk-in/components/session/SessionOrderTabs";

import {
    SessionMainLayout,
} from "@/features/walk-in/components/session/SessionMainLayout";

import {
    SessionMobileActions,
} from "@/features/walk-in/components/session/SessionMobileActions";

import {
    SessionLoading,
} from "@/features/walk-in/components/session/SessionLoading";

import {
    SessionError,
} from "@/features/walk-in/components/session/SessionError";

import {
    Discount,
} from "@/types/discount";

import {
    ModifierDialog,
} from "@/features/walk-in/components/modifier-dialog/ModifierDialog";

import {
    getLineTotal,
} from "@/features/walk-in/utils/cart-price";

import {
    Header,
} from "@/features/walk-in/components/Header";

/*
|--------------------------------------------------------------------------
| API Modifier
|--------------------------------------------------------------------------
*/

interface ApiOrderModifier {
    id: number;

    modifier_id?: number;

    quantity?: number;

    price: number;

    groupId?: number;

    groupName?: string;

    name?: string;

    modifier?: {
        id: number;

        name: string;

        price?: number;

        modifier_group_id?: number;

        modifier_group?: {
            id: number;
            name: string;
        };

        group?: {
            id: number;
            name: string;
        };
    };
}

/*
|--------------------------------------------------------------------------
| API Order Item
|--------------------------------------------------------------------------
*/

interface ApiOrderItem {
    id: number;

    menuItemId: number;

    quantity: number;

    unitPrice: number;

    totalPrice: number;

    notes?: string | null;

    menuItem: any;

    discount: Discount | null;

    modifiers: ApiOrderModifier[];
}

/*
|--------------------------------------------------------------------------
| API Session Order
|--------------------------------------------------------------------------
*/

interface ApiSessionOrder {
    id: number;

    order_no: string;

    status:
        | "draft"
        | "pending"
        | "confirmed"
        | "completed"
        | "cancelled";

    total: number;

    createdAt: string;

    items: ApiOrderItem[];

    orderNote: string | null;

    orderDiscount: any | null;
}

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export default function DiningSessionPage() {
    const router = useRouter();

    const params = useParams();

    const sessionId = Number(
        params.id
    );

    /*
    |--------------------------------------------------------------------------
    | Session state
    |--------------------------------------------------------------------------
    */

    const [
        session,
        setSession,
    ] = useState<DiningSession | null>(
        null
    );

    const [
        categories,
        setCategories,
    ] = useState<Category[]>(
        []
    );

    const [
        selectedCategory,
        setSelectedCategory,
    ] = useState<number | null>(
        null
    );

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState<string | null>(
        null
    );

    /*
    |--------------------------------------------------------------------------
    | Zustand
    |--------------------------------------------------------------------------
    */

    const activeOrderId =
        useOrderStore(
            state =>
                state.activeOrderId
        );

    const storeOrders =
        useOrderStore(
            state =>
                state.orders
        );

    const initializeOrder =
        useOrderStore(
            state =>
                state.initializeOrder
        );

    const createNewOrder =
        useOrderStore(
            state =>
                state.createNewOrder
        );

    const setActiveOrder =
        useOrderStore(
            state =>
                state.setActiveOrder
        );

    const clearSession =
        useOrderStore(
            state =>
                state.clearSession
        );

    const removeOrder =
        useOrderStore(
            state =>
                state.removeOrder
        );

    /*
    |--------------------------------------------------------------------------
    | Remove local order
    |--------------------------------------------------------------------------
    */

    const handleRemoveOrder = (
        orderId: string
    ) => {
        removeOrder(
            orderId
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Convert API item -> CartItem
    |--------------------------------------------------------------------------
    */

    const mapOrderItem =
        useCallback(
            (
                item: ApiOrderItem
            ): CartItem => {
                return {
                    lineId:
                        `db-${item.id}`,

                    menuItem:
                        item.menuItem,

                    quantity:
                        Number(
                            item.quantity
                        ),

                    modifiers:
                        (
                            item.modifiers ??
                            []
                        ).map(
                            modifier => {
                                const modifierData =
                                    modifier.modifier;

                                const group =
                                    modifierData?.modifier_group ??
                                    modifierData?.group;

                                return {
                                    id:
                                        Number(
                                            modifierData?.id ??
                                            modifier.modifier_id ??
                                            modifier.id
                                        ),

                                    groupId:
                                        Number(
                                            modifier.groupId ??
                                            group?.id ??
                                            0
                                        ),

                                    groupName:
                                        modifier.groupName ??
                                        group?.name ??
                                        "",

                                    name:
                                        modifier.name ??
                                        modifierData?.name ??
                                        "",

                                    price:
                                        Number(
                                            modifier.price ??
                                            modifierData?.price ??
                                            0
                                        ),
                                };
                            }
                        ),

                    note:
                        item.notes ??
                        "",

                    discount:
                        item.discount ??
                        null,
                };
            },
            []
        );

    /*
    |--------------------------------------------------------------------------
    | Calculate complete order total
    |--------------------------------------------------------------------------
    */

    const getOrderTotal =
        useCallback(
            (
                order:
                    typeof storeOrders[string]
            ) => {
                const subtotal =
                    order.cart.reduce(
                        (
                            sum,
                            item
                        ) =>
                            sum +
                            getLineTotal(
                                item
                            ),
                        0
                    );

                if (
                    !order.orderDiscount
                ) {
                    return subtotal;
                }

                const discountValue =
                    Number(
                        order
                            .orderDiscount
                            .value
                    );

                if (
                    order
                        .orderDiscount
                        .type ===
                    "percentage"
                ) {
                    const discountAmount =
                        subtotal *
                        (
                            discountValue /
                            100
                        );

                    return Math.max(
                        subtotal -
                            discountAmount,
                        0
                    );
                }

                return Math.max(
                    subtotal -
                        Math.min(
                            discountValue,
                            subtotal
                        ),
                    0
                );
            },
            []
        );

    /*
    |--------------------------------------------------------------------------
    | Session orders
    |--------------------------------------------------------------------------
    */

    const orders =
        useMemo<
            SessionOrderTabData[]
        >(
            () => {
                const dbOrders =
                    (
                        session?.orders ??
                        []
                    ) as ApiSessionOrder[];

                /*
                |--------------------------------------------------------------------------
                | Database orders
                |--------------------------------------------------------------------------
                */

                const databaseOrders =
                    dbOrders.map(
                        order => {
                            const orderId =
                                String(
                                    order.id
                                );

                            const orderNo =
                                String(
                                    order.order_no
                                );

                            const localOrder =
                                storeOrders[
                                    orderId
                                ];

                            const total =
                                localOrder
                                    ? getOrderTotal(
                                          localOrder
                                      )
                                    : Number(
                                          order.total
                                      );

                            const status =
                                localOrder?.status ??
                                order.status;

                            return {
                                id:
                                    orderId,

                                orderNo,

                                status,

                                total,

                                createdAt:
                                    order.createdAt,

                                isNew:
                                    false,
                            };
                        }
                    );

                /*
                |--------------------------------------------------------------------------
                | Local new orders
                |--------------------------------------------------------------------------
                */

                const localOrders =
                    Object.values(
                        storeOrders
                    )
                        .filter(
                            order =>
                                order.isNew &&
                                order.id.startsWith(
                                    "new-"
                                )
                        )
                        .map(
                            order => ({
                                id:
                                    order.id,

                                orderNo:
                                    order.orderNo ??
                                    undefined,

                                status:
                                    "draft" as const,

                                total:
                                    getOrderTotal(
                                        order
                                    ),

                                createdAt:
                                    "",

                                isNew:
                                    true,
                            })
                        );

                return [
                    ...databaseOrders,
                    ...localOrders,
                ];
            },
            [
                session,
                storeOrders,
                getOrderTotal,
            ]
        );

    /*
    |--------------------------------------------------------------------------
    | Active order number
    |--------------------------------------------------------------------------
    */

    const activeOrderNo =
        useMemo(() => {
            if (!activeOrderId) {
                return undefined;
            }

            /*
            |--------------------------------------------------------------------------
            | First check Zustand directly.
            |
            | This is important because after createOrder()
            | replaceOrderId() keeps the orderNo locally.
            |--------------------------------------------------------------------------
            */

            const localOrder =
                storeOrders[
                    activeOrderId
                ];

            if (
                localOrder?.orderNo
            ) {
                return localOrder.orderNo;
            }

            /*
            |--------------------------------------------------------------------------
            | Fallback to calculated session orders.
            |--------------------------------------------------------------------------
            */

            const order =
                orders.find(
                    order =>
                        order.id ===
                        activeOrderId
                );

            return order?.orderNo;
        }, [
            activeOrderId,
            storeOrders,
            orders,
        ]);

    /*
    |--------------------------------------------------------------------------
    | Session total
    |--------------------------------------------------------------------------
    */

    const sessionTotal =
        useMemo(
            () =>
                orders.reduce(
                    (
                        total,
                        order
                    ) =>
                        total +
                        Number(
                            order.total
                        ),
                    0
                ),
            [
                orders,
            ]
        );

    /*
    |--------------------------------------------------------------------------
    | Load session
    |--------------------------------------------------------------------------
    */

    const loadSession =
        useCallback(
            async (
                showRefresh = false
            ) => {
                try {
                    if (
                        showRefresh
                    ) {
                        setRefreshing(
                            true
                        );
                    } else {
                        setLoading(
                            true
                        );
                    }

                    setError(
                        null
                    );

                    if (
                        !sessionId
                    ) {
                        throw new Error(
                            "Invalid dining session."
                        );
                    }

                    const data =
                        await getDiningSession(
                            sessionId
                        );

                    setSession(
                        data
                    );
                } catch (
                    error
                ) {
                    console.error(
                        "Failed to load dining session:",
                        error
                    );

                    setError(
                        error instanceof
                            Error
                            ? error.message
                            : "Unable to load dining session."
                    );
                } finally {
                    setLoading(
                        false
                    );

                    setRefreshing(
                        false
                    );
                }
            },
            [
                sessionId,
            ]
        );

    /*
    |--------------------------------------------------------------------------
    | Load categories
    |--------------------------------------------------------------------------
    */

    const loadCategories =
        useCallback(
            async () => {
                try {
                    const response =
                        await getCategories();

                    setCategories(
                        response
                            .data
                            .data
                    );
                } catch (
                    error
                ) {
                    console.error(
                        "Failed to load categories:",
                        error
                    );
                }
            },
            []
        );

    /*
    |--------------------------------------------------------------------------
    | Initial load
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {
            clearSession();

            void loadSession();

            void loadCategories();
        },
        [
            clearSession,
            loadSession,
            loadCategories,
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | Hydrate database orders / create initial order
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {
            if (!session) {
                return;
            }

            const apiOrders =
                (
                    session.orders ??
                    []
                ) as ApiSessionOrder[];

            /*
            |--------------------------------------------------------------------------
            | Hydrate existing database orders
            |--------------------------------------------------------------------------
            */

            apiOrders.forEach(
                order => {
                    const cart =
                        (
                            order.items ??
                            []
                        ).map(
                            mapOrderItem
                        );

                    initializeOrder(
                        String(
                            order.id
                        ),
                        {
                            orderNo:
                                order.order_no ??
                                null,

                            cart,

                            orderNote:
                                order.orderNote ??
                                "",

                            orderDiscount:
                                order.orderDiscount ??
                                null,

                            status:
                                order.status,

                            isNew:
                                false,

                            savedLineIds:
                                cart.map(
                                    item =>
                                        item.lineId
                                ),
                        }
                    );
                }
            );

            const currentActive =
                useOrderStore
                    .getState()
                    .activeOrderId;

            /*
            |--------------------------------------------------------------------------
            | Existing session with orders
            |--------------------------------------------------------------------------
            */

            if (
                apiOrders.length >
                0
            ) {
                if (
                    !currentActive
                ) {
                    const latestOrder =
                        apiOrders[
                            apiOrders.length -
                                1
                        ];

                    setActiveOrder(
                        String(
                            latestOrder.id
                        )
                    );
                }

                return;
            }

            /*
            |--------------------------------------------------------------------------
            | Brand-new session
            |--------------------------------------------------------------------------
            */

            if (
                !currentActive
            ) {
                const newOrderId =
                    createNewOrder();

                setActiveOrder(
                    newOrderId
                );
            }
        },
        [
            session,
            initializeOrder,
            mapOrderItem,
            setActiveOrder,
            createNewOrder,
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | New order
    |--------------------------------------------------------------------------
    */

    function handleNewOrder() {
        const newOrderId =
            createNewOrder();

        setActiveOrder(
            newOrderId
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Select order
    |--------------------------------------------------------------------------
    */

    function handleSelectOrder(
        orderId: string
    ) {
        setActiveOrder(
            orderId
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Payment success
    |--------------------------------------------------------------------------
    */

    function handlePaymentSuccess(
        paidOrderIds: string[],
        sessionClosed: boolean
    ) {
        if (
            sessionClosed
        ) {
            clearSession();

            setSession(
                null
            );

            router.replace(
                "/walk-in/tables"
            );

            return;
        }

        setSession(
            current => {
                if (!current) {
                    return null;
                }

                const paidIds =
                    new Set(
                        paidOrderIds.map(
                            String
                        )
                    );

                const updatedOrders =
                    (
                        current.orders ??
                        []
                    ).map(
                        order => {
                            if (
                                paidIds.has(
                                    String(
                                        order.id
                                    )
                                )
                            ) {
                                return {
                                    ...order,
                                    status:
                                        "completed" as const,
                                };
                            }

                            return order;
                        }
                    );

                return {
                    ...current,
                    orders:
                        updatedOrders,
                };
            }
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Order saved
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | OrderCart now sends:
    |
    | onOrderSaved(orderId, orderNo)
    |
    |--------------------------------------------------------------------------
    */

    const handleOrderSaved =
        useCallback(
            async (
                orderId: string,
                orderNo?: string | null
            ) => {

                await loadSession(
                    true
                );

            },
            [
                loadSession,
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | Mobile
    |--------------------------------------------------------------------------
    */

    function handleOpenOrder() {
        console.log(
            "Open order:",
            activeOrderId
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Back
    |--------------------------------------------------------------------------
    */

    function goBack() {
        router.push(
            "/walk-in/tables"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <SessionLoading />
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (
        error ||
        !session
    ) {
        return (
            <SessionError
                message={
                    error ??
                    "Dining session not found."
                }
                onBack={
                    goBack
                }
                onRetry={() =>
                    loadSession(
                        true
                    )
                }
            />
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div
            className="
                flex
                h-dvh
                min-h-0
                flex-col
            "
            style={{
                backgroundColor:
                    "#f3f3f3",
            }}
        >
            <Header
                sessionMode
                session={
                    session
                }
                sessionTotal={
                    sessionTotal
                }
                refreshing={
                    refreshing
                }
                onRefresh={() =>
                    loadSession(
                        true
                    )
                }
                onBack={
                    goBack
                }
                onNewOrder={
                    handleNewOrder
                }
                onPaymentSuccess={
                    handlePaymentSuccess
                }
            />

            <SessionOrderTabs
                orders={
                    orders
                }
                activeOrderId={
                    activeOrderId
                }
                onSelectOrder={
                    handleSelectOrder
                }
                onNewOrder={
                    handleNewOrder
                }
                onRemoveOrder={
                    handleRemoveOrder
                }
            />

            <SessionMainLayout
                sessionId={
                    sessionId
                }
                categories={
                    categories
                }
                selectedCategory={
                    selectedCategory
                }
                onSelectCategory={
                    setSelectedCategory
                }
                activeOrderId={
                    activeOrderId
                }
                activeOrderNo={
                    String(activeOrderNo)
                }
                onOrderSaved={
                    handleOrderSaved
                }
            />

            <SessionMobileActions
                onNewOrder={
                    handleNewOrder
                }
                hasActiveOrder={
                    Boolean(
                        activeOrderId
                    )
                }
                onOpenOrder={
                    handleOpenOrder
                }
            />

            <ModifierDialog />
        </div>
    );
}
