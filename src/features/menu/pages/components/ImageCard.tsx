"use client";

import { useFormContext } from "react-hook-form";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import ImageUploader from "@/components/common/ImageUploader";

import { MenuItemFormValues } from "../../menu-item.schema";

export default function ImageCard() {

    const { watch, setValue } =
        useFormContext<MenuItemFormValues>();

    return (

        <Card>

            <CardHeader>

                <CardTitle>
                    Image
                </CardTitle>

                <CardDescription>
                    Upload menu item image.
                </CardDescription>

            </CardHeader>

            <CardContent>

                <ImageUploader
                    value={watch("image")}
                    onChange={(path) =>
                        setValue("image", path ?? "")
                    }
                />

            </CardContent>

        </Card>

    );

}