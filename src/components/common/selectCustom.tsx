"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
    label: string;
    value: string;
};

type Props = {
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    options: Option[];
    className?: string;
};


export default function SelectCustom({
    value,
    onChange,
    placeholder = "Select",
    options,
    className,
}: Props) {


    const selected =
        options.find(
            item => item.value === value
        );


    return (

        <div className="relative">

            <select

                value={value ?? ""}

                onChange={(e)=>
                    onChange(e.target.value)
                }

                className={cn(
                    `
                    h-9
                    appearance-none
                    rounded-xl
                    border
                    bg-white
                    px-4
                    pr-10
                    text-sm
                    font-medium
                    text-[#40332a]
                    shadow-sm
                    outline-none

                    transition

                    hover:border-[#c3b6a4]

                    focus:border-[#40332a]
                    focus:ring-2
                    focus:ring-[#40332a]/20

                    cursor-pointer
                    `,
                    className
                )}

            >

                <option value="">
                    {placeholder}
                </option>


                {
                    options.map(option=>(

                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>

                    ))
                }


            </select>


            <ChevronDown
                className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-[#40332a]
                "
            />


        </div>

    );

}