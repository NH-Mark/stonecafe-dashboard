"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";


import { ArrowRight } from "lucide-react";

import { TopModifier } from "../../sales.types";
import { DataTable } from "@/components/data-table/data-table";
import { TopSellingModifiersColumns } from "./TopSellingModifiersColumns";


type Props = {
    data: TopModifier[];
};


export default function TopSellingModifiersDialog({
    data,
}: Props) {


    return (

        <Dialog>

            <DialogTrigger render={
                <button
                    className="
    flex
    h-9
    w-9
    items-center
    justify-center
    rounded-full
    bg-[#f3f3f3]
    transition
    hover:bg-[#ddcfbe]
    "
                >
                    <ArrowRight
                        className="
        h-5
        w-5
        text-[#a5765a]
        "
                    />
                </button>
            }>



            </DialogTrigger>



            <DialogContent
                className="
    !w-[95vw]
    !max-w-[1400px]
    !h-[85vh]
    overflow-hidden
    rounded-3xl
    border-[#d9d9d8]
    bg-[#ffffff]
    p-0
    shadow-2xl
    "
            >

                <div className="flex h-full flex-col">


                    {/* Modern Header */}

                    <DialogHeader
                        className="
            relative
            overflow-hidden
            border-b
            border-[#d9d9d8]
            bg-gradient-to-r
            from-[#40332a]
            to-[#8c6b52]
            px-8
            py-6
            "
                    >

                        <div
                            className="
                absolute
                right-0
                top-0
                h-32
                w-32
                rounded-full
                bg-white/10
                blur-2xl
                "
                        />


                        <div className="relative flex items-center justify-between">


                            <div>

                                <DialogTitle
                                    className="
                        text-2xl
                        font-bold
                        text-white
                        "
                                >
                                    Top Selling Modifiers
                                </DialogTitle>


                                <p
                                    className="
                        mt-1
                        text-sm
                        text-white/70
                        "
                                >
                                    Analyze modifier performance, revenue and profitability
                                </p>

                            </div>



                            <div
                                className="
                    rounded-xl
                    bg-white/15
                    px-4
                    py-2
                    backdrop-blur
                    "
                            >

                                <p
                                    className="
                        text-xs
                        text-white/70
                        "
                                >
                                    Total Items
                                </p>


                                <p
                                    className="
                        text-xl
                        font-bold
                        text-white
                        "
                                >
                                    {data.length}
                                </p>

                            </div>


                        </div>


                    </DialogHeader>



                    {/* Table */}

                    <div
                        className="
            flex-1
            overflow-auto
            bg-[#fafafa]
            p-6
            "
                    >


                        <div
                            className="
                overflow-hidden
                "
                        >

                            <DataTable
                                columns={TopSellingModifiersColumns()}
                                data={data}
                                searchKey="name"
                                placeholder="Search items..."

                            />

                        </div>


                    </div>


                </div>


            </DialogContent>


        </Dialog>

    );
}