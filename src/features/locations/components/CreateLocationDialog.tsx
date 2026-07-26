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
    createLocation
} from "../location.service";

import {
    applyApiErrors
} from "@/lib/form-errors";

import {
    toast
} from "sonner";

import {
    LocationFormValues,
    locationSchema
} from "../location.schema";



interface Props {
    onSuccess: () => Promise<void>;
}



export default function CreateLocationDialog({
    onSuccess
}: Props) {


    const [open, setOpen] = useState(false);



    const form =
        useForm<LocationFormValues>({

            resolver: zodResolver(
                locationSchema
            ),

            defaultValues: {

                name: "",

                code: "",

                address: "",

                phone: "",

                status: true,

            }

        });



    async function submit(
        values: LocationFormValues
    ) {


        try {

            await createLocation(values);


            toast.success(
                "Location created successfully."
            );


            await onSuccess();


            form.reset();


            setOpen(false);


        } catch(error) {


            applyApiErrors(
                form,
                error
            );


            toast.error(
                (error as any)?.message ??
                "Failed to create location."
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

                        Add Location

                    </Button>
                }
            />



            <DialogContent
                className="sm:max-w-lg"
            >


                <DialogHeader>

                    <DialogTitle>
                        Create Location
                    </DialogTitle>


                    <DialogDescription>
                        Add a new company location.
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
                            placeholder="Location Name"
                            {...form.register("name")}
                        />

                        {
                            form.formState.errors.name && (

                                <p className="text-sm text-destructive">
                                    {
                                        form.formState.errors.name.message
                                    }
                                </p>

                            )
                        }



                        <Input
                            placeholder="Location Code"
                            {...form.register("code")}
                        />

                        {
                            form.formState.errors.code && (

                                <p className="text-sm text-destructive">
                                    {
                                        form.formState.errors.code.message
                                    }
                                </p>

                            )
                        }



                        <Input
                            placeholder="Address"
                            {...form.register("address")}
                        />



                        <Input
                            placeholder="Phone"
                            {...form.register("phone")}
                        />



                        <label className="flex items-center gap-2">

                            <input
                                type="checkbox"
                                {...form.register(
                                    "status"
                                )}
                            />

                            <span>
                                Active Location
                            </span>

                        </label>



                        <DialogFooter>


                            <Button
                                type="submit"
                            >

                                Create Location

                            </Button>


                        </DialogFooter>


                    </form>


                </FormProvider>


            </DialogContent>


        </Dialog>

    );

}