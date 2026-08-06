"use client";


import {
    useEffect,
    useState
} from "react";


import { getEcho } from "@/lib/echo";

import { getKitchenOrders } from "../services/kitchen.service";

import { KitchenOrder } from "../kitchen.types";



export function useKitchenOrders(){


    const [orders,setOrders] =
        useState<KitchenOrder[]>([]);



    useEffect(()=>{


        async function load(){

            const data =
                await getKitchenOrders();


            setOrders(data);

        }


        load();



        const echo =
            getEcho();


        if(!echo)
            return;



        const channel =
            echo.channel("kitchen");




        // New Order

        channel.listen(
            ".order.created",
            (event:any)=>{


                const newOrder =
                    event.order;



                setOrders(prev=>{


                    const exists =
                        prev.some(
                            item =>
                            item.id === newOrder.id
                        );



                    if(exists)
                        return prev;



                    return [

                        ...prev,

                        newOrder

                    ];


                });


            }
        );





        // Status Update

        channel.listen(
            ".order.updated",
            (event:any)=>{


                const updatedOrder =
                    event.order;



                setOrders(prev=>{


                    return prev.map(
                        item =>

                        item.id === updatedOrder.id

                        ?
                        updatedOrder

                        :
                        item

                    );


                });


            }
        );





        return()=>{


            echo.leave(
                "kitchen"
            );


        };



    },[]);



    return orders;


}