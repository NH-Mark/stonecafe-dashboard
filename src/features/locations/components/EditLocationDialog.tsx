"use client";

import { useEffect, useState } from "react";

import {
    FormProvider,
    useForm
} from "react-hook-form";

import {
    Pencil
} from "lucide-react";

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
    updateLocation
} from "../location.service";


import {
    Location
} from "@/types/location";


import {
    LocationFormValues,
    locationSchema
} from "../location.schema";


import {
    applyApiErrors
} from "@/lib/form-errors";


import {
    toast
} from "sonner";



interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    location: Location;

    onSuccess: () => Promise<void>;

}



export default function EditLocationDialog({
    open,
    onOpenChange,
    location,

    onSuccess

}: Props) {

    const form =
        useForm<LocationFormValues>({

            resolver:zodResolver(
                locationSchema
            ),

            defaultValues: {

                name: "",

                code: "",

                address: "",

                phone: "",

                status:true,

            }

        });



    useEffect(()=>{

        form.reset({

            name: location.name,

            code: location.code,

            address: location.address ?? "",

            phone: location.phone ?? "",

            status: location.status,

        });


    },[location,form]);





    async function submit(
        values:LocationFormValues
    ){

        try {


            await updateLocation(
                location.id,
                values
            );


            toast.success(
                "Location updated successfully."
            );


            await onSuccess();


            onOpenChange(false);


        } catch(error){


            applyApiErrors(
                form,
                error
            );


            toast.error(
                (error as any)?.message ??
                "Failed to update location."
            );

        }

    }




    return (

        <Dialog

            open={open}

            onOpenChange={onOpenChange}

        >



            <DialogContent

                className="sm:max-w-lg"

            >


                <DialogHeader>


                    <DialogTitle>
                        Edit Location
                    </DialogTitle>


                    <DialogDescription>
                        Update location information.
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

                                Save Changes

                            </Button>


                        </DialogFooter>



                    </form>


                </FormProvider>



            </DialogContent>


        </Dialog>

    );

}