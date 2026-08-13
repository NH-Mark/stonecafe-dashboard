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
import { OrderSourceFormValues, orderSourceSchema } from "../order-sources.schema";
import { createOrderSource } from "../order-sources.service";

interface Props {
    onSuccess: () => Promise<void>;
}

export default function CreateOrderSourceDialog({
    onSuccess,
}: Props) {
    const [open, setOpen] = useState(false);

    const form = useForm<OrderSourceFormValues>({
        resolver: zodResolver(orderSourceSchema),

        defaultValues: {
            name: "",
            status: true,
        },
    });

    async function submit(
        values: OrderSourceFormValues
    ) {
        try {
            await createOrderSource(values);

            toast.success(
                "Order Source created successfully."
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
                "Failed to create Source."
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
                        Add Order Source
                    </Button>
                }
            />

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Create Order Sources
                    </DialogTitle>

                    <DialogDescription>
                        Add a new order source.
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
                                Active 
                            </span>
                        </label>

                        <DialogFooter>
                            <Button
                                type="submit"
                            >
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}