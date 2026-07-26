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
    DialogFooter,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog";

import {
    Button
} from "@/components/ui/button";

import {
    Input
} from "@/components/ui/input";

import {
    Label
} from "@/components/ui/label";

import {
    Checkbox
} from "@/components/ui/checkbox";

import {
    Plus
} from "lucide-react";

import {
    toast
} from "sonner";

import {
    createModifier
} from "../modifier.service";

import {
    modifierSchema,
    ModifierFormValues
} from "../modifier.schema";


import {
    applyApiErrors
} from "@/lib/form-errors";
import { ModifierGroup } from "@/types/modifier-group";


interface Props {

    groups: ModifierGroup[];

    onSuccess: () => Promise<void>;

}



export default function CreateModifierDialog({

    groups,
    onSuccess

}: Props) {


    const [open, setOpen] = useState(false);



    const form = useForm<ModifierFormValues>({

        resolver: zodResolver(
            modifierSchema
        ),

        defaultValues: {

            modifier_group_id: undefined,

            name: "",

            price: 0,

            active: true

        }

    });



    async function submit(
        values: ModifierFormValues
    ) {

        try {


            await createModifier(values);


            toast.success(
                "Modifier created"
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
                "Failed to create modifier"
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

                        <Plus className="h-4 w-4 mr-2" />

                        Add Modifier

                    </Button>
                }
            />



            <DialogContent className="sm:max-w-lg">


                <DialogHeader>

                    <DialogTitle>
                        Create Modifier
                    </DialogTitle>

                    <DialogDescription>
                        Add a menu option with its price and assign it to a modifier group.
                    </DialogDescription>

                </DialogHeader>



                <FormProvider {...form}>


                    <form
                        onSubmit={
                            form.handleSubmit(submit)
                        }
                        className="space-y-5"
                    >


                        <div className="space-y-2">

                            <Label>
                                Modifier Group
                            </Label>


                            <select

                                className="w-full border rounded-md p-2"

                                {...form.register(
                                    "modifier_group_id"
                                )}

                            >

                                <option value="">
                                    Select Group
                                </option>


                                {
                                    groups.map(group => (

                                        <option
                                            key={group.id}
                                            value={group.id}
                                        >

                                            {group.name}

                                        </option>

                                    ))
                                }


                            </select>
                            {form.formState.errors.modifier_group_id && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.modifier_group_id.message}
                                </p>
                            )}
                        </div>




                        <div className="space-y-2">

                            <Label>
                                Name
                            </Label>


                            <Input

                                placeholder="Extra Cheese"

                                {...form.register(
                                    "name"
                                )}

                            />
                            {form.formState.errors.name && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>




                        <div className="space-y-2">

                            <Label>
                                Price
                            </Label>


                            <Input

                                type="number"

                                step="0.01"

                                {...form.register(
                                    "price",
                                    {
                                        valueAsNumber: true
                                    }
                                )}

                            />
                            {form.formState.errors.price && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.price.message}
                                </p>
                            )}

                        </div>




                        <div className="flex items-center gap-3">


                            <Checkbox

                                checked={
                                    form.watch("active")
                                }

                                onCheckedChange={
                                    (v) =>
                                        form.setValue(
                                            "active",
                                            v === true
                                        )
                                }

                            />


                            <Label>
                                Active
                            </Label>


                        </div>




                        <DialogFooter>


                            <Button type="submit">

                                Create Modifier

                            </Button>


                        </DialogFooter>



                    </form>


                </FormProvider>


            </DialogContent>


        </Dialog>


    );


}