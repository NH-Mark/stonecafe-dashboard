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
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

import {
    Button,
} from "@/components/ui/button";

import {
    Input,
} from "@/components/ui/input";

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
    DiscountFormValues,
    discountSchema,
} from "../discount.schema";

import {
    createDiscount,
} from "../discount.service";

interface Props {
    onSuccess: () => Promise<void>;
}

export default function CreateDiscountDialog({
    onSuccess,
}: Props) {
    const [open, setOpen] = useState(false);

    const form = useForm<DiscountFormValues>({
        resolver: zodResolver(discountSchema),

        defaultValues: {
            name: "",
            type: "percentage",
            value: "",
            status: true,
        },
    });

    async function submit(
        values: DiscountFormValues
    ) {
        try {
            await createDiscount(values);

            toast.success(
                "Discount created successfully."
            );

            await onSuccess();

            form.reset();

            setOpen(false);
        } catch (error) {
            applyApiErrors(
                form,
                error
            );

            toast.error(
                (error as any)?.message ??
                "Failed to create discount."
            );
        }
    }

    const selectedType = form.watch("type");

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger
                render={
                    <Button>
                        <Plus className="mr-2 h-4" />
                        Add Discount
                    </Button>
                }
            />

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Create Discount
                    </DialogTitle>

                    <DialogDescription>
                        Add a new discount.
                    </DialogDescription>
                </DialogHeader>

                <FormProvider {...form}>
                    <form
                        onSubmit={form.handleSubmit(
                            submit
                        )}
                        className="space-y-5"
                    >
                        {/* Name */}

                        <div className="space-y-2">
                            <Input
                                placeholder="Discount Name"
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

                        {/* Type */}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Discount Type
                            </label>

                            <select
                                {...form.register(
                                    "type"
                                )}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="percentage">
                                    Percentage
                                </option>

                                <option value="fixed">
                                    Fixed Amount
                                </option>
                            </select>

                            {form.formState.errors.type && (
                                <p className="text-sm text-destructive">
                                    {
                                        form
                                            .formState
                                            .errors
                                            .type
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        {/* Value */}

                        <div className="space-y-2">
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder={
                                    selectedType ===
                                    "percentage"
                                        ? "Percentage"
                                        : "Amount"
                                }
                                {...form.register(
                                    "value"
                                )}
                            />

                            {selectedType ===
                                "percentage" && (
                                <p className="text-xs text-muted-foreground">
                                    Enter a percentage
                                    between 0 and 100.
                                </p>
                            )}

                            {selectedType === "fixed" && (
                                <p className="text-xs text-muted-foreground">
                                    Enter the fixed discount
                                    amount.
                                </p>
                            )}

                            {form.formState.errors.value && (
                                <p className="text-sm text-destructive">
                                    {
                                        form
                                            .formState
                                            .errors
                                            .value
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        {/* Active */}

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...form.register(
                                    "status"
                                )}
                            />

                            <span>
                                Active Discount
                            </span>
                        </label>

                        <DialogFooter>
                            <Button
                                type="submit"
                            >
                                Create Discount
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}