"use client";


import {
    useEffect
} from "react";


import {
    useForm,
    FormProvider
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
    toast
} from "sonner";


import {
    updateModifier
} from "../modifier.service";


import {
    Modifier
} from "@/types/modifier";


import {
    modifierSchema,
    ModifierFormValues
} from "../modifier.schema";


import {
    applyApiErrors
} from "@/lib/form-errors";



interface Props {

    modifier: Modifier;

    groups: {
        id: number;
        name: string;
    }[];

    open: boolean;

    onOpenChange: (open: boolean) => void;

    onSuccess: () => Promise<void>;

}



export default function EditModifierDialog({

    modifier,
    groups,
    open,
    onOpenChange,
    onSuccess

}: Props) {



    const form = useForm<ModifierFormValues>({

        resolver: zodResolver(
            modifierSchema
        )

    });



    useEffect(() => {


        form.reset({

            modifier_group_id:
                modifier.modifier_group_id,

            name:
                modifier.name,
            name_ar:
                modifier.name_ar,

            price:
                Number(modifier.price),

            active:
                modifier.active

        });


    }, [modifier, form]);





    async function submit(
        values: ModifierFormValues
    ) {

        try {


            await updateModifier(
                modifier.id,
                values
            );


            toast.success(
                "Modifier updated"
            );


            await onSuccess();


            onOpenChange(false);



        } catch (error) {


            applyApiErrors(
                form,
                error
            );


            toast.error(
                "Update failed"
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
                        Edit {modifier.name}
                    </DialogTitle>
                    <DialogDescription>
                         Update modifier details, pricing, group assignment, and availability.
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
                                Name Arabic
                            </Label>


                            <Input
                                dir="rtl"
                                placeholder=""

                                {...form.register(
                                    "name_ar"
                                )}

                            />
                            {form.formState.errors.name_ar && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.name_ar.message}
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

                                Save Changes

                            </Button>


                        </DialogFooter>



                    </form>


                </FormProvider>



            </DialogContent>


        </Dialog>

    );


}