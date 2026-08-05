"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FoodSymbol } from "@/types/food-symbol";
import { imageUrl } from "@/utils/image";

import {
    Check
} from "lucide-react";

import {
    useState
} from "react";


interface Props {

    symbols:FoodSymbol[];

    selectedSymbols:number[];

    onChange:(ids:number[])=>void;

}



export default function FoodSymbolsCard({

    symbols,

    selectedSymbols,

    onChange

}:Props){



    function toggle(id:number){


        if(selectedSymbols.includes(id)){


            onChange(
                selectedSymbols.filter(
                    x=>x !== id
                )
            );


        }else{


            onChange([
                ...selectedSymbols,
                id
            ]);


        }

    }



    return (

        <Card>


            <CardHeader>


                <CardTitle>
                    Food Symbols
                </CardTitle>


                <CardDescription>
                    Mark dietary and food characteristics.
                </CardDescription>


            </CardHeader>



            <CardContent>


                {
                    symbols.length === 0 ? (

                        <div
                            className="
                            border
                            border-dashed
                            rounded-lg
                            p-6
                            text-center
                            text-sm
                            text-muted-foreground
                            "
                        >

                            No food symbols available.

                        </div>


                    ) : (


                        <div
                            className="
                            grid
                            grid-cols-2
                            md:grid-cols-3
                            gap-3
                            "
                        >

                            {
                                symbols.map(symbol=>(


                                    <button

                                        key={symbol.id}

                                        type="button"

                                        onClick={() =>
                                            toggle(symbol.id)
                                        }


                                        className={`
                                        flex
                                        items-center
                                        gap-3
                                        rounded-lg
                                        border
                                        p-3
                                        text-left
                                        transition
                                        hover:bg-muted

                                        ${
                                            selectedSymbols.includes(symbol.id)
                                            ?
                                            "border-primary bg-primary/5"
                                            :
                                            ""
                                        }

                                        `}

                                    >


                                        {
                                            symbol.icon && (

                                                <img

                                                    src={imageUrl(symbol.icon)}

                                                    className="
                                                    h-8
                                                    w-8
                                                    rounded
                                                    object-contain
                                                    "

                                                />

                                            )
                                        }



                                        <span
                                            className="
                                            flex-1
                                            text-sm
                                            font-medium
                                            "
                                        >

                                            {symbol.name}

                                        </span>



                                        {
                                            selectedSymbols.includes(symbol.id)
                                            &&

                                            <Check
                                                className="
                                                h-4
                                                w-4
                                                text-primary
                                                "
                                            />

                                        }


                                    </button>


                                ))
                            }


                        </div>


                    )
                }


            </CardContent>


        </Card>

    );

}