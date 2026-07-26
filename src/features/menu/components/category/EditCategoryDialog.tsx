"use client";

import { useEffect, useState } from "react";
import {
    FormProvider,
    useForm
} from "react-hook-form";

import {
    zodResolver
} from "@hookform/resolvers/zod";


import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";


import {
    Button
} from "@/components/ui/button";


import {
    Input
} from "@/components/ui/input";


import {
    Label
} from "@/components/ui/label";


import {
    Checkbox
} from "@/components/ui/checkbox";


import {
    Category
} from "@/types/category";


import {
    CategoryFormValues,
    categorySchema
} from "../../category.schema";


import {
    updateCategory
} from "../../category.service";


import {
    applyApiErrors
} from "@/lib/form-errors";


import {
    toast
} from "sonner";
import ImageUploader from "@/components/common/ImageUploader";



interface Props {

    category: Category;

    open: boolean;
    categories:Category[];
    onOpenChange: (open: boolean) => void;

    onSuccess: () => Promise<void>;

}

export default function EditCategoryDialog({
    category,
    open,
    categories,
    onOpenChange,
    onSuccess,

}: Props) {
    const form = useForm<CategoryFormValues>({

        resolver: zodResolver(categorySchema),

        defaultValues: {

            name: "",
            description: "",
            image: "",
            parent_id: null,
            active: true

        }

    });



    useEffect(() => {


        form.reset({

            name: category.name,

            description: category.description ?? "",

            image: category.image ?? "",

            parent_id: category.parent_id ?? null,

            active: category.active

        });


    }, [category, form]);

    async function submit(
        values: CategoryFormValues
    ) {

        try {


            await updateCategory(
                category.id,
                values
            );


            toast.success(
                "Category updated"
            );


            await onSuccess();


            onOpenChange(false);


        }

        catch (error) {


            applyApiErrors(
                form,
                error
            );


            toast.error(
                "Failed to update category"
            );


        }


    }




    return (

        <Dialog

            open={open}

            onOpenChange={onOpenChange}

        >


            <DialogContent className="sm:max-w-lg">


                 <DialogHeader>

                    <DialogTitle>

                        Edit Category: {category.name}

                    </DialogTitle>


                    <DialogDescription>

                        Update Menu Category.

                    </DialogDescription>


                </DialogHeader>




                <FormProvider {...form}>


                    <form

                        onSubmit={
                            form.handleSubmit(submit)
                        }

                        className="space-y-6"

                    >

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>
                                Name
                            </Label>
                            <Input

                                {...form.register("name")}
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
                                <Label>Parent Category</Label>

                                <select
                                            className="w-full rounded-md border p-2"
                                            value={form.watch("parent_id") ?? ""}
                                            onChange={(e) =>
                                                form.setValue(
                                                    "parent_id",
                                                    e.target.value === ""
                                                        ? null
                                                        : Number(e.target.value),
                                                    {
                                                        shouldValidate: true
                                                    }
                                                )
                                            }
                                        >
                                            <option value="">
                                                None
                                            </option>

                                            {categories
                                                .filter(c => c.id !== category.id)
                                                .map(category => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </option>
                                                ))
                                            }

                                        </select>
                                  {
                                form.formState.errors.parent_id && (

                                    <p className="text-sm text-destructive">

                                        {
                                            form.formState.errors.parent_id.message
                                        }

                                    </p>

                                )

                            }
                            </div>
                    </div>
                        
                    <div className="space-y-2">
                            <Label>Description</Label>

                            <textarea
                                rows={3}
                                className="w-full rounded-md border p-3"
                                placeholder="Optional description..."
                                {...form.register("description")}
                            />
                              {
                                form.formState.errors.description && (

                                    <p className="text-sm text-destructive">

                                        {
                                            form.formState.errors.description.message
                                        }

                                    </p>

                                )

                            }
                    </div>



                        <div className="space-y-2">

                            <Label>
                                Category Image
                            </Label>


                            <ImageUploader

                                value={
                                    category.image
                                }

                                onChange={(path)=>{

                                    form.setValue(
                                        "image",
                                        path,
                                        {
                                            shouldValidate:true
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



                        <div className="flex items-center gap-2">


                            <Checkbox

                                checked={
                                    form.watch("active")
                                }


                                onCheckedChange={
                                    (value) =>
                                        form.setValue(
                                            "active",
                                            value === true
                                        )

                                }

                            />


                            <Label>
                                Active
                            </Label>


                        </div>




                        <DialogFooter>

                            <Button type="submit">

                                Save Changes

                            </Button>

                        </DialogFooter>



                    </form>


                </FormProvider>


            </DialogContent>


        </Dialog>


    );


}