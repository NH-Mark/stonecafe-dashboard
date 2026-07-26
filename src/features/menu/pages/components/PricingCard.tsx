"use client";

import { useFormContext } from "react-hook-form";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { MenuItemFormValues } from "../../menu-item.schema";

export default function PricingCard() {

    const { register, formState: { errors }, } =
        useFormContext<MenuItemFormValues>();

    return (

        <Card>

            <CardHeader>

                <CardTitle>
                    Pricing
                </CardTitle>

                <CardDescription>
                    Configure selling and cost prices.
                </CardDescription>

            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-5">

                <div className="space-y-2">

                    <Label>Selling Price</Label>

                    <Input
                        type="number"
                        step="0.01"
                        {...register("price", {
                            valueAsNumber: true,
                        })}
                    />
                    <p className="text-sm text-destructive">
                        {errors.price?.message}
                    </p>

                </div>

                <div className="space-y-2">

                    <Label>Cost Price</Label>

                    <Input
                        type="number"
                        step="0.01"
                        {...register("cost_price", {
                            valueAsNumber: true,
                        })}
                    />
                    <p className="text-sm text-destructive">
                        {errors.cost_price?.message}
                    </p>
                </div>

            </CardContent>

        </Card>

    );

}