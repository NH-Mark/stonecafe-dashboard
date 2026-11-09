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
    MeasurementUnitFormInput,
    MeasurementUnitFormValues,
    measurementUnitSchema,
} from "../measurement-unit.schema";
import { updateMeasurementUnit } from "../measurement-unit.service";
import { InventoryMeasurementUnit } from "@/types/inventory-measurement-unit";

interface Props {
    open: boolean;

    onOpenChange: (
        open: boolean
    ) => void;

    measurementUnit: InventoryMeasurementUnit;

    onSuccess: () => Promise<void>;
}

export default function EditMeasurementUnitDialog({
    open,
    onOpenChange,
    measurementUnit,
    onSuccess,
}: Props) {
    const form = useForm<
        MeasurementUnitFormInput,
        any,
        MeasurementUnitFormValues
    >({
        resolver: zodResolver(
            measurementUnitSchema
        ),

        defaultValues: {
            name: "",
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
        if (!open || !measurementUnit) {
            return;
        }

        reset({
            name: measurementUnit.name ?? "",
        });
    }, [
        open,
        measurementUnit,
        reset,
    ]);

    async function submit(values: MeasurementUnitFormValues) {
        try {
            await updateMeasurementUnit(
                measurementUnit.id,
                values
            );

            toast.success(
                "Measurement unit updated successfully."
            );

            await onSuccess();

            onOpenChange(false);

            reset({
                name: "",
            });
        } catch (error) {
            applyApiErrors(form, error);

            toast.error(
                (error as any)?.message ??
                    "Failed to update measurement unit."
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
                        Edit Measurement Unit
                    </DialogTitle>

                    <DialogDescription>
                        Update measurement unit information.
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
                                placeholder="Measurement unit name"
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
