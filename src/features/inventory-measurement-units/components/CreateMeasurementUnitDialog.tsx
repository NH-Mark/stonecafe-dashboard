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
    MeasurementUnitFormInput,
    MeasurementUnitFormValues,
    measurementUnitSchema,
} from "../measurement-unit.schema";
import { createMeasurementUnit } from "../measurement-unit.service";
import PermissionGuard from "@/components/guards/PermissionGuard";

interface Props {
    onSuccess: () => Promise<void>;
}

export default function CreateMeasurementUnitDialog({
    onSuccess,
}: Props) {
    const [open, setOpen] = useState(false);

    const form = useForm<
        MeasurementUnitFormInput,
        any,
        MeasurementUnitFormValues
    >({
        resolver: zodResolver(measurementUnitSchema),

        defaultValues: {
            name: "",
        },
    });

    async function submit(
        values: MeasurementUnitFormValues
    ) {
        try {
            await createMeasurementUnit(values);

            toast.success(
                "Measurement unit created successfully."
            );

            await onSuccess();

            form.reset({
                name: "",
            });

            setOpen(false);
        } catch (error) {
            applyApiErrors(
                form,
                error
            );

            toast.error(
                (error as any)?.message ??
                "Failed to create measurement unit."
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
                            Add Measurement Unit
                        </Button>
                    }
                />
            </PermissionGuard>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Create Measurement Unit
                    </DialogTitle>

                    <DialogDescription>
                        Add a new measurement unit.
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
                                placeholder="Measurement unit name"
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

                        <DialogFooter>
                            <Button type="submit">
                                Create Unit
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
