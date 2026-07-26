"use client";

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

export default function AvailabilityCard() {

    const { watch, setValue } =
        useFormContext<MenuItemFormValues>();

    return (

        <Card>

            <CardHeader>

                <CardTitle>
                    Availability
                </CardTitle>

                <CardDescription>
                    Enable or disable this menu item.
                </CardDescription>

            </CardHeader>

            <CardContent>

                <div className="flex justify-between items-center">

                    <Label>Active</Label>

                    <Checkbox
                        checked={watch("active")}
                        onCheckedChange={(checked) =>
                            setValue(
                                "active",
                                checked === true
                            )
                        }
                    />

                </div>

            </CardContent>

        </Card>

    );

}