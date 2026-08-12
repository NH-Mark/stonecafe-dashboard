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
import { PaymentMethodFormValues, paymentMethodSchema } from "../payment-method.schema";
import { createPaymentMethod } from "../payment-method.service";


interface Props {
    onSuccess: () => Promise<void>;
}

export default function CreatePaymentMethodDialog({
    onSuccess,
}: Props) {
    const [open, setOpen] = useState(false);

    const form = useForm<PaymentMethodFormValues>({
        resolver: zodResolver(paymentMethodSchema),

        defaultValues: {
            name: "",
            status: true,
        },
    });

    async function submit(
        values: PaymentMethodFormValues
    ) {
        try {
            await createPaymentMethod(values);

            toast.success(
                "Payment Method created successfully."
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
                "Failed to create Method."
            );
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
                        <Plus className="mr-2 h-4" />
                        Add Payment Method
                    </Button>
                }
            />

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Create Payment Method
                    </DialogTitle>

                    <DialogDescription>
                        Add a new method.
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
                                placeholder="Name"
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

                       

                        {/* Active */}

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...form.register(
                                    "status"
                                )}
                            />

                            <span>
                                Active Method
                            </span>
                        </label>

                        <DialogFooter>
                            <Button
                                type="submit"
                            >
                                Create Payment Method
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}