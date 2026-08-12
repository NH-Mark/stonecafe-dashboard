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
import { PaymentMethod } from "@/types/payment-method";
import { PaymentMethodFormValues, paymentMethodSchema } from "../payment-method.schema";
import { updatePaymentMethod } from "../payment-method.service";

interface Props {
    open: boolean;

    onOpenChange: (
        open: boolean
    ) => void;

    paymentMethod: PaymentMethod;

    onSuccess: () => Promise<void>;
}

export default function EditPaymentMethodDialog({
    open,
    onOpenChange,
    paymentMethod,
    onSuccess,
}: Props) {
    const form = useForm<PaymentMethodFormValues>({
        resolver: zodResolver(
            paymentMethodSchema
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
        if (!open || !paymentMethod) {
            return;
        }

        reset({
            name: paymentMethod.name ?? "",

            status:
                Boolean(paymentMethod.status) ?? true,
        });
    }, [
        open,
        paymentMethod,
        reset,
    ]);

    async function submit(values: PaymentMethodFormValues) {
    console.log("SUBMIT:", values);

    try {
        await updatePaymentMethod(
            paymentMethod.id,
            values
        );

        toast.success(
            "paymentMethod updated successfully."
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
                        Edit Payment Method
                    </DialogTitle>

                    <DialogDescription>
                        Update method information.
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
                                Active Method
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