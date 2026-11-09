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

import { Textarea } from "@/components/ui/textarea";

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
    SupplierFormInput,
    SupplierFormValues,
    supplierSchema,
} from "../supplier.schema";
import { createSupplier } from "../supplier.service";
import PermissionGuard from "@/components/guards/PermissionGuard";

interface Props {
    onSuccess: () => Promise<void>;
}

export default function CreateSupplierDialog({
    onSuccess,
}: Props) {
    const [open, setOpen] = useState(false);

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

    async function submit(
        values: SupplierFormValues
    ) {
        try {
            await createSupplier(values);

            toast.success(
                "Supplier created successfully."
            );

            await onSuccess();

            form.reset({
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

            setOpen(false);
        } catch (error) {
            applyApiErrors(
                form,
                error
            );

            toast.error(
                (error as any)?.message ??
                "Failed to create supplier."
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
                            Add Supplier
                        </Button>
                    }
                />
            </PermissionGuard>

            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Create Supplier
                    </DialogTitle>

                    <DialogDescription>
                        Add a new supplier.
                    </DialogDescription>
                </DialogHeader>

                <FormProvider {...form}>
                    <form
                        onSubmit={form.handleSubmit(
                            submit
                        )}
                        className="grid gap-4 md:grid-cols-2"
                    >
                        <div className="space-y-2">
                            <Label>Supplier Code</Label>
                            <Input
                                placeholder="SUP-001"
                                {...form.register("supplier_code")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input
                                placeholder="Supplier name"
                                {...form.register("name")}
                            />
                            {form.formState.errors.name && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                placeholder="supplier@example.com"
                                {...form.register("email")}
                            />
                            {form.formState.errors.email && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input
                                placeholder="Phone"
                                {...form.register("phone")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Alternate Phone</Label>
                            <Input
                                placeholder="Alternate phone"
                                {...form.register("alternate_phone")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Tax Number</Label>
                            <Input
                                placeholder="Tax number"
                                {...form.register("tax_number")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>City</Label>
                            <Input
                                placeholder="City"
                                {...form.register("city")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Country</Label>
                            <Input
                                placeholder="Country"
                                {...form.register("country")}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label>Address</Label>
                            <Textarea
                                placeholder="Address"
                                {...form.register("address")}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label>Notes</Label>
                            <Textarea
                                placeholder="Notes"
                                {...form.register("notes")}
                            />
                        </div>

                        <label className="md:col-span-2 flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...form.register("is_active")}
                            />
                            <span>Active supplier</span>
                        </label>

                        <DialogFooter className="md:col-span-2">
                            <Button type="submit">Create Supplier</Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
