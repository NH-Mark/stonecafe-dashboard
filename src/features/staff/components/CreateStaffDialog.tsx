"use client";

import { useState } from "react";
import {
    FormProvider,
    useForm
} from "react-hook-form";

import {
    zodResolver
} from "@hookform/resolvers/zod";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";

import {
    Button
} from "@/components/ui/button";

import {
    Input
} from "@/components/ui/input";

import {
    Plus
} from "lucide-react";

import {
    createStaff
} from "../staff.service";
import { CreateStaffFormValues, createStaffSchema, StaffFormValues } from "../staff.schema";
import { Role } from "@/types/role";
import { Location } from "@/types/location";
import { applyApiErrors } from "@/lib/form-errors";
import { toast } from "sonner";



interface Props {
    roles: Role[];

    locations: Location[];

    onSuccess: () => Promise<void>;
}



export default function CreateStaffDialog({
    roles,
    locations,
    onSuccess
}: Props) {


    const [open, setOpen] = useState(false);


    const form =
        useForm<CreateStaffFormValues>({
            resolver: zodResolver(
                createStaffSchema
            ),

            defaultValues: {
                name: "",
                email: "",
                password: "",
                role_id: undefined,
                location_id: undefined
            }

        });



    async function submit(
        values: CreateStaffFormValues
    ) {

        try {
            await createStaff(values);
            toast.success("Staff created successfully.");

            await onSuccess();

            form.reset();

            setOpen(false);


        } catch (error) {

            applyApiErrors(
                form,
                error
            );
             toast.error(
            (error as any)?.message ?? "Failed to create staff."
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
                        Add Staff
                    </Button>
                }
            />



            <DialogContent
                className="sm:max-w-lg"
            >


                <DialogHeader>

                    <DialogTitle>
                        Create Staff
                    </DialogTitle>


                    <DialogDescription>
                        Add employee account and assign role.
                    </DialogDescription>

                </DialogHeader>



                <FormProvider {...form}>


                    <form

                        onSubmit={
                            form.handleSubmit(submit)
                        }

                        className="space-y-5"

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
                            placeholder="Password"
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
                            className="border rounded-md p-2 w-full"
                            {...form.register("location_id", {
                                setValueAs: (value) =>
                                    value === "" ? undefined : Number(value),
                                })}
                        >

                            <option value="">
                                Select Location
                            </option>


                            {
                                locations.map(location => (

                                    <option
                                        key={location.id}
                                        value={location.id}
                                    >

                                        {location.name}

                                    </option>

                                ))
                            }


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


                        <div className="space-y-2">

                            <select
                                className="border rounded-md p-2 w-full"
                                {...form.register("role_id", {
                                setValueAs: (value) =>
                                    value === "" ? undefined : Number(value),
                                })}
                            >

                                <option value="">
                                    Select Role
                                </option>


                                {
                                    roles.map(role => (

                                        <option
                                            key={role.id}
                                            value={role.id}
                                        >
                                            {role.name}
                                        </option>

                                    ))
                                }

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

                        </div>



                        <DialogFooter>

                            <Button type="submit">
                                Create Staff
                            </Button>

                        </DialogFooter>


                    </form>


                </FormProvider>


            </DialogContent>


        </Dialog>

    );

}