"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Pencil } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { updateStaff } from "../staff.service";
import { StaffFormValues } from "../staff.schema";

import { User } from "@/types/user";
import { Role } from "@/types/role";
import { Location } from "@/types/location";
import { applyApiErrors } from "@/lib/form-errors";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User;
    roles: Role[];
    locations: Location[];
    onSuccess: () => Promise<void>;
}
export default function EditStaffDialog({
    open,
    onOpenChange,
    user,
    roles,
    locations,
    onSuccess,
}: Props) {

    const form = useForm<StaffFormValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role_id: undefined,
            location_id: undefined,
        },
    });

    useEffect(() => {
        form.reset({
            name: user.name,
            email: user.email,
            password: "",
            role_id: user.roles[0]?.id ?? null,
            location_id: user.location?.id ?? null,
        });
    }, [user, form]);

    async function submit(
        values: StaffFormValues
    ) {
        const id = toast.loading("Saving...");
        try {
            await updateStaff(user.id, values);

            await onSuccess();

            form.reset();

            onOpenChange(false);
            toast.success("Staff updated.", {
                id,
            });


        } catch (error) {

            applyApiErrors(
                form,
                error
            );
            toast.error("Update failed.", {
                id,
            });

        }
    }


    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Staff</DialogTitle>
                </DialogHeader>

                <FormProvider {...form}>
                    <form
                        onSubmit={form.handleSubmit(submit)}
                        className="space-y-4"
                    >
                        <Input
                            placeholder="Name"
                            {...form.register("name")}
                        />
                        {
                            form.formState.errors.name && (

                                <p className="text-sm text-destructive">
                                    {form.formState.errors.name.message}
                                </p>

                            )
                        }

                        <Input
                            placeholder="Email"
                            {...form.register("email")}
                        />
                        {
                            form.formState.errors.email && (

                                <p className="text-sm text-destructive">
                                    {form.formState.errors.email.message}
                                </p>

                            )
                        }

                        <Input
                            type="password"
                            placeholder="Leave blank to keep current password"
                            {...form.register("password")}
                        />
                        {
                            form.formState.errors.password && (

                                <p className="text-sm text-destructive">
                                    {form.formState.errors.password.message}
                                </p>

                            )
                        }

                        <select
                            className="w-full rounded-md border p-2"
                            {...form.register("location_id", {
                                valueAsNumber: true,
                            })}
                        >
                            <option value="">Select Location</option>

                            {locations.map((location) => (
                                <option
                                    key={location.id}
                                    value={location.id}
                                >
                                    {location.name}
                                </option>
                            ))}
                        </select>
                        {
                            form.formState.errors.location_id && (

                                <p className="text-sm text-destructive">
                                    {
                                        form.formState.errors.location_id.message
                                    }
                                </p>

                            )
                        }

                        <select
                            className="w-full rounded-md border p-2"
                            {...form.register("role_id", {
                                valueAsNumber: true,
                            })}
                        >
                            <option value="">Select Role</option>

                            {roles.map((role) => (
                                <option
                                    key={role.id}
                                    value={role.id}
                                >
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {
                            form.formState.errors.role_id && (

                                <p className="text-sm text-destructive">
                                    {
                                        form.formState.errors.role_id.message
                                    }
                                </p>

                            )
                        }

                        <DialogFooter>
                            <Button type="submit">
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}