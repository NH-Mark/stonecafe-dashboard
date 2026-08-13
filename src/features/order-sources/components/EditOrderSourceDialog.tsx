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
import { OrderSource } from "@/types/order-sources";
import { OrderSourceFormValues, orderSourceSchema } from "../order-sources.schema";
import { updateOrderSource } from "../order-sources.service";
interface Props {
    open: boolean;

    onOpenChange: (
        open: boolean
    ) => void;

    orderSource: OrderSource;

    onSuccess: () => Promise<void>;
}

export default function EditOrderSourceDialog({
    open,
    onOpenChange,
    orderSource,
    onSuccess,
}: Props) {
    const form = useForm<OrderSourceFormValues>({
        resolver: zodResolver(
            orderSourceSchema
        ),

        defaultValues: {
            name: "",
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

    /**
     * Populate form whenever
     * the dialog opens or discount changes.
     */
    useEffect(() => {
        if (!open || !orderSource) {
            return;
        }

        reset({
            name: orderSource.name ?? "",

            status:
                Boolean(orderSource.status) ?? true,
        });
    }, [
        open,
        orderSource,
        reset,
    ]);

    async function submit(values: OrderSourceFormValues) {
    console.log("SUBMIT:", values);

    try {
        await updateOrderSource(
            orderSource.id,
            values
        );

        toast.success(
            "Order Source updated successfully."
        );

        await onSuccess();

        onOpenChange(false);

        reset({
            name: "",
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
                        Edit Order Source
                    </DialogTitle>

                    <DialogDescription>
                        Update Source information.
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
                                Name
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


                        {/* Status */}

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register(
                                    "status"
                                )}
                            />

                            <span>
                                Active 
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