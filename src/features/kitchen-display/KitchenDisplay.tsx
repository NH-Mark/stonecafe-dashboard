"use client";


import {
    ChefHat,
    LayoutDashboard
} from "lucide-react";


import { useRouter } from "next/navigation";


import { KitchenBoard } from "./components/KitchenBoard";

import { useKitchenOrders } from "./hooks/useKitchenOrders";



export function KitchenDisplay(){


    const orders =
        useKitchenOrders();


    const router =
        useRouter();




    return (

        <div
            className="
            h-screen
            overflow-hidden
            bg-[#f3f3f3]
            p-3
            md:p-4
            "
        >


            <header
                className="
                flex
                h-16
                items-center
                justify-between
                rounded-2xl
                bg-white
                border
                border-[#d9d9d8]
                px-5
                shadow-sm
                "
            >


                <div>

                    <h1
                        className="
                        text-xl
                        md:text-2xl
                        font-bold
                        text-[#40332a]
                        "
                    >
                        Kitchen Display
                    </h1>


                    <p
                        className="
                        text-xs
                        md:text-sm
                        text-[#a5765f]
                        "
                    >
                        Live kitchen orders
                    </p>


                </div>





                <div
                    className="
                    flex
                    items-center
                    gap-3
                    "
                >


                    <button

                        onClick={()=>
                            router.push("/dashboard")
                        }

                        className="
                        flex
                        h-10
                        items-center
                        gap-2
                        rounded-xl
                        bg-[#40332a]
                        px-4
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-[#a5765f]
                        active:scale-95
                        "
                    >

                        <LayoutDashboard
                            className="
                            h-4
                            w-4
                            "
                        />


                        Dashboard


                    </button>





                    <div
                        className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-[#ddcfbe]
                        "
                    >

                        <ChefHat
                            className="
                            h-6
                            w-6
                            text-[#40332a]
                            "
                        />

                    </div>


                </div>



            </header>





            <main
                className="
                mt-3
                h-[calc(100vh-88px)]
                "
            >

                <KitchenBoard
                    orders={orders}
                />
            </main>



        </div>

    );

}