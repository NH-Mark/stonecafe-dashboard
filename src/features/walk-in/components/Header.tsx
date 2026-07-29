"use client";

import {
    Search,
    Percent,
    MessageSquare,
    LayoutDashboard,
    Plus,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useState } from "react";
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



    return (

        <header
            className="
                shrink-0
                border-b
                bg-white
            "
        >

            <div
                className="
                    flex
                    flex-col
                    gap-3
                    p-3

                    lg:flex-row
                    lg:h-16
                    lg:items-center
                    lg:px-6
                "
            >


                {/* Logo */}

                <div
                    className="
                        shrink-0
                    "
                >

                    <h1
                        className="
                            text-lg
                            font-bold
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
                            hidden
                            text-sm
                            text-muted-foreground
                            lg:block
                        "
                    >
                        New Order
                    </p>

                </div>



                {/* Search */}

                <div
                    className="
                        relative
                        w-full

                        lg:mx-auto
                        lg:max-w-xl
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

                        onChange={(e) =>
                            setSearch(e.target.value)
                        }

                        placeholder="Search menu..."

                        className="
                            h-11
                            rounded-xl
                            pl-9
                        "

                    />

                </div>



                {/* Actions */}

                <div
                    className="
                        flex
                        items-center
                        justify-end
                        gap-2
                    "
                >

                    <Button
                        variant="outline"
                        size="icon"
                        className="lg:hidden"
                        onClick={() =>
                            setDiscountOpen(true)
                        }
                    >
                        <Percent className="h-5 w-5" />
                    </Button>


                    <Button
                        variant="outline"
                        className="
                            hidden
                            lg:flex
                        "
                        onClick={() =>
                            setDiscountOpen(true)
                        }
                    >
                        <Percent className="mr-2 h-4 w-4" />
                        Discount
                    </Button>



                    <Button
                        variant="outline"
                        size="icon"
                        className="lg:hidden"
                        onClick={() =>
                            setNoteOpen(true)
                        }
                    >
                        <MessageSquare className="h-5 w-5" />
                    </Button>


                    <Button
                        variant="outline"
                        className="
                            hidden
                            lg:flex
                        "
                        onClick={() =>
                            setNoteOpen(true)
                        }
                    >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Note
                    </Button>



                    <Button
                        size="icon"
                        className="lg:hidden"
                        onClick={newOrder}
                    >
                        <Plus className="h-5 w-5" />
                    </Button>


                    <Button
                        className="
                            hidden
                            lg:flex
                        "
                        onClick={newOrder}
                    >
                        New Order
                    </Button>



                    <Button
                        variant="outline"
                        size="icon"
                        className="lg:hidden"
                        onClick={() =>
                            router.push("/dashboard")
                        }
                    >
                        <LayoutDashboard className="h-5 w-5" />
                    </Button>


                    <Button
                        variant="outline"
                        className="
                            hidden
                            lg:flex
                        "
                        onClick={() =>
                            router.push("/dashboard")
                        }
                    >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
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

    );

}