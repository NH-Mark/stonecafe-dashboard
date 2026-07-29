import { create } from "zustand";
import { CartItem } from "../cart.types";
import { Discount } from "@/types/discount";


interface OrderStore {

    cart: CartItem[];

    orderNote: string;

    orderDiscount: {
        id:number;
        name:string;
        type:"percentage" | "fixed";
        value:number;
    } | null;

    setOrderNote: (
        note: string
    ) => void;


    applyOrderDiscount: (
        discount: {
            id:number;
            name:string;
            type:"percentage" | "fixed";
            value:number;
        }
    )=>void;


    removeOrderDiscount:()=>void;

    addItem: (item: CartItem) => void;

    removeItem: (lineId: string) => void;

    increaseQty: (lineId: string) => void;

    decreaseQty: (lineId: string) => void;

    updateItem: (
        lineId: string,
        data: Partial<CartItem>
    ) => void;

    applyDiscount: (
        lineId: string,
        discount: Discount
    ) => void;

    removeDiscount: (lineId: string) => void;

    clear: () => void;

}



function sameModifiers(
    a: any[],
    b: any[]
) {

    if (a.length !== b.length)
        return false;


    return a.every(mod =>

        b.some(
            x => x.id === mod.id
        )

    );

}



export const useOrderStore =
    create<OrderStore>((set) => ({


        cart: [],
        orderNote: "",

        orderDiscount: null,
        setOrderNote: (note) => set({
            orderNote: note
        }),
        applyOrderDiscount: (discount) => set({
            orderDiscount: discount
        }),
        removeOrderDiscount: () => set({
            orderDiscount: null
        }),

        addItem: (newItem) =>


            set(state => {


                const existing =
                    state.cart.find(item =>

                        item.menuItem.id ===
                        newItem.menuItem.id

                        &&

                        sameModifiers(
                            item.modifiers,
                            newItem.modifiers
                        )

                        &&

                        item.note === newItem.note

                    );



                if (existing) {


                    return {

                        cart:
                            state.cart.map(item =>

                                item.lineId === existing.lineId

                                    ?

                                    {

                                        ...item,

                                        quantity:
                                            item.quantity + newItem.quantity

                                    }

                                    :

                                    item

                            )

                    };

                }



                return {

                    cart: [
                        ...state.cart,
                        newItem
                    ]

                };


            }),






        removeItem: (lineId) =>

            set(state => ({

                cart:
                    state.cart.filter(
                        item =>
                            item.lineId !== lineId
                    )

            })),






        increaseQty: (lineId) =>

            set(state => ({

                cart:
                    state.cart.map(item =>

                        item.lineId === lineId

                            ?

                            {

                                ...item,

                                quantity: item.quantity + 1

                            }

                            :

                            item

                    )

            })),







        decreaseQty: (lineId) =>

            set(state => ({

                cart:
                    state.cart

                        .map(item =>

                            item.lineId === lineId

                                ?

                                {

                                    ...item,

                                    quantity: item.quantity - 1

                                }

                                :

                                item

                        )

                        .filter(
                            item => item.quantity > 0
                        )

            })),







        updateItem: (lineId, data) =>

            set(state => ({

                cart:
                    state.cart.map(item =>

                        item.lineId === lineId

                            ?

                            {

                                ...item,

                                ...data

                            }

                            :

                            item

                    )

            })),

        applyDiscount: (lineId, discount) =>

            set(state => ({

                cart:
                    state.cart.map(item =>

                        item.lineId === lineId

                            ?

                            {
                                ...item,
                                discount
                            }

                            :

                            item

                    )

            })),


        removeDiscount: (lineId) =>


            set(state => ({

                cart: state.cart.map(item =>

                    item.lineId === lineId

                        ?

                        {
                            ...item,
                            discount: null
                        }

                        :

                        item

                )

            })),






        clear: () => set({

            cart: [],
            orderNote: "",
            orderDiscount: null,

        })


    }));