"use client";

import { useFormContext } from "react-hook-form";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    MenuItemFormValues,
} from "../../menu-item.schema";
import { Category } from "@/types/category";

interface Props {
    categories:Category[];
}

export default function GeneralInfoCard({
    categories,
}: Props) {

    const {
        register,
        formState: { errors },
    } = useFormContext<MenuItemFormValues>();

    return (
        <Card>

            <CardHeader>

                <CardTitle>
                    General Information
                </CardTitle>

                <CardDescription>
                    Basic information about the menu item.
                </CardDescription>

            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-5">

                <div className="space-y-2">

                    <Label>Name</Label>

                    <Input
                        {...register("name")}
                    />

                    <p className="text-sm text-destructive">
                        {errors.name?.message}
                    </p>

                </div>

                <div className="space-y-2">

                    <Label>Category</Label>

                    <select
                        className="w-full rounded-md border p-2"
                        {...register("menu_category_id", {
                            valueAsNumber: true,
                        })}
                    >

                        <option value="">
                            Select Category
                        </option>

                        {categories.map(category => (

                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>

                        ))}

                    </select>
                    <p className="text-sm text-destructive">
                        {errors.menu_category_id?.message}
                    </p>
                </div>

                <div className="space-y-2">

                    <Label>SKU</Label>

                    <Input
                        {...register("sku")}
                    />
                    <p className="text-sm text-destructive">
                        {errors.sku?.message}
                    </p>

                </div>

                <div className="space-y-2">

                    <Label>Barcode</Label>

                    <Input
                        {...register("barcode")}
                    />
                    <p className="text-sm text-destructive">
                        {errors.barcode?.message}
                    </p>

                </div>

                <div className="md:col-span-2 space-y-2">

                    <Label>Description</Label>

                    <textarea
                        rows={4}
                        className="w-full rounded-md border p-3"
                        {...register("description")}
                    />
                    <p className="text-sm text-destructive">
                        {errors.description?.message}
                    </p>

                </div>

            </CardContent>

        </Card>
    );

}