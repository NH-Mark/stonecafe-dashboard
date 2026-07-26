"use client";

import { useEffect } from "react";
import {
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
    DialogFooter,
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

import z from "zod";


const schema = z.object({

    selection_type: z.enum([
        "single",
        "multiple",
    ]),

    required: z.boolean(),

    min_selection: z.coerce.number()
        .min(0),

    max_selection: z.coerce.number()
        .min(1),

});


type FormValues = z.infer<typeof schema>;



interface Props {

    group:any;

    open:boolean;

    onOpenChange:(open:boolean)=>void;

    onSave:(values:FormValues)=>Promise<void>;

}



export default function EditMenuItemModifierGroupDialog({

    group,

    open,

    onOpenChange,

    onSave,

}:Props){



    const form = useForm<
        z.input<typeof schema>,
        unknown,
        z.output<typeof schema>
    >({

        resolver: zodResolver(schema),

        defaultValues: {

            selection_type: "single",

            required: false,

            min_selection: 0,

            max_selection: 1,

        }

    });



    useEffect(()=>{

        if(!group)
            return;


        form.reset({

            selection_type:
                group.pivot?.selection_type
                ??
                group.selection_type,


            required:
                Boolean(
                    group.pivot?.required ??
                    group.required
                ),


            min_selection:
                group.pivot?.min_selection
                ??
                group.min_selection,


            max_selection:
                group.pivot?.max_selection
                ??
                group.max_selection,

        });


    },[group]);




    const selectionType =
        form.watch("selection_type");



    async function submit(values:FormValues){

        try{
            console.log("DIALOG VALUES:", values);
            await onSave(values);

            toast.success(
                "Modifier settings updated"
            );

            onOpenChange(false);


        }catch(error){

            toast.error(
                "Failed to update modifier settings"
            );

        }

    }



    return (

        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent className="sm:max-w-md">


                <DialogHeader>

                    <DialogTitle>
                        Edit {group?.name}
                    </DialogTitle>


                    <DialogDescription>
                        Customize this modifier group for this menu item.
                    </DialogDescription>

                </DialogHeader>



                <div className="space-y-5"
                >



                    <div className="space-y-2">

                        <Label>
                            Selection Type
                        </Label>


                        <select
                            className="
                            w-full
                            border
                            rounded-md
                            p-2
                            "
                            {...form.register(
                                "selection_type"
                            )}
                        >

                            <option value="single">
                                Single Choice
                            </option>


                            <option value="multiple">
                                Multiple Choice
                            </option>

                        </select>

                    </div>




                    {
                        selectionType === "multiple" && (

                            <div className="grid grid-cols-2 gap-4">


                                <div className="space-y-2">

                                    <Label>
                                        Minimum
                                    </Label>


                                    <Input
                                        type="number"
                                        min={0}
                                        {...form.register(
                                            "min_selection"
                                        )}
                                    />

                                </div>



                                <div className="space-y-2">

                                    <Label>
                                        Maximum
                                    </Label>


                                    <Input
                                        type="number"
                                        min={1}
                                        {...form.register(
                                            "max_selection"
                                        )}
                                    />

                                </div>


                            </div>

                        )
                    }




                    <div
                        className="
                        border
                        rounded-lg
                        p-4
                        flex
                        justify-between
                        "
                    >

                        <div>

                            <Label>
                                Required
                            </Label>


                            <p className="
                            text-xs
                            text-muted-foreground
                            ">
                                Customer must select an option.
                            </p>

                        </div>



                        <Checkbox

                            checked={
                                form.watch("required")
                            }

                            onCheckedChange={(value)=>
                                form.setValue(
                                    "required",
                                    value === true
                                )
                            }

                        />


                    </div>




                    <DialogFooter>

                        <Button
                            type="button"
                            onClick={form.handleSubmit(submit)}
                        >
                            Save Changes
                        </Button>

                    </DialogFooter>


                </div>


            </DialogContent>


        </Dialog>

    );

}