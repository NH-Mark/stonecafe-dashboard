
"use client";

import { create } from "zustand";

import { CartItem } from "../cart.types";
import { Discount } from "@/types/discount";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export type OrderStatus =
    | "draft"
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled";

export interface OrderDiscount {
    id: number;
    name: string;
    type: "percentage" | "fixed";
    value: number;
}

export type OrderSyncStatus =
    | "pending"
    | "synced"
    | "syncing"
    | "error";

export interface LocalOrder {
    id: string;
    orderNo: string | null;

    cart: CartItem[];

    orderNote: string;

    orderDiscount: OrderDiscount | null;

    status: OrderStatus;

    isNew: boolean;

    savedLineIds: string[];

    syncStatus: OrderSyncStatus;
    version?: number;
}

interface OrderStore {
    orders: Record<string, LocalOrder>;

    activeOrderId: string | null;
    activeOrderNo: string | null;

    cart: CartItem[];

    orderNote: string;

    orderDiscount: OrderDiscount | null;

    status: OrderStatus;

    initializeOrder: (
        orderId: string,
        initialData?: Partial<LocalOrder>
    ) => void;

    createNewOrder: () => string;

    setActiveOrder: (
        orderId: string
    ) => void;

    setActiveOrderNo: (
        orderNo: string | null
    ) => void;

    removeOrder: (
        orderId: string
    ) => void;

    clearSession: () => void;

    replaceOrderId: (
        oldOrderId: string,
        newOrderId: string
    ) => void;

    updateOrderStatus: (
        orderId: string,
        status: OrderStatus
    ) => void;

    completeOrder: (
        orderId: string | number
    ) => boolean;

    setOrderNote: (
        note: string
    ) => void;

    applyOrderDiscount: (
        discount: OrderDiscount
    ) => void;

    removeOrderDiscount: () => void;

    addItem: (
        item: CartItem
    ) => void;

    removeItem: (
        lineId: string
    ) => void;

    increaseQty: (
        lineId: string
    ) => void;

    decreaseQty: (
        lineId: string
    ) => void;

    updateItem: (
        lineId: string,
        data: Partial<CartItem>
    ) => void;

    applyDiscount: (
        lineId: string,
        discount: Discount
    ) => void;

    removeDiscount: (
        lineId: string
    ) => void;

    clear: () => void;

    markItemsSaved: (
        orderId: string,
        lineIds: string[]
    ) => void;

    setOrderItemId: (
        orderId: string,
        lineId: string,
        orderItemId: number
    ) => void;

    updateLocalOrder: (
        orderId: string,
        data: Partial<LocalOrder>
    ) => void;
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function sameModifiers(
    a: any[] = [],
    b: any[] = []
): boolean {
    if (a.length !== b.length) {
        return false;
    }

    return (
        a.every(modifier =>
            b.some(
                item =>
                    item?.id === modifier?.id
            )
        ) &&
        b.every(modifier =>
            a.some(
                item =>
                    item?.id === modifier?.id
            )
        )
    );
}

/*
|--------------------------------------------------------------------------
| Store
|--------------------------------------------------------------------------
*/

export const useOrderStore = create<OrderStore>(
    (set, get) => ({

        /*
        |--------------------------------------------------------------------------
        | Initial state
        |--------------------------------------------------------------------------
        */

        orders: {},

        activeOrderId: null,

        activeOrderNo: null,

        cart: [],

        orderNote: "",

        orderDiscount: null,

        status: "draft",

        /*
        |--------------------------------------------------------------------------
        | Initialize order
        |--------------------------------------------------------------------------
        */

        initializeOrder: (
            orderId,
            initialData
        ) => {

            set(state => {

                const existing =
                    state.orders[orderId];

                /*
                |--------------------------------------------------------------------------
                | Existing order
                |--------------------------------------------------------------------------
                */

                if (existing) {

                    const nextOrder: LocalOrder = {
                        ...existing,

                        ...initialData,

                        id: orderId,

                        orderNo:
                            initialData?.orderNo ??
                            existing.orderNo ??
                            null,

                        cart:
                            initialData?.cart ??
                            existing.cart ??
                            [],

                        orderNote:
                            initialData?.orderNote ??
                            existing.orderNote ??
                            "",

                        orderDiscount:
                            initialData?.orderDiscount ??
                            existing.orderDiscount ??
                            null,

                        status:
                            initialData?.status ??
                            existing.status ??
                            "draft",

                        isNew:
                            initialData?.isNew ??
                            existing.isNew,

                        savedLineIds:
                            initialData?.savedLineIds ??
                            existing.savedLineIds ??
                            [],
                    };

                    const isActive =
                        state.activeOrderId === orderId;

                    return {

                        orders: {
                            ...state.orders,

                            [orderId]:
                                nextOrder,
                        },

                        activeOrderId:
                            state.activeOrderId,

                        activeOrderNo:
                            isActive
                                ? nextOrder.orderNo
                                : state.activeOrderNo,

                        cart:
                            isActive
                                ? nextOrder.cart
                                : state.cart,

                        orderNote:
                            isActive
                                ? nextOrder.orderNote
                                : state.orderNote,

                        orderDiscount:
                            isActive
                                ? nextOrder.orderDiscount
                                : state.orderDiscount,

                        status:
                            isActive
                                ? nextOrder.status
                                : state.status,
                    };
                }

                /*
                |--------------------------------------------------------------------------
                | New order
                |--------------------------------------------------------------------------
                */

                const order: LocalOrder = {

                    id:
                        orderId,

                    orderNo:
                        initialData?.orderNo ??
                        null,

                    cart:
                        initialData?.cart ??
                        [],

                    orderNote:
                        initialData?.orderNote ??
                        "",

                    orderDiscount:
                        initialData?.orderDiscount ??
                        null,

                    status:
                        initialData?.status ??
                        "draft",

                    isNew:
                        initialData?.isNew ??
                        orderId.startsWith("new-"),

                    savedLineIds:
                        initialData?.savedLineIds ??
                        [],

                    syncStatus:
                        initialData?.syncStatus ??
                        "synced",
                };

                const shouldActivate =
                    state.activeOrderId === null;

                return {

                    orders: {
                        ...state.orders,

                        [orderId]:
                            order,
                    },

                    activeOrderId:
                        shouldActivate
                            ? orderId
                            : state.activeOrderId,

                    activeOrderNo:
                        shouldActivate
                            ? order.orderNo
                            : state.activeOrderNo,

                    cart:
                        shouldActivate
                            ? order.cart
                            : state.cart,

                    orderNote:
                        shouldActivate
                            ? order.orderNote
                            : state.orderNote,

                    orderDiscount:
                        shouldActivate
                            ? order.orderDiscount
                            : state.orderDiscount,

                    status:
                        shouldActivate
                            ? order.status
                            : state.status,
                };
            });
        },

        /*
        |--------------------------------------------------------------------------
        | Create new order
        |--------------------------------------------------------------------------
        */

        createNewOrder: () => {

            const orderId =
                `new-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 8)}`;

            get().initializeOrder(
                orderId,
                {
                    orderNo: null,
                    cart: [],
                    orderNote: "",
                    orderDiscount: null,
                    status: "draft",
                    isNew: true,
                    savedLineIds: [],
                }
            );

            get().setActiveOrder(
                orderId
            );

            return orderId;
        },

        /*
        |--------------------------------------------------------------------------
        | Set active order
        |--------------------------------------------------------------------------
        */

        setActiveOrder: (
            orderId
        ) => {

            set(state => {

                const order =
                    state.orders[orderId];

                if (!order) {

                    console.warn(
                        `Cannot activate order. Order ${orderId} does not exist.`
                    );

                    return state;
                }

                return {

                    activeOrderId:
                        orderId,

                    activeOrderNo:
                        order.orderNo ?? null,

                    cart:
                        order.cart ?? [],

                    orderNote:
                        order.orderNote ?? "",

                    orderDiscount:
                        order.orderDiscount ?? null,

                    status:
                        order.status ?? "draft",
                };
            });
        },

        /*
        |--------------------------------------------------------------------------
        | Set active order number
        |--------------------------------------------------------------------------
        */

        setActiveOrderNo: (
            orderNo
        ) => {

            set(state => {

                const normalizedOrderNo =
                    orderNo ?? null;

                if (!state.activeOrderId) {

                    return {
                        activeOrderNo:
                            normalizedOrderNo,
                    };
                }

                const active =
                    state.orders[
                    state.activeOrderId
                    ];

                if (!active) {

                    return {
                        activeOrderNo:
                            normalizedOrderNo,
                    };
                }

                return {

                    activeOrderNo:
                        normalizedOrderNo,

                    orders: {

                        ...state.orders,

                        [state.activeOrderId]: {

                            ...active,

                            orderNo:
                                normalizedOrderNo,
                        },
                    },
                };
            });
        },

        /*
        |--------------------------------------------------------------------------
        | Update order status
        |--------------------------------------------------------------------------
        */

        updateOrderStatus: (
            orderId,
            status
        ) => {

            set(state => {

                const id =
                    String(orderId);

                const order =
                    state.orders[id];

                if (!order) {

                    console.warn(
                        `Cannot update status. Order ${id} does not exist in Zustand.`
                    );

                    return state;
                }

                const updatedOrder: LocalOrder = {

                    ...order,

                    status,

                    isNew:
                        false,
                };

                const isActive =
                    state.activeOrderId === id;

                return {

                    orders: {

                        ...state.orders,

                        [id]:
                            updatedOrder,
                    },

                    status:
                        isActive
                            ? status
                            : state.status,
                };
            });
        },

        /*
        |--------------------------------------------------------------------------
        | Complete order
        |--------------------------------------------------------------------------
        */

        completeOrder: (
            orderId
        ) => {

            const id =
                String(orderId);

            const currentOrder =
                get().orders[id];

            if (!currentOrder) {

                console.warn(
                    `Cannot complete order. Order ${id} does not exist in Zustand.`
                );

                return false;
            }

            set(state => {

                const order =
                    state.orders[id];

                if (!order) {
                    return state;
                }

                const updatedOrder: LocalOrder = {

                    ...order,

                    status:
                        "completed",

                    isNew:
                        false,
                };

                const isActive =
                    state.activeOrderId === id;

                return {

                    orders: {

                        ...state.orders,

                        [id]:
                            updatedOrder,
                    },

                    cart:
                        isActive
                            ? updatedOrder.cart
                            : state.cart,

                    orderNote:
                        isActive
                            ? updatedOrder.orderNote
                            : state.orderNote,

                    orderDiscount:
                        isActive
                            ? updatedOrder.orderDiscount
                            : state.orderDiscount,

                    status:
                        isActive
                            ? "completed"
                            : state.status,
                };
            });

            return true;
        },

        /*
        |--------------------------------------------------------------------------
        | Replace order ID
        |--------------------------------------------------------------------------
        */

        replaceOrderId: (
            oldOrderId,
            newOrderId
        ) => {

            set(state => {

                const oldOrder =
                    state.orders[oldOrderId];

                if (!oldOrder) {

                    console.warn(
                        `Cannot replace order ID. Order ${oldOrderId} does not exist.`
                    );

                    return state;
                }

                const newOrder: LocalOrder = {

                    ...oldOrder,

                    id:
                        newOrderId,

                    isNew:
                        false,
                };

                const nextOrders = {
                    ...state.orders,
                };

                delete nextOrders[
                    oldOrderId
                ];

                nextOrders[
                    newOrderId
                ] = newOrder;

                const isActive =
                    state.activeOrderId ===
                    oldOrderId;

                return {

                    orders:
                        nextOrders,

                    activeOrderId:
                        isActive
                            ? newOrderId
                            : state.activeOrderId,

                    activeOrderNo:
                        isActive
                            ? newOrder.orderNo ?? null
                            : state.activeOrderNo,

                    cart:
                        isActive
                            ? newOrder.cart
                            : state.cart,

                    orderNote:
                        isActive
                            ? newOrder.orderNote
                            : state.orderNote,

                    orderDiscount:
                        isActive
                            ? newOrder.orderDiscount
                            : state.orderDiscount,

                    status:
                        isActive
                            ? newOrder.status
                            : state.status,
                };
            });
        },

        /*
        |--------------------------------------------------------------------------
        | Remove order
        |--------------------------------------------------------------------------
        */

        removeOrder: (
            orderId
        ) => {

            set(state => {

                const nextOrders = {
                    ...state.orders,
                };

                delete nextOrders[
                    orderId
                ];

                let nextActiveId =
                    state.activeOrderId;

                if (
                    nextActiveId ===
                    orderId
                ) {

                    const remaining =
                        Object.keys(
                            nextOrders
                        );

                    nextActiveId =
                        remaining.length > 0
                            ? remaining[
                            remaining.length - 1
                            ]
                            : null;
                }

                const activeOrder =
                    nextActiveId
                        ? nextOrders[
                        nextActiveId
                        ]
                        : null;

                return {

                    orders:
                        nextOrders,

                    activeOrderId:
                        nextActiveId,

                    activeOrderNo:
                        activeOrder?.orderNo ??
                        null,

                    cart:
                        activeOrder?.cart ??
                        [],

                    orderNote:
                        activeOrder?.orderNote ??
                        "",

                    orderDiscount:
                        activeOrder?.orderDiscount ??
                        null,

                    status:
                        activeOrder?.status ??
                        "draft",
                };
            });
        },

        /*
        |--------------------------------------------------------------------------
        | Clear session
        |--------------------------------------------------------------------------
        */

        clearSession: () => {

            set({

                orders: {},

                activeOrderId:
                    null,

                activeOrderNo:
                    null,

                cart: [],

                orderNote: "",

                orderDiscount:
                    null,

                status:
                    "draft",
            });
        },

        /*
        |--------------------------------------------------------------------------
        | Set order note
        |--------------------------------------------------------------------------
        */

        setOrderNote: (note) => {
            set(state => {
                if (!state.activeOrderId) {
                    return {
                        orderNote: note,
                    };
                }

                const active =
                    state.orders[state.activeOrderId];

                if (!active) {
                    return {
                        orderNote: note,
                    };
                }

                const isPersistedOrder =
                    !active.id.startsWith("new-");

                const updatedOrder: LocalOrder = {
                    ...active,

                    orderNote: note,

                    syncStatus:
                        isPersistedOrder
                            ? "pending"
                            : active.syncStatus,
                };

                return {
                    orderNote: note,

                    orders: {
                        ...state.orders,

                        [state.activeOrderId]:
                            updatedOrder,
                    },
                };
            });
        },

        /*
        |--------------------------------------------------------------------------
        | Apply order discount
        |--------------------------------------------------------------------------
        */

        applyOrderDiscount: (discount) => {
            set(state => {
                if (!state.activeOrderId) {
                    return {
                        orderDiscount: discount,
                    };
                }

                const active =
                    state.orders[state.activeOrderId];

                if (!active) {
                    return {
                        orderDiscount: discount,
                    };
                }

                const isPersistedOrder =
                    !active.id.startsWith("new-");

                const updatedOrder: LocalOrder = {
                    ...active,

                    orderDiscount: discount,

                    syncStatus: isPersistedOrder
                        ? "pending"
                        : active.syncStatus,
                };

                return {
                    orderDiscount: discount,

                    orders: {
                        ...state.orders,

                        [state.activeOrderId]:
                            updatedOrder,
                    },
                };
            });
        },

        /*
        |--------------------------------------------------------------------------
        | Remove order discount
        |--------------------------------------------------------------------------
        */

        removeOrderDiscount: () => {
            set(state => {
                if (!state.activeOrderId) {
                    return {
                        orderDiscount: null,
                    };
                }

                const active =
                    state.orders[state.activeOrderId];

                if (!active) {
                    return {
                        orderDiscount: null,
                    };
                }

                const isPersistedOrder =
                    !active.id.startsWith("new-");

                const updatedOrder: LocalOrder = {
                    ...active,

                    orderDiscount: null,

                    syncStatus: isPersistedOrder
                        ? "pending"
                        : active.syncStatus,
                };

                return {
                    orderDiscount: null,

                    orders: {
                        ...state.orders,

                        [state.activeOrderId]:
                            updatedOrder,
                    },
                };
            });
        },

        /*
        |--------------------------------------------------------------------------
        | Add item
        |--------------------------------------------------------------------------
        */

        addItem: (newItem) => {
            set(state => {
                if (!state.activeOrderId) {
                    return state;
                }

                const activeOrder =
                    state.orders[state.activeOrderId];

                if (!activeOrder) {
                    return state;
                }

                const existingItem =
                    activeOrder.cart.find(
                        item =>
                            item.menuItem.id ===
                            newItem.menuItem.id &&
                            sameModifiers(
                                item.modifiers,
                                newItem.modifiers
                            ) &&
                            item.note === newItem.note
                    );

                let nextCart: CartItem[];

                if (existingItem) {
                    nextCart = activeOrder.cart.map(
                        item =>
                            item.lineId ===
                                existingItem.lineId
                                ? {
                                    ...item,

                                    quantity:
                                        item.quantity +
                                        newItem.quantity,

                                    // Keep the backend ID if
                                    // this item already exists.
                                    orderItemId:
                                        item.orderItemId ??
                                        newItem.orderItemId,
                                }
                                : item
                    );
                } else {
                    nextCart = [
                        ...activeOrder.cart,
                        newItem,
                    ];
                }

                const hasUnsavedItems =
                    nextCart.some(
                        item =>
                            item.orderItemId == null
                    );

                return {
                    ...state,

                    orders: {
                        ...state.orders,

                        [state.activeOrderId]: {
                            ...activeOrder,

                            cart: nextCart,

                            syncStatus:
                                hasUnsavedItems
                                    ? "pending"
                                    : "pending",
                        },
                    },
                };
            });
        },

        /*
        |--------------------------------------------------------------------------
        | Remove item
        |--------------------------------------------------------------------------
        */

        removeItem: (lineId) => {
            set(state => {
                if (!state.activeOrderId) {
                    return state;
                }

                const active =
                    state.orders[state.activeOrderId];

                if (!active) {
                    return state;
                }

                const itemToRemove =
                    active.cart.find(
                        item =>
                            item.lineId === lineId
                    );

                if (!itemToRemove) {
                    return state;
                }

                const nextCart =
                    active.cart.filter(
                        item =>
                            item.lineId !== lineId
                    );

                const nextSavedLineIds =
                    active.savedLineIds.filter(
                        id => id !== lineId
                    );

                /**
                 * If the item already has a backend
                 * orderItemId, removing it means the
                 * existing order needs to be synced.
                 *
                 * A new local item does not need sync.
                 */
                const isPersistedItem =
                    itemToRemove.orderItemId != null;

                const updatedOrder: LocalOrder = {
                    ...active,

                    cart: nextCart,

                    savedLineIds:
                        nextSavedLineIds,

                    syncStatus:
                        isPersistedItem
                            ? "pending"
                            : active.syncStatus,
                };

                return {
                    cart: nextCart,

                    orders: {
                        ...state.orders,

                        [state.activeOrderId]:
                            updatedOrder,
                    },
                };
            });
        },

        /*
        |--------------------------------------------------------------------------
        | Increase quantity
        |--------------------------------------------------------------------------
        */

        increaseQty: (lineId) => {
            set(state => {
                if (!state.activeOrderId) {
                    return state;
                }

                const active =
                    state.orders[state.activeOrderId];

                if (!active) {
                    return state;
                }

                const targetItem =
                    active.cart.find(
                        item =>
                            item.lineId === lineId
                    );

                if (!targetItem) {
                    return state;
                }

                const nextCart =
                    active.cart.map(item =>
                        item.lineId === lineId
                            ? {
                                ...item,
                                quantity:
                                    item.quantity + 1,
                            }
                            : item
                    );

                const isPersistedItem =
                    targetItem.orderItemId != null;

                const updatedOrder: LocalOrder = {
                    ...active,

                    cart: nextCart,

                    syncStatus:
                        isPersistedItem
                            ? "pending"
                            : active.syncStatus,
                };

                return {
                    cart: nextCart,

                    orders: {
                        ...state.orders,

                        [state.activeOrderId]:
                            updatedOrder,
                    },
                };
            });
        },

        /*
        |--------------------------------------------------------------------------
        | Decrease quantity
        |--------------------------------------------------------------------------
        */

        decreaseQty: (lineId) => {
            set(state => {
                if (!state.activeOrderId) {
                    return state;
                }

                const active =
                    state.orders[state.activeOrderId];

                if (!active) {
                    return state;
                }

                const targetItem =
                    active.cart.find(
                        item =>
                            item.lineId === lineId
                    );

                if (!targetItem) {
                    return state;
                }

                const nextCart =
                    active.cart
                        .map(item =>
                            item.lineId === lineId
                                ? {
                                    ...item,
                                    quantity:
                                        item.quantity - 1,
                                }
                                : item
                        )
                        .filter(
                            item =>
                                item.quantity > 0
                        );

                const isPersistedItem =
                    targetItem.orderItemId != null;

                const updatedOrder: LocalOrder = {
                    ...active,

                    cart: nextCart,

                    syncStatus:
                        isPersistedItem
                            ? "pending"
                            : active.syncStatus,
                };

                return {
                    cart: nextCart,

                    orders: {
                        ...state.orders,

                        [state.activeOrderId]:
                            updatedOrder,
                    },
                };
            });
        },

        /*
        |--------------------------------------------------------------------------
        | Update item
        |--------------------------------------------------------------------------
        */

        updateItem: (lineId, updates) => {
            set(state => {
                const activeOrderId =
                    state.activeOrderId;

                if (!activeOrderId) {
                    return state;
                }

                const activeOrder =
                    state.orders[activeOrderId];

                if (!activeOrder) {
                    return state;
                }

                const cart =
                    activeOrder.cart.map(item =>
                        item.lineId === lineId
                            ? {
                                ...item,
                                ...updates,
                            }
                            : item
                    );

                const hasPersistedItem =
                    activeOrder.cart.some(
                        item =>
                            item.lineId === lineId &&
                            item.orderItemId != null
                    );

                const updatedOrder: LocalOrder = {
                    ...activeOrder,
                    cart,
                    syncStatus:
                        hasPersistedItem
                            ? "pending"
                            : activeOrder.syncStatus,
                };

                return {
                    orders: {
                        ...state.orders,
                        [activeOrderId]: updatedOrder,
                    },

                    cart,
                };
            });
        },


        /*
|--------------------------------------------------------------------------
| Apply item discount
|--------------------------------------------------------------------------
*/

        applyDiscount: (
            lineId,
            discount
        ) => {
            set(state => {
                if (!state.activeOrderId) {
                    return state;
                }

                const active =
                    state.orders[state.activeOrderId];

                if (!active) {
                    return state;
                }

                const targetItem =
                    active.cart.find(
                        item =>
                            item.lineId === lineId
                    );

                if (!targetItem) {
                    return state;
                }

                const nextCart =
                    active.cart.map(item =>
                        item.lineId === lineId
                            ? {
                                ...item,
                                discount,
                            }
                            : item
                    );

                const isPersistedItem =
                    targetItem.orderItemId != null;

                const updatedOrder: LocalOrder = {
                    ...active,

                    cart: nextCart,

                    syncStatus:
                        isPersistedItem
                            ? "pending"
                            : active.syncStatus,
                };

                return {
                    cart: nextCart,

                    orders: {
                        ...state.orders,

                        [state.activeOrderId]:
                            updatedOrder,
                    },
                };
            });
        },

        /*
        |--------------------------------------------------------------------------
        | Remove item discount
        |--------------------------------------------------------------------------
        */

        removeDiscount: (
            lineId
        ) => {
            set(state => {
                if (!state.activeOrderId) {
                    return state;
                }

                const active =
                    state.orders[state.activeOrderId];

                if (!active) {
                    return state;
                }

                const targetItem =
                    active.cart.find(
                        item =>
                            item.lineId === lineId
                    );

                if (!targetItem) {
                    return state;
                }

                const nextCart =
                    active.cart.map(item =>
                        item.lineId === lineId
                            ? {
                                ...item,
                                discount: null,
                            }
                            : item
                    );

                const isPersistedItem =
                    targetItem.orderItemId != null;

                const updatedOrder: LocalOrder = {
                    ...active,

                    cart: nextCart,

                    syncStatus:
                        isPersistedItem
                            ? "pending"
                            : active.syncStatus,
                };

                return {
                    cart: nextCart,

                    orders: {
                        ...state.orders,

                        [state.activeOrderId]:
                            updatedOrder,
                    },
                };
            });
        },
        /*
        |--------------------------------------------------------------------------
        | Clear active cart
        |--------------------------------------------------------------------------
        */

        clear: () => {

            set(state => {

                if (
                    !state.activeOrderId
                ) {

                    return {

                        cart: [],

                        orderNote:
                            "",

                        orderDiscount:
                            null,

                        status:
                            "draft",
                    };
                }

                const active =
                    state.orders[
                    state.activeOrderId
                    ];

                if (!active) {

                    return {

                        cart: [],

                        orderNote:
                            "",

                        orderDiscount:
                            null,

                        status:
                            "draft",
                    };
                }

                const nextOrder: LocalOrder = {

                    ...active,

                    cart: [],

                    orderNote:
                        "",

                    orderDiscount:
                        null,
                };

                return {

                    cart: [],

                    orderNote:
                        "",

                    orderDiscount:
                        null,

                    status:
                        nextOrder.status,

                    orders: {

                        ...state.orders,

                        [state.activeOrderId]:
                            nextOrder,
                    },
                };
            });
        },

        /*
        |--------------------------------------------------------------------------
        | Mark items saved
        |--------------------------------------------------------------------------
        */

        markItemsSaved: (
            orderId,
            lineIds
        ) => {

            set(state => {

                const order =
                    state.orders[orderId];

                if (!order) {

                    console.warn(
                        `Cannot mark items saved. Order ${orderId} does not exist.`
                    );

                    return state;
                }

                return {

                    orders: {

                        ...state.orders,

                        [orderId]: {

                            ...order,

                            savedLineIds:
                                Array.from(
                                    new Set([
                                        ...(order.savedLineIds ?? []),
                                        ...lineIds,
                                    ])
                                ),
                        },
                    },
                };
            });
        },
        setOrderItemId: (
            orderId,
            lineId,
            orderItemId
        ) =>
            set(state => {
                const order = state.orders[orderId];

                if (!order) {
                    console.warn(
                        "setOrderItemId: order not found",
                        {
                            orderId,
                            lineId,
                            orderItemId,
                        }
                    );

                    return state;
                }

                return {
                    orders: {
                        ...state.orders,
                        [orderId]: {
                            ...order,
                            cart: order.cart.map(item =>
                                item.lineId === lineId
                                    ? {
                                        ...item,
                                        orderItemId,
                                    }
                                    : item
                            ),
                        },
                    },
                };
            }),


        updateLocalOrder: (
            orderId,
            data
        ) => {
            set(state => {
                const existing =
                    state.orders[orderId];

                if (!existing) {
                    return state;
                }

                const updatedOrder: LocalOrder = {
                    ...existing,
                    ...data,
                };

                const isActive =
                    state.activeOrderId ===
                    orderId;

                return {
                    orders: {
                        ...state.orders,

                        [orderId]:
                            updatedOrder,
                    },

                    cart:
                        isActive
                            ? updatedOrder.cart
                            : state.cart,

                    orderNote:
                        isActive
                            ? updatedOrder.orderNote
                            : state.orderNote,

                    orderDiscount:
                        isActive
                            ? updatedOrder.orderDiscount
                            : state.orderDiscount,

                    status:
                        isActive
                            ? updatedOrder.status
                            : state.status,
                };
            });
        },
    })
);
