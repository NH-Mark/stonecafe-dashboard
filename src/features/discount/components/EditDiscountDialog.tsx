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
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
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
    DiscountFormValues,
    discountSchema,
} from "../discount.schema";

import {
    Discount,
} from "@/types/discount";

import {
    updateDiscount,
} from "../discount.service";

interface Props {
    open: boolean;

    onOpenChange: (
        open: boolean
    ) => void;

    discount: Discount;

    onSuccess: () => Promise<void>;
}

export default function EditDiscountDialog({
    open,
    onOpenChange,
    discount,
    onSuccess,
}: Props) {
    const form = useForm<DiscountFormValues>({
        resolver: zodResolver(
            discountSchema
        ),

        defaultValues: {
            name: "",
            type: "percentage",
            value: "",
            status: true,
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: {
            errors,
            isSubmitting,
        },
    } = form;

    const discountType = watch("type");

    /**
     * Populate form whenever
     * the dialog opens or discount changes.
     */
    useEffect(() => {
        if (!open || !discount) {
            return;
        }

        reset({
            name: discount.name ?? "",

            type:
                discount.type === "fixed"
                    ? "fixed"
                    : "percentage",

            value: String(
                discount.value ?? ""
            ),

            status:
                Boolean(discount.status) ?? true,
        });
    }, [
        open,
        discount,
        reset,
    ]);

    async function submit(values: DiscountFormValues) {
    console.log("SUBMIT:", values);

    try {
        await updateDiscount(
            discount.id,
            values
        );

        toast.success(
            "Discount updated successfully."
        );

        await onSuccess();

        onOpenChange(false);

        reset({
            name: "",
            type: "percentage",
            value: "",
            status: true,
        });

    } catch (error) {
        console.error("UPDATE ERROR:", error);

        applyApiErrors(form, error);

        toast.error(
            (error as any)?.message ??
                "Failed to update discount."
        );
    }
}

function handleInvalidSubmit(errors: typeof form.formState.errors) {
    console.log("VALIDATION ERRORS:", errors);
}

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-lg">

                <DialogHeader>
                    <DialogTitle>
                        Edit Discount
                    </DialogTitle>

                    <DialogDescription>
                        Update discount information.
                    </DialogDescription>
                </DialogHeader>

                <FormProvider {...form}>
                    <form
                        onSubmit={handleSubmit(
                            submit,
                            handleInvalidSubmit
                        )}
                        className="space-y-5"
                    >

                        {/* Name */}

                        <div className="space-y-2">
                            <Label>
                                Discount Name
                            </Label>

                            <Input
                                placeholder="Discount Name"
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


                        {/* Type */}

                        <div className="space-y-2">
                            <Label>
                                Discount Type
                            </Label>

                            <select
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                {...register(
                                    "type"
                                )}
                            >
                                <option value="">
                                    Select Type
                                </option>

                                <option value="percentage">
                                    Percentage
                                </option>

                                <option value="fixed">
                                    Fixed Amount
                                </option>
                            </select>

                            {errors.type && (
                                <p className="text-sm text-destructive">
                                    {
                                        errors.type
                                            .message
                                    }
                                </p>
                            )}
                        </div>


                        {/* Value */}

                        <div className="space-y-2">
                            <Label>
                                Discount Value
                            </Label>

                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder={
                                    discountType ===
                                    "percentage"
                                        ? "e.g. 10"
                                        : "e.g. 25"
                                }
                                {...register(
                                    "value"
                                )}
                            />

                            <p className="text-xs text-muted-foreground">
                                {discountType ===
                                "percentage"
                                    ? "Enter percentage value, e.g. 10 for 10%."
                                    : "Enter the fixed discount amount."}
                            </p>

                            {errors.value && (
                                <p className="text-sm text-destructive">
                                    {
                                        errors.value
                                            .message
                                    }
                                </p>
                            )}
                        </div>


                        {/* Status */}

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register(
                                    "status"
                                )}
                            />

                            <span>
                                Active Discount
                            </span>
                        </label>


                        {/* Footer */}

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