"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";


import {
    createCategory,
} from "../../category.service";

import { applyApiErrors } from "@/lib/form-errors";
import { CategoryFormValues, categorySchema } from "../../category.schema";
import { Category } from "@/types/category";
import ImageUploader from "@/components/common/ImageUploader";

interface Props {
    onSuccess: () => Promise<void>;
    categories: Category[];
}

export default function CreateCategoryDialog({
    onSuccess,
    categories
}: Props) {
    const [open, setOpen] = useState(false);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            name_ar: "",
            description: "",
            description_ar: "",
            image: "",
            parent_id: null,
            active: true,
        }
    });

    async function submit(values: CategoryFormValues) {
        try {
            await createCategory(values);

            toast.success("Category created.");

            await onSuccess();

            form.reset();

            setOpen(false);
        } catch (error) {
            applyApiErrors(form, error);

            toast.error("Failed to create category.");
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger
                render={
                    <Button>
                        <Plus className="h-4 w-4" />
                        New Category
                    </Button>
                }
            />

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Create Category
                    </DialogTitle>

                    <DialogDescription>
                        Create a new menu category.
                    </DialogDescription>
                </DialogHeader>

                <FormProvider {...form}>
                    <form
                        onSubmit={form.handleSubmit(submit)}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-2 gap-4">

                            <div className="space-y-2">
                                <Label>Name</Label>

                                <Input
                                    {...form.register("name")}
                                    placeholder="Burgers"
                                />
                                {
                                    form.formState.errors.name && (

                                        <p className="text-sm text-destructive">

                                            {
                                                form.formState.errors.name.message
                                            }

                                        </p>

                                    )

                                }
                            </div>
                            <div className="space-y-2">
                                <Label>
                                    Arabic Name
                                </Label>

                                <Input
                                    dir="rtl"
                                    {...form.register("name_ar")}
                                    placeholder="برجر"
                                />
                            </div>



                        </div>
                        <div className="space-y-2">

                            <Label>
                                Parent Category
                            </Label>

                            <select
                                className="w-full rounded-md border p-2"
                                {...form.register("parent_id", {
                                    setValueAs: (value) =>
                                        value === ""
                                            ? null
                                            : Number(value),
                                })}
                            >

                                <option value="">
                                    No Parent Category
                                </option>


                                {categories.map((category) => (

                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>

                                ))}

                            </select>


                            {form.formState.errors.parent_id && (

                                <p className="text-sm text-destructive">
                                    {form.formState.errors.parent_id.message}
                                </p>

                            )}

                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            {/* English Description */}
                            <div className="space-y-2">

                                <Label>
                                    Description
                                </Label>

                                <textarea
                                    rows={3}
                                    className="w-full rounded-md border p-3"
                                    placeholder="Optional description..."
                                    {...form.register("description")}
                                />

                            </div>


                            {/* Arabic Description */}
                            <div className="space-y-2">

                                <Label>
                                    Arabic Description
                                </Label>

                                <textarea
                                    dir="rtl"
                                    rows={3}
                                    className="w-full rounded-md border p-3"
                                    placeholder="وصف اختياري..."
                                    {...form.register("description_ar")}
                                />

                            </div>

                        </div>
                        <div className="space-y-2">
                            <ImageUploader

                                value=""

                                onChange={(path) => {

                                    form.setValue(
                                        "image",
                                        path,
                                        {
                                            shouldValidate: true
                                        }
                                    );

                                }}

                            />
                            {
                                form.formState.errors.image && (

                                    <p className="text-sm text-destructive">

                                        {
                                            form.formState.errors.image.message
                                        }

                                    </p>

                                )

                            }
                        </div>


                        <div className="grid grid-cols-2 gap-4">

                            <div className="flex items-center gap-3 pt-8">

                                <Checkbox
                                    checked={form.watch("active")}
                                    onCheckedChange={(checked) =>
                                        form.setValue(
                                            "active",
                                            checked === true
                                        )
                                    }
                                />

                                <Label>Active</Label>

                            </div>

                        </div>

                        <DialogFooter>
                            <Button variant="outline">
                                Cancel
                            </Button>

                            <Button type="submit">
                                Create Category
                            </Button>
                        </DialogFooter>

                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}