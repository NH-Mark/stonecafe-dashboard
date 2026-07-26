"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";

import { SalesDashboardFilters } from "../../sales.schema";
import SelectCustom from "@/components/common/selectCustom";
import { Location } from "@/types/location";
import { OrderType } from "@/types/order-type";

const ranges = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This Week", value: "this_week" },
    { label: "This Month", value: "this_month" },
    { label: "Last Month", value: "last_month" },
    { label: "Custom", value: "custom" },
];

type Props = {
    orderTypes: OrderType[],
    locations: Location[],
    filters: SalesDashboardFilters;
    onChange: (filters: SalesDashboardFilters) => void;
};

export default function SalesFilters({
    orderTypes,
    locations,
    filters,
    onChange,
}: Props) {
    const [date, setDate] = useState<DateRange>();

    return (
        <div
            className="
                    flex flex-col gap-4
                    rounded-2xl border bg-background p-4
                    lg:flex-row lg:items-center lg:justify-between
                "
        >
            {/* Quick Date Filters */}
            <div
                className="
                        flex flex-wrap items-center gap-2
                        rounded-xl bg-muted p-1
                    "
            >
                {ranges.map((item) => (
                    <button
                        key={item.value}
                        onClick={() =>
                            onChange({
                                ...filters,
                                range: item.value,
                                ...(item.value !== "custom"
                                    ? {
                                        start_date: undefined,
                                        end_date: undefined,
                                    }
                                    : {}),
                            })
                        }
                        className={`
                                rounded-lg px-4 py-2
                                text-sm font-medium transition

                                ${filters.range === item.value
                                ? "bg-white shadow text-[#40332a]"
                                : "text-muted-foreground hover:text-foreground"
                            }
                            `}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Right Filters */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Custom Date */}
                {filters.range === "custom" && (
                    <Popover>
                        <PopoverTrigger render={
                            <Button
                                variant="outline"
                                className="w-[270px] justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4" />

                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(
                                                    date.from,
                                                    "dd MMM yyyy"
                                                )}{" "}
                                                -{" "}
                                                {format(
                                                    date.to,
                                                    "dd MMM yyyy"
                                                )}
                                            </>
                                        ) : (
                                            format(
                                                date.from,
                                                "dd MMM yyyy"
                                            )
                                        )
                                    ) : (
                                        "Select Date Range"
                                    )}
                                </div>

                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        } />


                        <PopoverContent
                            align="end"
                            className="w-auto p-0"
                        >
                            <Calendar
                                mode="range"
                                numberOfMonths={2}
                                selected={date}
                                onSelect={(range) => {
                                    setDate(range);

                                    onChange({
                                        ...filters,
                                        range: "custom",
                                        start_date: range?.from
                                            ? format(
                                                range.from,
                                                "yyyy-MM-dd"
                                            )
                                            : undefined,
                                        end_date: range?.to
                                            ? format(
                                                range.to,
                                                "yyyy-MM-dd"
                                            )
                                            : undefined,
                                    });
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                )}


                <SelectCustom

                    value={
                        filters.location_id
                            ?
                            String(filters.location_id)
                            :
                            ""
                    }


                    onChange={(value) =>

                        onChange({

                            ...filters,

                            location_id:
                                value
                                    ?
                                    Number(value)
                                    :
                                    undefined

                        })

                    }


                    placeholder="All Locations"


                    options={[
                        // {
                        //     label: "All Locations",
                        //     value: ""
                        // },

                        ...locations.map(location => ({

                            label: location.name,

                            value: String(location.id)

                        }))

                    ]}

                />
                <SelectCustom

                    value={
                        filters.order_type
                            ?
                            String(filters.order_type)
                            :
                            ""
                    }


                    
                    onChange={(value) =>
                        onChange({
                            ...filters,
                            order_type:
                                value || undefined
                        })
                    }


                    placeholder="All Types"


                    options={[
                        // {
                        //     label: "All Locations",
                        //     value: ""
                        // },

                        ...orderTypes.map(type => ({

                            label: type.name,

                            value: String(type.id)

                        }))

                    ]}

                />
             

                {/* Reset */}
                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                        setDate(undefined);

                        onChange({
                            range: "today",
                        });
                    }}
                >
                    <RotateCcw className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}