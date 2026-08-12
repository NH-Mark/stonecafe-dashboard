"use client";

import { useState } from "react";
import {
    CalendarDays,
    ChevronDown,
    RotateCcw,
} from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import SelectCustom from "@/components/common/selectCustom";

import { Location } from "@/types/location";
import { OrderType } from "@/types/order-type";

export interface OrdersFiltersState {
    range:
        | "today"
        | "yesterday"
        | "this_week"
        | "this_month"
        | "last_month"
        | "custom";

    start_date?: string;
    end_date?: string;

    location_id?: number;
    order_type?: string;
}

interface Props {
    locations: Location[];
    orderTypes: OrderType[];

    filters: OrdersFiltersState;

    onChange: (
        filters: OrdersFiltersState
    ) => void;
}

const ranges = [
    {
        label: "Today",
        value: "today",
    },
    {
        label: "Yesterday",
        value: "yesterday",
    },
    {
        label: "This Week",
        value: "this_week",
    },
    {
        label: "This Month",
        value: "this_month",
    },
    {
        label: "Last Month",
        value: "last_month",
    },
    {
        label: "Custom",
        value: "custom",
    },
] as const;

export default function OrdersFilters({
    locations,
    orderTypes,
    filters,
    onChange,
}: Props) {
    const [date, setDate] =
        useState<DateRange | undefined>();

    const [calendarOpen, setCalendarOpen] =
        useState(false);

    const [customMode, setCustomMode] =
        useState(false);

    const [isSelectingEnd, setIsSelectingEnd] =
        useState(false);

    /**
     * Date preset.
     */
    function handleRangeChange(
        value: OrdersFiltersState["range"]
    ) {
        if (value === "custom") {
            setCustomMode(true);
            setDate(undefined);
            setIsSelectingEnd(false);
            setCalendarOpen(true);

            return;
        }

        setCustomMode(false);
        setIsSelectingEnd(false);
        setDate(undefined);
        setCalendarOpen(false);

        onChange({
            ...filters,
            range: value,
            start_date: undefined,
            end_date: undefined,
        });
    }

    /**
     * Custom date selection.
     *
     * API request is made only after
     * both dates are selected.
     */
    function handleDateSelect(
        range: DateRange | undefined
    ) {
        if (!range?.from) {
            return;
        }

        /**
         * First date.
         */
        if (!isSelectingEnd) {
            setDate({
                from: range.from,
                to: undefined,
            });

            setIsSelectingEnd(true);

            return;
        }

        /**
         * Waiting for second date.
         */
        if (!range.to) {
            setDate({
                from: range.from,
                to: undefined,
            });

            return;
        }

        /**
         * Complete range.
         */
        setDate(range);

        onChange({
            ...filters,

            range: "custom",

            start_date: format(
                range.from,
                "yyyy-MM-dd"
            ),

            end_date: format(
                range.to,
                "yyyy-MM-dd"
            ),
        });

        setIsSelectingEnd(false);
        setCustomMode(false);
        setCalendarOpen(false);
    }

    /**
     * Reset all filters.
     */
    function handleReset() {
        setDate(undefined);
        setCustomMode(false);
        setCalendarOpen(false);
        setIsSelectingEnd(false);

        onChange({
            range: "today",
            start_date: undefined,
            end_date: undefined,
            location_id: undefined,
            order_type: undefined,
        });
    }

    /**
     * Calendar button text.
     */
    function getDateLabel() {
        if (!date?.from) {
            return "Select Date Range";
        }

        if (!date.to) {
            return (
                <>
                    {format(
                        date.from,
                        "dd MMM yyyy"
                    )}

                    <span className="ml-1 text-muted-foreground">
                        - Select end date
                    </span>
                </>
            );
        }

        return (
            <>
                {format(
                    date.from,
                    "dd MMM yyyy"
                )}

                {" - "}

                {format(
                    date.to,
                    "dd MMM yyyy"
                )}
            </>
        );
    }

    const showCustomCalendar =
        customMode ||
        filters.range === "custom";

    return (
        <div
            className="
                flex flex-col gap-4
                rounded-2xl border bg-background p-4
                lg:flex-row lg:items-center
                lg:justify-between
            "
        >
            {/* Quick Date Filters */}

            <div
                className="
                    flex flex-wrap items-center gap-2
                    rounded-xl bg-muted p-1
                "
            >
                {ranges.map((item) => {
                    const isActive =
                        item.value === "custom"
                            ? customMode ||
                              filters.range ===
                                  "custom"
                            : filters.range ===
                              item.value;

                    return (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() =>
                                handleRangeChange(
                                    item.value
                                )
                            }
                            className={`
                                rounded-lg px-4 py-2
                                text-sm font-medium
                                transition

                                ${
                                    isActive
                                        ? "bg-white shadow text-[#40332a]"
                                        : "text-muted-foreground hover:text-foreground"
                                }
                            `}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* Right Filters */}

            <div className="flex flex-wrap items-center gap-3">
                {/* Custom Date */}

                {showCustomCalendar && (
                    <Popover
                        open={calendarOpen}
                        onOpenChange={
                            setCalendarOpen
                        }
                    >
                        <PopoverTrigger
                            render={
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-[270px] justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4" />

                                        {getDateLabel()}
                                    </div>

                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            }
                        />

                        <PopoverContent
                            align="end"
                            className="w-auto p-0"
                        >
                            <Calendar
                                mode="range"
                                numberOfMonths={2}
                                selected={date}
                                onSelect={
                                    handleDateSelect
                                }
                                autoFocus
                            />
                        </PopoverContent>
                    </Popover>
                )}

                {/* Location */}

                <SelectCustom
                    value={
                        filters.location_id
                            ? String(
                                  filters.location_id
                              )
                            : ""
                    }
                    onChange={(value) => {
                        onChange({
                            ...filters,
                            location_id: value
                                ? Number(value)
                                : undefined,
                        });
                    }}
                    placeholder="All Locations"
                    options={locations.map(
                        (location) => ({
                            label:
                                location.name,
                            value: String(
                                location.id
                            ),
                        })
                    )}
                />

                {/* Order Type */}

                <SelectCustom
                    value={
                        filters.order_type
                            ? String(
                                  filters.order_type
                              )
                            : ""
                    }
                    onChange={(value) => {
                        onChange({
                            ...filters,
                            order_type:
                                value ||
                                undefined,
                        });
                    }}
                    placeholder="All Types"
                    options={orderTypes.map(
                        (type) => ({
                            label: type.name,
                            value: String(
                                type.id
                            ),
                        })
                    )}
                />

                {/* Reset */}

                <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={handleReset}
                >
                    <RotateCcw className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}