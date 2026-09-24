"use client"

import { useEffect, useState } from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
    Plus,
    Trash2,
    Minus,
} from "lucide-react"

import {
    Order,
    OrderItem,
} from "../../orders.types"

import { listMenuItems } from "@/features/menu/menu.service"
import { listDiscounts } from "@/features/discount/discount.service"

import { MenuItem } from "@/types/menu-item"
import { Modifier } from "@/types/modifier"
import { Discount } from "@/types/discount"
import { calculateDiscountAmount } from "../../utils/order-pricing"

interface OrderItemsCardProps {
    order: Order
    onChange: (order: Order) => void
}

function recalculateItemDiscounts(
    item: OrderItem,
    quantity = item.quantity,
    unitPrice = item.unit_price,
    modifiers = item.modifiers
): OrderItem["discounts"] {
    const grossTotal =
        (
            Number(unitPrice || 0) +
            modifiers.reduce(
                (sum, modifier) =>
                    sum +
                    Number(modifier.price || 0) *
                        Number(
                            modifier.quantity || 1
                        ),
                0
            )
        ) *
        Number(quantity || 0)

    return item.discounts.map(
        discount => ({
            ...discount,
            amount:
                calculateDiscountAmount(
                    grossTotal,
                    discount.type,
                    Number(
                        discount.value || 0
                    )
                ),
        })
    )
}

export default function OrderItemsCard({
    order,
    onChange,
}: OrderItemsCardProps) {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [discounts, setDiscounts] = useState<Discount[]>([])

    const [loadingMenuItems, setLoadingMenuItems] =
        useState(false)

    const [loadingDiscounts, setLoadingDiscounts] =
        useState(false)

    useEffect(() => {
        loadMenuItems()
        loadDiscounts()
    }, [])

    async function loadMenuItems() {
        try {
            setLoadingMenuItems(true)

            const response = await listMenuItems()

            const data =
                response.data?.data ??
                response.data ??
                []

            setMenuItems(data)
        } catch (error) {
            console.error(
                "Failed to load menu items:",
                error
            )
        } finally {
            setLoadingMenuItems(false)
        }
    }

    async function loadDiscounts() {
        try {
            setLoadingDiscounts(true)

            const response = await listDiscounts()

            const data =
                response.data?.data ??
                response.data ??
                []

            setDiscounts(data)
        } catch (error) {
            console.error(
                "Failed to load discounts:",
                error
            )
        } finally {
            setLoadingDiscounts(false)
        }
    }

    function updateItem(
        index: number,
        updates: Partial<OrderItem>
    ) {
        const items = order.items.map(
            (item, itemIndex) =>
                itemIndex === index
                    ? {
                        ...item,
                        ...updates,
                    }
                    : item
        )

        onChange({
            ...order,
            items,
        })
    }

    function removeItem(index: number) {
        onChange({
            ...order,
            items: order.items.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            ),
        })
    }

    function increaseQuantity(index: number) {
        const item = order.items[index]

        updateItem(index, {
            quantity: item.quantity + 1,
        })
    }

    function decreaseQuantity(index: number) {
        const item = order.items[index]

        if (item.quantity <= 1) {
            return
        }

        updateItem(index, {
            quantity: item.quantity - 1,
        })
    }

    /**
     * Select menu item.
     *
     * Automatically updates:
     * - menu_item_id
     * - menu_item
     * - unit_price
     *
     * Modifiers are cleared because they belong
     * to the previously selected menu item.
     */
    function handleMenuItemChange(
        itemIndex: number,
        menuItemId: string
    ) {
        const menuItem = menuItems.find(
            item =>
                String(item.id) ===
                menuItemId
        )

        if (!menuItem) {
            updateItem(itemIndex, {
                menu_item_id: undefined,
                menu_item: "",
                unit_price: 0,
                modifiers: [],
            })

            return
        }

        updateItem(itemIndex, {
            menu_item_id: menuItem.id,
            menu_item: menuItem.name,
            unit_price:
                Number(menuItem.price) || 0,
            modifiers: [],
        })
    }

    /**
     * Get all modifiers belonging to the
     * selected menu item.
     */
    function getAvailableModifiers(item: OrderItem): Modifier[] {
        if (!item.menu_item_id) {
            return []
        }

        const menuItem = menuItems.find(
            menuItem => Number(menuItem.id) === Number(item.menu_item_id)
        )

        if (!menuItem?.modifier_groups) {
            return []
        }

        return menuItem.modifier_groups.flatMap(
            group => group.modifiers ?? []
        )
    }

    function addModifier(index: number) {
        const item = order.items[index]

        updateItem(index, {
            modifiers: [
                ...item.modifiers,
                {
                    id: undefined,
                    modifier: "",
                    quantity: 1,
                    price: 0,
                },
            ],
        })
    }

    /**
     * Select modifier from the selected menu
     * item's modifier groups.
     */
    function updateModifier(
        itemIndex: number,
        modifierIndex: number,
        modifierId: string
    ) {
        const item = order.items[itemIndex]

        const selectedModifier =
            getAvailableModifiers(item).find(
                modifier =>
                    String(modifier.id) ===
                    modifierId
            )

        if (!selectedModifier) {
            return
        }

        const modifiers =
            item.modifiers.map(
                (modifier, index) =>
                    index === modifierIndex
                        ? {
                            ...modifier,
                            id: selectedModifier.id,
                            modifier:
                                selectedModifier.name,
                            price:
                                Number(
                                    selectedModifier.price
                                ) || 0,
                        }
                        : modifier
            )

        updateItem(itemIndex, {
            modifiers,
        })
    }

    function removeModifier(
        itemIndex: number,
        modifierIndex: number
    ) {
        const item = order.items[itemIndex]

        updateItem(itemIndex, {
            modifiers:
                item.modifiers.filter(
                    (_, index) =>
                        index !== modifierIndex
                ),
        })
    }

    /**
     * Add an empty discount row.
     */
    function addDiscount(index: number) {
        const item = order.items[index]

        updateItem(index, {
            discounts: [
                ...item.discounts,
                {
                    id: 0,
                    name: "",
                    type: "fixed",
                    value: 0,
                    amount: 0,
                },
            ],
        })
    }

    /**
     * Select discount from the discount API.
     *
     * The API provides:
     *
     * {
     *   id,
     *   name,
     *   type: "percentage" | "fixed",
     *   value
     * }
     *
     * amount is calculated from the item's
     * gross total.
     */
    function updateDiscount(
        itemIndex: number,
        discountIndex: number,
        discountId: string
    ) {
        const item = order.items[itemIndex]

        const selectedDiscount =
            discounts.find(
                discount =>
                    String(discount.id) ===
                    discountId
            )

        if (!selectedDiscount) {
            return
        }

        const discountData =
            selectedDiscount as Discount & {
                type?: "percentage" | "fixed"
                value?: number | string
            }

        const type: "percentage" | "fixed" =
            discountData.type === "percentage"
                ? "percentage"
                : "fixed"

        const value =
            Number(
                discountData.value ?? 0
            ) || 0

        const grossTotal =
            getGrossTotal(item)

        const amount =
            calculateDiscountAmount(
                grossTotal,
                type,
                value
            )

        const itemDiscounts =
            item.discounts.map(
                (discount, index) =>
                    index === discountIndex
                        ? {
                            ...discount,
                            id: selectedDiscount.id,
                            name:
                                selectedDiscount.name,
                            type,
                            value,
                            amount,
                        }
                        : discount
            )

        updateItem(itemIndex, {
            discounts: itemDiscounts,
        })
    }

    /**
     * Change the discount value.
     *
     * For percentage:
     *     25 means 25%
     *
     * For fixed:
     *     5 means QAR 5
     */
    function updateDiscountValue(
        itemIndex: number,
        discountIndex: number,
        value: string
    ) {
        const item = order.items[itemIndex]

        const numericValue =
            Number(value) || 0

        const discounts =
            item.discounts.map(
                (discount, index) => {
                    if (
                        index !==
                        discountIndex
                    ) {
                        return discount
                    }

                    const amount =
                        calculateDiscountAmount(
                            getGrossTotal(
                                item
                            ),
                            discount.type,
                            numericValue
                        )

                    return {
                        ...discount,
                        value:
                            numericValue,
                        amount,
                    }
                }
            )

        updateItem(itemIndex, {
            discounts,
        })
    }

    function removeDiscount(
        itemIndex: number,
        discountIndex: number
    ) {
        const item = order.items[itemIndex]

        updateItem(itemIndex, {
            discounts:
                item.discounts.filter(
                    (_, index) =>
                        index !== discountIndex
                ),
        })
    }

   function getModifierTotal(
        item: OrderItem
    ): number {
        return item.modifiers.reduce(
            (sum, modifier) =>
                sum +
                Number(modifier.price || 0) *
                Number(modifier.quantity || 1),
            0
        )
    }

    function getGrossTotal(
        item: OrderItem
    ): number {
        return (
            (
                Number(
                    item.unit_price || 0
                ) +
                getModifierTotal(item)
            ) *
            Number(item.quantity || 0)
        )
    }

    /**
     * Calculate the monetary discount amount
     * based on the discount type.
     */
    function calculateDiscountAmount(
        grossTotal: number,
        type:
            | "percentage"
            | "fixed",
        value: number
    ): number {
        if (grossTotal <= 0 || value <= 0) {
            return 0
        }

        if (type === "percentage") {
            return Math.min(
                grossTotal,
                (grossTotal * value) / 100
            )
        }

        return Math.min(
            grossTotal,
            value
        )
    }

    /**
     * Always calculate the discount from
     * type/value instead of trusting amount.
     */
    function getDiscountTotal(
        item: OrderItem
    ): number {
        const grossTotal =
            getGrossTotal(item)

        return item.discounts.reduce(
            (sum, discount) =>
                sum +
                calculateDiscountAmount(
                    grossTotal,
                    discount.type,
                    Number(
                        discount.value || 0
                    )
                ),
            0
        )
    }

    function getNetTotal(
        item: OrderItem
    ): number {
        return Math.max(
            getGrossTotal(item) -
            getDiscountTotal(item),
            0
        )
    }

    function addItem() {
        const newItem: OrderItem = {
            id: 0,

            menu_item_id: undefined,
            menu_item: "",

            quantity: 1,

            unit_price: 0,
            total_price: 0,

            notes: "",

            modifiers: [],
            discounts: [],
        }

        onChange({
            ...order,
            items: [
                ...order.items,
                newItem,
            ],
        })
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle>
                            Order Items
                        </CardTitle>

                        <CardDescription>
                            Manage items, quantities,
                            modifiers, discounts and
                            notes.
                        </CardDescription>
                    </div>

                    <Button
                        type="button"
                        onClick={addItem}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                {order.items.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            No items have been added
                            to this order.
                        </p>

                        <Button
                            type="button"
                            variant="outline"
                            className="mt-4"
                            onClick={addItem}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add First Item
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full min-w-[1200px] text-sm">
                            <thead className="bg-muted/50">
                                <tr className="border-b">
                                    <th className="px-4 py-3 text-left font-medium">
                                        Item
                                    </th>

                                    <th className="w-[140px] px-4 py-3 text-center font-medium">
                                        Qty
                                    </th>

                                    <th className="w-[130px] px-4 py-3 text-right font-medium">
                                        Unit Price
                                    </th>

                                    <th className="w-[280px] px-4 py-3 text-left font-medium">
                                        Modifiers
                                    </th>

                                    <th className="w-[260px] px-4 py-3 text-left font-medium">
                                        Discount
                                    </th>

                                    <th className="w-[220px] px-4 py-3 text-left font-medium">
                                        Notes
                                    </th>

                                    <th className="w-[130px] px-4 py-3 text-right font-medium">
                                        Total
                                    </th>

                                    <th className="w-[60px] px-4 py-3" />
                                </tr>
                            </thead>

                            <tbody>
                                {order.items.map(
                                    (
                                        item,
                                        itemIndex
                                    ) => {
                                        const availableModifiers =
                                            getAvailableModifiers(
                                                item
                                            )

                                        return (
                                            <tr
                                                key={`${item.id}-${itemIndex}`}
                                                className="border-b last:border-0 align-top"
                                            >
                                                {/* ITEM */}
                                                <td className="p-4">
                                                    <div className="space-y-2">
                                                        <select
                                                            value={
                                                                item.menu_item_id
                                                                    ? String(
                                                                        item.menu_item_id
                                                                    )
                                                                    : ""
                                                            }
                                                            onChange={e =>
                                                                handleMenuItemChange(
                                                                    itemIndex,
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="w-full rounded-md border bg-background p-2"
                                                        >
                                                            <option value="">
                                                                {loadingMenuItems
                                                                    ? "Loading items..."
                                                                    : "Select item"}
                                                            </option>

                                                            {menuItems.map(
                                                                menuItem => (
                                                                    <option
                                                                        key={
                                                                            menuItem.id
                                                                        }
                                                                        value={String(
                                                                            menuItem.id
                                                                        )}
                                                                    >
                                                                        {
                                                                            menuItem.name
                                                                        }{" "}
                                                                        -{" "}
                                                                        {Number(
                                                                            menuItem.price
                                                                        ).toFixed(
                                                                            2
                                                                        )}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>

                                                        {/* {item.menu_item && (
                                                            <p className="text-xs text-muted-foreground">
                                                                {
                                                                    item.menu_item
                                                                }
                                                            </p>
                                                        )} */}

                                                        <p className="text-xs text-muted-foreground">
                                                            Item #
                                                            {itemIndex +
                                                                1}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* QUANTITY */}
                                                <td className="p-4">
                                                    <div className="flex items-center justify-center">
                                                        <div className="flex items-center rounded-md border">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() =>
                                                                    decreaseQuantity(
                                                                        itemIndex
                                                                    )
                                                                }
                                                                disabled={
                                                                    item.quantity <=
                                                                    1
                                                                }
                                                            >
                                                                <Minus className="h-3.5 w-3.5" />
                                                            </Button>

                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                value={
                                                                    item.quantity
                                                                }
                                                                onChange={e =>
                                                                    updateItem(
                                                                        itemIndex,
                                                                        {
                                                                            quantity:
                                                                                Math.max(
                                                                                    1,
                                                                                    Number(
                                                                                        e.target.value
                                                                                    ) ||
                                                                                    1
                                                                                ),
                                                                        }
                                                                    )
                                                                }
                                                                className="h-8 w-14 border-0 px-1 text-center focus-visible:ring-0"
                                                            />

                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() =>
                                                                    increaseQuantity(
                                                                        itemIndex
                                                                    )
                                                                }
                                                            >
                                                                <Plus className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* UNIT PRICE */}
                                                <td className="p-4">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={
                                                            item.unit_price
                                                        }
                                                        onChange={e =>
                                                            updateItem(
                                                                itemIndex,
                                                                {
                                                                    unit_price:
                                                                        Number(
                                                                            e.target.value
                                                                        ) ||
                                                                        0,
                                                                }
                                                            )
                                                        }
                                                        className="text-right"
                                                    />
                                                </td>

                                                {/* MODIFIERS */}
                                                <td className="p-4">
                                                    <div className="space-y-2">
                                                        {item.modifiers.map(
                                                            (modifier, modifierIndex) => {
                                                                const availableModifiers =
                                                                    getAvailableModifiers(item)

                                                                return (
                                                                    <div
                                                                        key={modifierIndex}
                                                                        className="flex items-center gap-2"
                                                                    >
                                                                        <select
                                                                            value={
                                                                                modifier.id
                                                                                    ? String(modifier.id)
                                                                                    : ""
                                                                            }
                                                                            onChange={e =>
                                                                                updateModifier(
                                                                                    itemIndex,
                                                                                    modifierIndex,
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            className="min-w-0 flex-1 rounded-md border bg-background p-2"
                                                                            disabled={
                                                                                !item.menu_item_id ||
                                                                                availableModifiers.length === 0
                                                                            }
                                                                        >
                                                                            <option value="">
                                                                                {!item.menu_item_id
                                                                                    ? "Select item first"
                                                                                    : availableModifiers.length === 0
                                                                                        ? "No modifiers"
                                                                                        : "Select modifier"}
                                                                            </option>

                                                                            {availableModifiers.map(
                                                                                modifierOption => (
                                                                                    <option
                                                                                        key={modifierOption.id}
                                                                                        value={String(
                                                                                            modifierOption.id
                                                                                        )}
                                                                                    >
                                                                                        {modifierOption.name} -{" "}
                                                                                        {Number(
                                                                                            modifierOption.price
                                                                                        ).toFixed(2)}
                                                                                    </option>
                                                                                )
                                                                            )}
                                                                        </select>

                                                                        {/* <Input
                                                                            type="number"
                                                                            min="0"
                                                                            step="0.01"
                                                                            value={modifier.price}
                                                                            onChange={e => {
                                                                                const modifiers =
                                                                                    item.modifiers.map(
                                                                                        (
                                                                                            currentModifier,
                                                                                            currentIndex
                                                                                        ) =>
                                                                                            currentIndex ===
                                                                                                modifierIndex
                                                                                                ? {
                                                                                                    ...currentModifier,
                                                                                                    price:
                                                                                                        Number(
                                                                                                            e.target.value
                                                                                                        ) || 0,
                                                                                                }
                                                                                                : currentModifier
                                                                                    )

                                                                                updateItem(itemIndex, {
                                                                                    modifiers,
                                                                                })
                                                                            }}
                                                                            className="w-24"
                                                                        /> */}

                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="shrink-0 text-destructive"
                                                                            onClick={() =>
                                                                                removeModifier(
                                                                                    itemIndex,
                                                                                    modifierIndex
                                                                                )
                                                                            }
                                                                        >
                                                                            <Trash2 className="h-3.5 w-3.5" />
                                                                        </Button>
                                                                    </div>
                                                                )
                                                            }
                                                        )}

                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => addModifier(itemIndex)}
                                                            disabled={
                                                                !item.menu_item_id ||
                                                                getAvailableModifiers(item).length === 0
                                                            }
                                                        >
                                                            <Plus className="mr-1 h-3.5 w-3.5" />
                                                            Modifier
                                                        </Button>
                                                    </div>
                                                </td>

                                                {/* DISCOUNT */}
                                                <td className="p-4">
                                                    <div className="space-y-2">
                                                        {item.discounts.map(
                                                            (discount, discountIndex) => {
                                                                const calculatedAmount =
                                                                    calculateDiscountAmount(
                                                                        getGrossTotal(item),
                                                                        discount.type,
                                                                        Number(discount.value || 0)
                                                                    )

                                                                return (
                                                                    <div
                                                                        key={discountIndex}
                                                                        className="flex items-center gap-2"
                                                                    >
                                                                        <select
                                                                            value={
                                                                                discount.id
                                                                                    ? String(discount.id)
                                                                                    : ""
                                                                            }
                                                                            onChange={e =>
                                                                                updateDiscount(
                                                                                    itemIndex,
                                                                                    discountIndex,
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            className="min-w-0 flex-1 rounded-md border bg-background p-2"
                                                                            disabled={loadingDiscounts}
                                                                        >
                                                                            <option value="">
                                                                                {loadingDiscounts
                                                                                    ? "Loading discounts..."
                                                                                    : "Select discount"}
                                                                            </option>

                                                                            {discounts.map(
                                                                                discountOption => (
                                                                                    <option
                                                                                        key={discountOption.id}
                                                                                        value={String(
                                                                                            discountOption.id
                                                                                        )}
                                                                                    >
                                                                                        {discountOption.name} (
                                                                                        {discountOption.type ===
                                                                                            "percentage"
                                                                                            ? `${discountOption.value}%`
                                                                                            : `QAR ${discountOption.value}`}
                                                                                        )
                                                                                    </option>
                                                                                )
                                                                            )}
                                                                        </select>

                                                                        {/* <div className="text-sm whitespace-nowrap text-muted-foreground">
                                                                            {discount.id > 0
                                                                                ? `-${calculatedAmount.toFixed(2)} QAR`
                                                                                : ""}
                                                                        </div> */}

                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="shrink-0 text-destructive"
                                                                            onClick={() =>
                                                                                removeDiscount(
                                                                                    itemIndex,
                                                                                    discountIndex
                                                                                )
                                                                            }
                                                                        >
                                                                            <Trash2 className="h-3.5 w-3.5" />
                                                                        </Button>
                                                                    </div>
                                                                )
                                                            }
                                                        )}

                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => addDiscount(itemIndex)}
                                                            disabled={loadingDiscounts}
                                                        >
                                                            <Plus className="mr-1 h-3.5 w-3.5" />
                                                            Discount
                                                        </Button>
                                                    </div>
                                                </td>

                                                {/* NOTES */}
                                                <td className="p-4">
                                                    <Textarea
                                                        value={
                                                            item.notes ??
                                                            ""
                                                        }
                                                        onChange={e =>
                                                            updateItem(
                                                                itemIndex,
                                                                {
                                                                    notes: e
                                                                        .target
                                                                        .value,
                                                                }
                                                            )
                                                        }
                                                        placeholder="Item notes..."
                                                        rows={3}
                                                        className="resize-none"
                                                    />
                                                </td>

                                                {/* TOTAL */}
                                                <td className="p-4 text-right">
                                                    <div className="space-y-1">
                                                        <div className="font-semibold">
                                                            {getNetTotal(
                                                                item
                                                            ).toFixed(
                                                                2
                                                            )}
                                                        </div>

                                                        {getDiscountTotal(
                                                            item
                                                        ) >
                                                            0 && (
                                                                <div className="text-xs text-muted-foreground">
                                                                    <span className="line-through">
                                                                        {getGrossTotal(
                                                                            item
                                                                        ).toFixed(
                                                                            2
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )}

                                                        {getDiscountTotal(
                                                            item
                                                        ) >
                                                            0 && (
                                                                <div className="text-xs text-destructive">
                                                                    -
                                                                    {getDiscountTotal(
                                                                        item
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                </div>
                                                            )}
                                                    </div>
                                                </td>

                                                {/* DELETE */}
                                                <td className="p-4">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive"
                                                        onClick={() =>
                                                            removeItem(
                                                                itemIndex
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    }
                                )}
                            </tbody>

                            <tfoot className="bg-muted/30">
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-3 text-right text-sm text-muted-foreground"
                                    >
                                        Items Subtotal
                                    </td>

                                    <td className="px-4 py-3 text-right font-medium">
                                        {order.items
                                            .reduce(
                                                (sum, item) =>
                                                    sum + getGrossTotal(item),
                                                0
                                            )
                                            .toFixed(2)}
                                    </td>

                                    <td />
                                </tr>

                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-3 text-right text-sm text-muted-foreground"
                                    >
                                        Discount
                                    </td>

                                    <td className="px-4 py-3 text-right font-medium text-destructive">
                                        -
                                        {order.items
                                            .reduce(
                                                (sum, item) =>
                                                    sum + getDiscountTotal(item),
                                                0
                                            )
                                            .toFixed(2)}
                                    </td>

                                    <td />
                                </tr>

                                <tr className="border-t">
                                    <td
                                        colSpan={6}
                                        className="px-4 py-4 text-right font-semibold"
                                    >
                                        Items Total
                                    </td>

                                    <td className="px-4 py-4 text-right text-lg font-bold">
                                        {Math.max(
                                            order.items.reduce(
                                                (sum, item) =>
                                                    sum + getGrossTotal(item),
                                                0
                                            ) -
                                            order.items.reduce(
                                                (sum, item) =>
                                                    sum + getDiscountTotal(item),
                                                0
                                            ),
                                            0
                                        ).toFixed(2)}
                                    </td>

                                    <td />
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}