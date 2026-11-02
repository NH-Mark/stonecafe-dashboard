"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { MenuItemFormValues } from "../../menu-item.schema";
import { getPrinters } from "../../menu.service";
import { getLocationSelectors } from "@/features/locations/location.service";
import { Location } from "@/types/location";

interface Printer {
    id: number;
    name: string;
    code: string;
    system_name: string | null;
    is_active: boolean;
}

export default function AvailabilityCard() {

    const {
        watch,
        setValue,
        getValues,
    } = useFormContext<MenuItemFormValues>();

    const [printers, setPrinters] = useState<Printer[]>([]);
    const [loadingPrinters, setLoadingPrinters] = useState(true);
    const [locations, setLocations] = useState<Location[]>([]);

    const printerId = watch("printer_id");
    const active = watch("active");
    const locationStatuses = watch("location_statuses") ?? [];

   useEffect(() => {

    async function loadPrinters() {

        try {

            const response = await getPrinters();

            if (!response) {
                throw new Error(
                    "Failed to load printers"
                );
            }

            setPrinters(
                response.data.data ?? response.data
            );

        } catch (error) {

            console.error(
                "Failed to load printers:",
                error
            );

        } finally {

            setLoadingPrinters(false);

        }
    }

    loadPrinters();

}, []);

    useEffect(() => {
        async function loadLocations() {
            try {
                const response = await getLocationSelectors();
                setLocations(response);
            } catch (error) {
                console.error("Failed to load locations:", error);
            }
        }

        void loadLocations();
    }, []);

    useEffect(() => {
        if (locations.length === 0) {
            return;
        }

        const hasStatuses = (getValues("location_statuses") ?? []).length > 0;

        if (hasStatuses) {
            return;
        }

        setValue(
            "location_statuses",
            locations.map((location) => ({
                location_id: Number(location.id),
                active: active,
            })),
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );
    }, [locations, active, getValues, setValue]);

    return (

        <Card>

            <CardHeader>

                <CardTitle>
                    Availability & Printing
                </CardTitle>

                <CardDescription>
                    Configure availability and the printer used for this menu item.
                </CardDescription>

            </CardHeader>

            <CardContent className="space-y-6">

                {/* Active */}

                <div className="flex justify-between items-center">

                    <div>
                        <Label>
                            Active
                        </Label>

                        <p className="text-sm text-muted-foreground">
                            Enable or disable this menu item.
                        </p>
                    </div>

                    <Checkbox
                        checked={watch("active")}
                        onCheckedChange={(checked) =>
                            setValue(
                                "active",
                                checked === true,
                                {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                }
                            )
                        }
                    />

                </div>


                <div className="space-y-3 rounded-md border p-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Location Availability</Label>
                        <span className="text-xs text-muted-foreground">
                            {locations.length} locations
                        </span>
                    </div>

                    <div className="space-y-2">
                        {locations.map((location) => {
                            const status = (locationStatuses ?? []).find(
                                (item) => item.location_id === Number(location.id)
                            );

                            const checked = status?.active ?? active;

                            return (
                                <div
                                    key={location.id}
                                    className="flex items-center justify-between rounded-md border px-3 py-2"
                                >
                                    <span className="text-sm text-muted-foreground">
                                        {location.name}
                                    </span>

                                    <Checkbox
                                        checked={checked}
                                        onCheckedChange={(value) => {
                                            const nextStatuses = (getValues("location_statuses") ?? []).map((item) =>
                                                item.location_id === Number(location.id)
                                                    ? { ...item, active: value === true }
                                                    : item
                                            );

                                            setValue("location_statuses", nextStatuses, {
                                                shouldDirty: true,
                                                shouldValidate: true,
                                            });
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Printer */}

                <div className="space-y-2">

                    <Label htmlFor="printer_id">
                        Printer
                    </Label>

                    <select
                        id="printer_id"
                        value={printerId ?? ""}
                        onChange={(event) => {

                            const value =
                                event.target.value;

                            setValue(
                                "printer_id",
                                value
                                    ? Number(value)
                                    : null,
                                {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                }
                            );

                        }}
                        disabled={loadingPrinters}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    >

                        <option value="">
                            {loadingPrinters
                                ? "Loading printers..."
                                : "No printer"}
                        </option>

                        {printers
                            .filter(
                                (printer) =>
                                    printer.is_active
                            )
                            .map((printer) => (

                                <option
                                    key={printer.id}
                                    value={printer.id}
                                >
                                    {printer.name}
                                    {printer.system_name
                                        ? ` — ${printer.system_name}`
                                        : ""}
                                </option>

                            ))}

                    </select>

                    <p className="text-sm text-muted-foreground">
                        Select where KOTs for this item should be printed.
                    </p>

                </div>

            </CardContent>

        </Card>

    );
}