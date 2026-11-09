"use client";

import { useEffect } from "react";

import {
    FormProvider,
    useForm,
} from "react-hook-form";

import {
    zodResolver,
} from "@hookform/resolvers/zod";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Button,
} from "@/components/ui/button";

import {
    Input,
} from "@/components/ui/input";

import {
    Label,
} from "@/components/ui/label";

import {
    applyApiErrors,
} from "@/lib/form-errors";

import {
    toast,
} from "sonner";
import {
    IngredientCategoryFormInput,
    IngredientCategoryFormValues,
    ingredientCategorySchema,
} from "../ingredient-category.schema";
import { updateIngredientCategory } from "../ingredient-category.service";
import { InventoryIngredientCategory } from "@/types/inventory-ingredient-category";

interface Props {
    open: boolean;

    onOpenChange: (
        open: boolean
    ) => void;

    ingredientCategory: InventoryIngredientCategory;

    onSuccess: () => Promise<void>;
}

export default function EditIngredientCategoryDialog({
    open,
    onOpenChange,
    ingredientCategory,
    onSuccess,
}: Props) {
    const form = useForm<
        IngredientCategoryFormInput,
        any,
        IngredientCategoryFormValues
    >({
        resolver: zodResolver(
            ingredientCategorySchema
        ),

        defaultValues: {
            name: "",
            description: "",
            is_active: true,
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isSubmitting,
        },
    } = form;

    useEffect(() => {
        if (!open || !ingredientCategory) {
            return;
        }

        reset({
            name: ingredientCategory.name ?? "",
            description: ingredientCategory.description ?? "",
            is_active: Boolean(ingredientCategory.is_active),
        });
    }, [
        open,
        ingredientCategory,
        reset,
    ]);

    async function submit(values: IngredientCategoryFormValues) {
        try {
            await updateIngredientCategory(
                ingredientCategory.id,
                values
            );

            toast.success(
                "Ingredient category updated successfully."
            );

            await onSuccess();

            onOpenChange(false);

            reset({
                name: "",
                description: "",
                is_active: true,
            });
        } catch (error) {
            applyApiErrors(form, error);

            toast.error(
                (error as any)?.message ??
                    "Failed to update ingredient category."
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
                        Edit Ingredient Category
                    </DialogTitle>

                    <DialogDescription>
                        Update ingredient category information.
                    </DialogDescription>
                </DialogHeader>

                <FormProvider {...form}>
                    <form
                        onSubmit={handleSubmit(
                            submit
                        )}
                        className="space-y-5"
                    >
                        <div className="space-y-2">
                            <Label>
                                Name
                            </Label>

                            <Input
                                placeholder="Category name"
                                {...register(
                                    "name"
                                )}
                            />

                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {
                                        errors.name
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>
                                Description
                            </Label>

                            <Input
                                placeholder="Description (optional)"
                                {...register(
                                    "description"
                                )}
                            />

                            {errors.description && (
                                <p className="text-sm text-destructive">
                                    {
                                        errors.description
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register(
                                    "is_active"
                                )}
                            />

                            <span>
                                Active category
                            </span>
                        </label>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={
                                    isSubmitting
                                }
                                onClick={() =>
                                    onOpenChange(
                                        false
                                    )
                                }
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={
                                    isSubmitting
                                }
                            >
                                {isSubmitting
                                    ? "Saving..."
                                    : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
