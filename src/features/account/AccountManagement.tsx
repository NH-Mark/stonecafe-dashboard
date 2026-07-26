"use client";

import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import AccountSettings from "./components/AccountSettings";
import ChangePassword from "./components/ChangePassword";
import { useEffect, useState } from "react";
import { getUser } from "../auth/auth.service";
import { getLocations } from "../locations/location.service";
import { Location } from "@/types/location";
import { changePassword, updateProfile } from "./account.service";
import { AccountForm, accountSchema } from "./account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";



export default function AccountManagement() {
    const [locations, setLocations] = useState<Location[]>([]);

    const form = useForm<
        z.input<typeof accountSchema>,
        unknown,
        z.output<typeof accountSchema>
    >({

        resolver: zodResolver(accountSchema),
        defaultValues: {
            name: "",
            email: "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        async function loadData() {
            const [user, locations] = await Promise.all([
                getUser(),
                getLocations(),
            ]);

            setLocations(locations.data.data ?? locations.data);

            form.reset({
                name: user.name,
                email: user.email,
                location_id: user.location ? user.location.id : 0,
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        }

        loadData();
    }, [form]);

    async function onSubmit(values: AccountForm) {
        try {
            await updateProfile({
                name: values.name,
                email: values.email,
                location_id: Number(values.location_id),
            });

            toast.success("Profile updated successfully.");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ??
                "Failed to update profile."
            );
            return;
        }

        if (
            values.currentPassword &&
            values.newPassword &&
            values.confirmPassword
        ) {
            try {
                await changePassword({
                    current_password: values.currentPassword,
                    password: values.newPassword,
                    password_confirmation: values.confirmPassword,
                });

                toast.success("Password updated successfully.");

                form.setValue("currentPassword", "");
                form.setValue("newPassword", "");
                form.setValue("confirmPassword", "");
            } catch (error: any) {
                toast.error(
                    error?.response?.data?.message ??
                    "Failed to update password."
                );
            }
        }
    }
    const submitting =
        form.formState.isSubmitting;
    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <AccountSettings locations={locations} />

                <ChangePassword />

                <div
                    className="
                            fixed bottom-0 left-0 right-0
                            border-t bg-background
                            px-6 py-4
                            flex justify-end gap-3
                            z-50
                            "
                >

                    <Button
                        type="button"
                        variant="outline"
                        disabled={submitting}
                    >
                        Cancel
                    </Button>



                    <Button
                        type="submit"
                        disabled={submitting}
                    >

                        {
                            submitting && (
                                <Loader2
                                    className="
                                            mr-2
                                            h-4
                                            w-4
                                            animate-spin
                                            "
                                />
                            )
                        }


                        {"Save Changes"
                        }

                    </Button>


                </div>
            </form>
        </FormProvider>
    );
}