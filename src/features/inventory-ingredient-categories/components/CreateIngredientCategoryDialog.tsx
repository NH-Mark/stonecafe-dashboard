"use client";

import { useState } from "react";
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
    DialogTrigger,
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
    Plus,
} from "lucide-react";

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
import { createIngredientCategory } from "../ingredient-category.service";
import PermissionGuard from "@/components/guards/PermissionGuard";

interface Props {
    onSuccess: () => Promise<void>;
}

export default function CreateIngredientCategoryDialog({
    onSuccess,
}: Props) {
    const [open, setOpen] = useState(false);

    const form = useForm<
        IngredientCategoryFormInput,
        any,
        IngredientCategoryFormValues
    >({
        resolver: zodResolver(ingredientCategorySchema),

        defaultValues: {
            name: "",
            description: "",
            is_active: true,
        },
    });

    async function submit(
        values: IngredientCategoryFormValues
    ) {
        try {
            await createIngredientCategory(values);

            toast.success(
                "Ingredient category created successfully."
            );

            await onSuccess();

            form.reset({
                name: "",
                description: "",
                is_active: true,
            });

            setOpen(false);
        } catch (error) {
            applyApiErrors(
                form,
                error
            );

            toast.error(
                (error as any)?.message ??
                "Failed to create ingredient category."
            );
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <PermissionGuard permission="inventory.view">
                <DialogTrigger
                    render={
                        <Button>
                            <Plus className="mr-2 h-4" />
                            Add Ingredient Category
                        </Button>
                    }
                />
            </PermissionGuard>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Create Ingredient Category
                    </DialogTitle>

                    <DialogDescription>
                        Add a new ingredient category.
                    </DialogDescription>
                </DialogHeader>

                <FormProvider {...form}>
                    <form
                        onSubmit={form.handleSubmit(
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
                                {...form.register(
                                    "name"
                                )}
                            />

                            {form.formState.errors.name && (
                                <p className="text-sm text-destructive">
                                    {
                                        form
                                            .formState
                                            .errors
                                            .name
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
                                {...form.register(
                                    "description"
                                )}
                            />

                            {form.formState.errors.description && (
                                <p className="text-sm text-destructive">
                                    {
                                        form
                                            .formState
                                            .errors
                                            .description
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...form.register(
                                    "is_active"
                                )}
                            />

                            <span>
                                Active category
                            </span>
                        </label>

                        <DialogFooter>
                            <Button
                                type="submit"
                            >
                                Create Category
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
