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

import { Textarea } from "@/components/ui/textarea";

import {
    applyApiErrors,
} from "@/lib/form-errors";

import {
    toast,
} from "sonner";
import {
    SupplierFormInput,
    SupplierFormValues,
    supplierSchema,
} from "../supplier.schema";
import { updateSupplier } from "../supplier.service";
import { InventorySupplier } from "@/types/inventory-supplier";

interface Props {
    open: boolean;

    onOpenChange: (
        open: boolean
    ) => void;

    supplier: InventorySupplier;

    onSuccess: () => Promise<void>;
}

export default function EditSupplierDialog({
    open,
    onOpenChange,
    supplier,
    onSuccess,
}: Props) {
    const form = useForm<
        SupplierFormInput,
        any,
        SupplierFormValues
    >({
        resolver: zodResolver(supplierSchema),

        defaultValues: {
            supplier_code: "",
            name: "",
            email: "",
            phone: "",
            alternate_phone: "",
            tax_number: "",
            address: "",
            city: "",
            country: "",
            notes: "",
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
        if (!open || !supplier) {
            return;
        }

        reset({
            supplier_code: supplier.supplier_code ?? "",
            name: supplier.name ?? "",
            email: supplier.email ?? "",
            phone: supplier.phone ?? "",
            alternate_phone: supplier.alternate_phone ?? "",
            tax_number: supplier.tax_number ?? "",
            address: supplier.address ?? "",
            city: supplier.city ?? "",
            country: supplier.country ?? "",
            notes: supplier.notes ?? "",
            is_active: Boolean(supplier.is_active),
        });
    }, [
        open,
        supplier,
        reset,
    ]);

    async function submit(values: SupplierFormValues) {
        try {
            await updateSupplier(
                supplier.id,
                values
            );

            toast.success(
                "Supplier updated successfully."
            );

            await onSuccess();

            onOpenChange(false);

            reset({
                supplier_code: "",
                name: "",
                email: "",
                phone: "",
                alternate_phone: "",
                tax_number: "",
                address: "",
                city: "",
                country: "",
                notes: "",
                is_active: true,
            });
        } catch (error) {
            applyApiErrors(form, error);

            toast.error(
                (error as any)?.message ??
                    "Failed to update supplier."
            );
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Edit Supplier
                    </DialogTitle>

                    <DialogDescription>
                        Update supplier information.
                    </DialogDescription>
                </DialogHeader>

                <FormProvider {...form}>
                    <form
                        onSubmit={handleSubmit(
                            submit
                        )}
                        className="grid gap-4 md:grid-cols-2"
                    >
                        <div className="space-y-2">
                            <Label>Supplier Code</Label>
                            <Input
                                placeholder="SUP-001"
                                {...register("supplier_code")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input
                                placeholder="Supplier name"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                placeholder="supplier@example.com"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input
                                placeholder="Phone"
                                {...register("phone")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Alternate Phone</Label>
                            <Input
                                placeholder="Alternate phone"
                                {...register("alternate_phone")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Tax Number</Label>
                            <Input
                                placeholder="Tax number"
                                {...register("tax_number")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>City</Label>
                            <Input
                                placeholder="City"
                                {...register("city")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Country</Label>
                            <Input
                                placeholder="Country"
                                {...register("country")}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label>Address</Label>
                            <Textarea
                                placeholder="Address"
                                {...register("address")}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label>Notes</Label>
                            <Textarea
                                placeholder="Notes"
                                {...register("notes")}
                            />
                        </div>

                        <label className="md:col-span-2 flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register("is_active")}
                            />
                            <span>Active supplier</span>
                        </label>

                        <DialogFooter className="md:col-span-2">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isSubmitting}
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
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
