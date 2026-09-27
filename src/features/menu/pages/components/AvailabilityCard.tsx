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
    } = useFormContext<MenuItemFormValues>();

    const [printers, setPrinters] = useState<Printer[]>([]);
    const [loadingPrinters, setLoadingPrinters] = useState(true);

    const printerId = watch("printer_id");
    console.log("PrintId");
     console.log(printerId);
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