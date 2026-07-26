"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { applyApiErrors } from "@/lib/form-errors";
import { ModifierGroupFormValues, modifierGroupSchema } from "../modifier-group.schema";
import { createModifierGroup } from "../modifier.service";

interface Props {
    onSuccess: () => Promise<void>;
}

export default function CreateModifierGroupDialog({
    onSuccess
}: Props) {
    const [open, setOpen] = useState(false);

    const form = useForm<ModifierGroupFormValues>({
        resolver: zodResolver(modifierGroupSchema),
        defaultValues: {
            name: "",
            required: true,
            min_selection: null,
            max_selection: null,
            active: true,
        }
    });

    async function submit(values: ModifierGroupFormValues) {
        try {
            await createModifierGroup(values);

            toast.success("Modifier Group created.");

            await onSuccess();

            form.reset();

            setOpen(false);
        } catch (error) {
            applyApiErrors(form, error);

            toast.error("Failed to create modifier group.");
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
                        <Plus className="h-4 w-4" />
                        New Modifier Group
                    </Button>
                }
            />

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Create Modifier Group
                    </DialogTitle>

                    <DialogDescription>
                          Create a group of selectable options for your menu items, such as size, toppings, or add-ons.
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
                                            {...form.register("min_selection", {
                                                valueAsNumber: true,
                                            })}
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
                                    checked={form.watch("active")}
                                    onCheckedChange={(checked) =>
                                        form.setValue("active", checked === true)
                                    }
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? "Creating..."
                                    : "Create Group"}
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}