"use client";

import { getDiscounts, listDiscounts } from "@/features/discount/discount.service";
import { Discount } from "@/types/discount";
import { useEffect, useState } from "react";

export function useDiscounts(){


    const [discounts,setDiscounts] =
        useState<Discount[]>([]);


    const [loading,setLoading] =
        useState(false);



    useEffect(()=>{

        load();

    },[]);



    async function load(){

        try{

            setLoading(true);


            const response =
                await listDiscounts();


            setDiscounts(
                response.data.data
            );


        }
        finally{

            setLoading(false);

        }

    }


    return {

        discounts,

        loading

    };


}