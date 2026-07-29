"use client";


import {
    Search,
    Percent,
    MessageSquare,
    LayoutDashboard
} from "lucide-react";


import {
    Input
} from "@/components/ui/input";


import {
    Button
} from "@/components/ui/button";


import {
    useState
} from "react";


import { useRouter } from "next/navigation";


import { DiscountDialog } from "./discount/DiscountDialog";
import { OrderNoteDialog } from "./order/OrderNoteDialog";

import { useMenuSearch } from "../store/useMenuSearch";
import { useOrderStore } from "../store/useOrderStore";



export function Header() {


    const router = useRouter();


    const [noteOpen, setNoteOpen] =
        useState(false);


    const [discountOpen, setDiscountOpen] =
        useState(false);



    const clear =
        useOrderStore(
            state => state.clear
        );



    const search =
        useMenuSearch(
            state => state.search
        );


    const setSearch =
        useMenuSearch(
            state => state.setSearch
        );



    function newOrder() {

        clear();

        setSearch("");

    }



    function goDashboard() {

        router.push("/dashboard");

    }




    return (

        <header
            className="
border-b
bg-white
"
        >


            <div
                className="
flex
h-16
items-center
justify-between
px-6
gap-6
"
            >



                <div>

                    <h1 className="text-xl font-bold">
                        Walk-In POS
                    </h1>


                    <p className="text-sm text-muted-foreground">
                        New Order
                    </p>


                </div>





                <div className="relative w-[420px]">


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

                        onChange={(e) =>
                            setSearch(e.target.value)
                        }

                        placeholder="Search menu..."

                        className="
pl-9
h-11
rounded-xl
"

                    />


                </div>






                <div
                    className="
flex
items-center
gap-2
"
                >



                    <Button

                        variant="outline"

                        onClick={() =>
                            setDiscountOpen(true)
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





                    <Button

                        variant="outline"

                        onClick={() =>
                            setNoteOpen(true)
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


                    <Button

                        onClick={newOrder}

                    >

                        New Order

                    </Button>

                    <Button

                        variant="outline"

                        onClick={goDashboard}

                    >

                        <LayoutDashboard
                            className="
mr-2
h-4
w-4
"
                        />

                        Go Dashboard

                    </Button>








                </div>



            </div>






            <OrderNoteDialog

                open={noteOpen}

                onClose={() =>
                    setNoteOpen(false)
                }

            />



            <DiscountDialog

                open={discountOpen}

                onClose={() =>
                    setDiscountOpen(false)
                }

                type="order"

            />



        </header>


    )

}