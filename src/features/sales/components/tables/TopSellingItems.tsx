"use client";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import {
    Sparkles,
    TrendingUp
} from "lucide-react";
import { TopItem } from "../../sales.types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import TopSellingItemsDialog from "../dialogs/TopSellingItemsDialog";


type Props = {
    data: TopItem[];
};

export default function TopSellingItems({
    data
}: Props) {
    return (
        <Card
            className="
            rounded-xl
            border-[#d9d9d8]
            bg-white
            "
        >

            <CardContent
                className="
                p-4
                "
            >


                {/* Header */}

                <div
                    className="
                    mb-4
                    flex
                    items-center
                    justify-between
                    "
                >

                    <div
                        className="
                        flex
                        items-center
                        gap-2
                        "
                    >

                        <div
                            className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#ddcfbe]
                            "
                        >

                            <Sparkles
                                className="
                                h-4
                                w-4
                                text-[#40332a]
                                "
                            />

                        </div>
                        <div>

                            <h3
                                className="
                                font-semibold
                                text-[#40332a]
                                "
                            >
                                Top Selling Items
                            </h3>


                            <p
                                className="
                                text-xs
                                text-muted-foreground
                                "
                            >
                                Best performing items
                            </p>


                        </div>


                    </div>


                    <TopSellingItemsDialog data={data} />

                </div>




                {/* List */}

                <div
                    className="
                    space-y-3
                    "
                >


                    {
                        data.length === 0 && (

                            <p
                                className="
                                py-6
                                text-center
                                text-sm
                                text-muted-foreground
                                "
                            >
                                No items found
                            </p>

                        )
                    }



                    {
                        data.slice(0, 5).map((item, index) => (


                            <div

                                key={item.name}

                                className="
                                flex
                                items-center
                                justify-between
                                rounded-lg
                                bg-[#f3f3f3]
                                px-3
                                py-3
                                transition
                                hover:bg-[#ddcfbe]
                                "

                            >


                                <div
                                    className="
                                    flex
                                    items-center
                                    gap-3
                                    "
                                >


                                    <span
                                        className="
                                        flex
                                        h-7
                                        w-7
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-white
                                        text-xs
                                        font-semibold
                                        text-[#40332a]
                                        "
                                    >
                                        {index + 1}
                                    </span>



                                    <div>

                                        <p
                                            className="
                                            font-medium
                                            text-[#40332a]
                                            "
                                        >
                                            {item.name}
                                        </p>


                                        <p
                                            className="
                                            text-xs
                                            text-muted-foreground
                                            "
                                        >
                                            Qty {item.qty}
                                        </p>


                                    </div>


                                </div>





                                <div
                                    className="
                                    text-right
                                    "
                                >

                                    <p
                                        className="
                                        font-semibold
                                        text-[#40332a]
                                        "
                                    >
                                        QAR {item.sales.toFixed(2)}
                                    </p>


                                    <p
                                        className="
                                        text-xs
                                        text-muted-foreground
                                        "
                                    >
                                        Revenue
                                    </p>


                                </div>



                            </div>


                        ))
                    }


                </div>



            </CardContent>


        </Card>

    );
}