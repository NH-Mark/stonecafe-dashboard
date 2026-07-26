"use client";

import { useEffect } from "react";
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
    updateModifierGroup
} from "../modifier.service";

import {
    ModifierGroup
} from "@/types/modifier-group";

import {
    ModifierGroupFormValues,
    modifierGroupSchema
} from "../modifier-group.schema";

import {
    applyApiErrors
} from "@/lib/form-errors";


interface Props {

    group: ModifierGroup;

    open: boolean;

    onOpenChange: (open: boolean) => void;

    onSuccess: () => Promise<void>;

}



export default function EditModifierGroupDialog({

    group,
    open,
    onOpenChange,
    onSuccess,

}: Props) {


    const form = useForm<ModifierGroupFormValues>({

        resolver: zodResolver(
            modifierGroupSchema
        ),

        defaultValues: {
            name: "",
            selection_type: "single",
            required: false,
            min_selection: 0,
            max_selection: 1,
            active: true
        }

    });



    useEffect(() => {

        form.reset({

            name: group.name,

            selection_type:
                group.selection_type,

            required:
                group.required,

            min_selection:
                group.min_selection,

            max_selection:
                group.max_selection,

            active:
                group.active

        });


    }, [group, form]);





    async function submit(
        values: ModifierGroupFormValues
    ) {

        try {

            console.log(values);
            await updateModifierGroup(
                group.id,
                values
            );


            toast.success(
                "Modifier group updated"
            );


            await onSuccess();


            onOpenChange(false);


        } catch (error) {


            applyApiErrors(
                form,
                error
            );


            toast.error(
                "Failed to update modifier group"
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
                        Edit {group.name}
                    </DialogTitle>
                    <DialogDescription>
                        Update modifier group settings, selection rules, and availability.
                    </DialogDescription>
                </DialogHeader>



                <FormProvider {...form}>

                  <form
                        onSubmit={form.handleSubmit(submit)}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <Label>Group Name</Label>

                            <Input
                                placeholder="e.g. Choose a Size"
                                {...form.register("name")}
                            />

                            {form.formState.errors.name && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">

                            <Label>
                                Selection Type
                            </Label>


                            <select

                                className="w-full border rounded-md p-2"

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
                            form.watch("selection_type") === "multiple" && (

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">

                                        <Label>Minimum Selection</Label>
                                        <Input
                                                type="number"
                                                min={0}
                                                {...form.register("min_selection")}
                                        />
                                        {form.formState.errors.min_selection && (
                                            <p className="text-sm text-destructive">
                                                {form.formState.errors.min_selection.message}
                                            </p>
                                        )}

                                    </div>

                                    <div className="space-y-2">
                                        <Label>Maximum Selection</Label>

                                        <Input
                                            type="number"
                                            min={0}
                                            {...form.register("max_selection", {
                                                valueAsNumber: true,
                                            })}
                                        />

                                        {form.formState.errors.max_selection && (
                                            <p className="text-sm text-destructive">
                                                {form.formState.errors.max_selection.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                        <div className="rounded-lg border p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Required</Label>

                                    <p className="text-xs text-muted-foreground">
                                        Customer must choose from this group.
                                    </p>
                                </div>

                                <Checkbox
                                    checked={form.watch("required")}
                                    onCheckedChange={(checked) =>
                                        form.setValue("required", checked === true)
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Active</Label>

                                    <p className="text-xs text-muted-foreground">
                                        Available for ordering.
                                    </p>
                                </div>

                                <Checkbox
                                    checked={Boolean(form.watch("active"))}
                                    onCheckedChange={(checked) =>
                                        form.setValue(
                                            "active",
                                            checked === true,
                                            {
                                                shouldDirty:true,
                                                shouldValidate:true
                                            }
                                        )
                                    }
                                />
                            </div>
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