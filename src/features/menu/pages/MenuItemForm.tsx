"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import z from "zod";

import {
    MenuItemFormValues,
    menuItemSchema,
} from "../menu-item.schema";

import GeneralInfoCard from "./components/GeneralInfoCard";
import PricingCard from "./components/PricingCard";
import ModifierGroupsCard from "./components/ModifierGroupsCard";
import FoodSymbolsCard from "./components/FoodSymbolsCard";
import TagsCard from "./components/TagsCard";
import ImageCard from "./components/ImageCard";
import AvailabilityCard from "./components/AvailabilityCard";

import { MenuItem } from "@/types/menu-item";
import { Category } from "@/types/category";
import { ModifierGroup } from "@/types/modifier-group";
import EditMenuItemModifierGroupDialog from "../components/menu-item/EditMenuItemModifierGroupDialog";
import { updateMenuItemModifierGroup } from "../menu.service";
import { MenuItemTag } from "@/types/menu-item-tag";
import { FoodSymbol } from "@/types/food-symbol";
import { useEffect, useState } from "react";

interface Props {
    mode: "create" | "edit";

    menuItem?: MenuItem;

    categories: Category[];

    allModifierGroups: ModifierGroup[];
    allTags: MenuItemTag[];
    foodSymbols: FoodSymbol[];
    onSubmit: (
        values: MenuItemFormValues
    ) => Promise<any>;
}


export default function MenuItemForm({
    mode,
    menuItem,
    categories,
    allModifierGroups,
    allTags,
    foodSymbols,
    onSubmit,
}: Props) {

    const [editingGroup, setEditingGroup] = useState<any>(null);


    const form = useForm<
        z.input<typeof menuItemSchema>,
        unknown,
        z.output<typeof menuItemSchema>
    >({

        resolver: zodResolver(menuItemSchema),


        defaultValues: {

            name: menuItem?.name ?? "",

            description: menuItem?.description ?? "",


            menu_category_id:
                menuItem?.menu_category_id ?? null,


            barcode:
                menuItem?.barcode ?? "",


            sku:
                menuItem?.sku ?? "",


            price:
                menuItem?.price ?? 0,


            cost_price:
                menuItem?.cost_price ?? 0,


            image:
                menuItem?.image ?? "",


            active:
                menuItem?.active ?? true,


            modifier_groups:
                menuItem?.modifier_groups?.map(group => ({
                    ...group,
                    id: group.id,

                    selection_type:
                        group.pivot?.selection_type ??
                        group.selection_type,

                    required:
                        Boolean(
                            group.pivot?.required ??
                            group.required
                        ),

                    min_selection:
                        group.pivot?.min_selection ??
                        group.min_selection,

                    max_selection:
                        group.pivot?.max_selection ??
                        group.max_selection,
                    modifiers_count: group.modifiers_count,

                })) ?? [],

            food_symbols:
                menuItem?.food_symbols?.map(
                    symbol => symbol.id
                ) ?? [],

            menu_item_tags:
                menuItem?.menu_item_tags?.map(
                    tag => tag.id
                ) ?? [],


        },

    });


    useEffect(() => {

        if (!menuItem) return;


        form.reset({

            name: menuItem.name ?? "",

            description:
                menuItem.description ?? "",


            menu_category_id:
                menuItem.menu_category_id ?? null,


            barcode:
                menuItem.barcode ?? "",


            sku:
                menuItem.sku ?? "",


            price:
                menuItem.price ?? 0,


            cost_price:
                menuItem.cost_price ?? 0,


            image:
                menuItem.image ?? "",


            active:
                menuItem.active ?? true,


            modifier_groups:
                menuItem.modifier_groups?.map(group => ({
                    ...group,
                    id: group.id,

                    selection_type:
                        group.pivot?.selection_type ??
                        group.selection_type,

                    required:
                        Boolean(
                            group.pivot?.required ??
                            group.required
                        ),

                    min_selection:
                        group.pivot?.min_selection ??
                        group.min_selection,

                    max_selection:
                        group.pivot?.max_selection ??
                        group.max_selection,
                    modifiers_count: group.modifiers_count,

                })) ?? [],


            food_symbols:
                menuItem.food_symbols?.map(
                    symbol => symbol.id
                ) ?? [],


            menu_item_tags:
                menuItem.menu_item_tags?.map(
                    tag => tag.id
                ) ?? [],

        });

    }, [menuItem, form]);

    const submitting =
        form.formState.isSubmitting;



    const selectedModifierGroups =
        form.watch("modifier_groups") ?? [];



    function addModifierGroups(groups: any[]) {
        console.log("ADDING GROUPS:", groups);
        const current =
            form.getValues("modifier_groups") ?? [];


        const existingIds =
            current.map(group => group.id);



        const newGroups = groups
            .filter(group => !existingIds.includes(group.id))
            .map(group => ({
                id: group.id,

                name: group.name,

                modifiers_count:
                    group.modifiers_count ?? 0,

                selection_type:
                    group.selection_type ?? "single",

                required:
                    Boolean(group.required),

                min_selection:
                    group.min_selection ?? 0,

                max_selection:
                    group.max_selection ?? 1,
            }));

        form.setValue(
            "modifier_groups",
            [
                ...current,
                ...newGroups
            ],
            {
                shouldDirty: true,
                shouldValidate: true
            }
        );

    }



    function removeModifierGroup(id: number) {

        const current =
            form.getValues("modifier_groups") ?? [];


        form.setValue(
            "modifier_groups",
            current.filter(
                group => group.id !== id
            ),
            {
                shouldDirty: true
            }
        );

    }



    return (

        <FormProvider {...form}>


            <form
                onSubmit={form.handleSubmit(
                    async (values) => {
                        await onSubmit(values);
                    },
                    (errors) => {
                        console.log("ERRORS", errors);
                    }
                )}
            >


                <div className="mb-8">

                    <h1 className="text-xl font-bold">

                        {mode === "create"
                            ? "Create Menu Item"
                            : "Edit Menu Item"}

                    </h1>


                    <p className="text-muted-foreground mt-1 text-sm">

                        Manage item details, pricing,
                        modifiers, dietary symbols and availability.

                    </p>

                </div>



                <div className="space-y-6">


                    <GeneralInfoCard
                        categories={categories}
                    />



                    <div className="grid lg:grid-cols-3 gap-6">


                        <div className="lg:col-span-2 space-y-6">


                            <PricingCard />



                            <ModifierGroupsCard

                                groups={
                                    selectedModifierGroups
                                }


                                availableGroups={
                                    allModifierGroups
                                }


                                onAdd={
                                    addModifierGroups
                                }


                                onRemove={
                                    removeModifierGroup
                                }
                                onEdit={(group) => {

                                    setEditingGroup(group);

                                }}

                            />
                            {editingGroup && (

                                <EditMenuItemModifierGroupDialog

                                    group={editingGroup}

                                    open={!!editingGroup}

                                    onOpenChange={(open) => {

                                        if (!open)
                                            setEditingGroup(null);

                                    }}

                                    onSave={async (values) => {

                                        const groups =
                                            form.getValues("modifier_groups") ?? [];


                                        const updatedGroups = groups.map(group =>
                                            group.id === editingGroup.id
                                                ? {
                                                    ...group,

                                                    selection_type:
                                                        values.selection_type,

                                                    required:
                                                        Boolean(values.required),

                                                    min_selection:
                                                        values.min_selection,

                                                    max_selection:
                                                        values.max_selection,


                                                    pivot: {
                                                        ...group.pivot,

                                                        selection_type:
                                                            values.selection_type,

                                                        required:
                                                            Boolean(values.required),

                                                        min_selection:
                                                            values.min_selection,

                                                        max_selection:
                                                            values.max_selection,
                                                    },

                                                    name: group.name,

                                                    modifiers_count:
                                                        group.modifiers_count,
                                                }
                                                : group
                                        );


                                        form.setValue(
                                            "modifier_groups",
                                            updatedGroups,
                                            {
                                                shouldDirty: true,
                                                shouldValidate: true
                                            }
                                        );


                                        console.log("UPDATED GROUPS", updatedGroups);


                                        setEditingGroup(null);

                                    }}
                                />
                            )}


                            <FoodSymbolsCard

                                symbols={foodSymbols}

                                selectedSymbols={form.watch("food_symbols") ?? []}

                                onChange={(ids) => {

                                    form.setValue(
                                        "food_symbols",
                                        ids,
                                        {
                                            shouldDirty: true
                                        }
                                    );

                                }}

                            />

                            <TagsCard

                                tags={allTags}

                                selectedTags={
                                    form.watch("menu_item_tags") ?? []
                                }

                                onChange={(ids) => {

                                    form.setValue(
                                        "menu_item_tags",
                                        ids,
                                        {
                                            shouldDirty: true
                                        }
                                    );

                                }}

                            />


                        </div>



                        <div className="space-y-6">

                            <ImageCard />

                            <AvailabilityCard />

                        </div>


                    </div>


                </div>



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


                        {
                            mode === "create"
                                ? "Create Item"
                                : "Save Changes"
                        }

                    </Button>


                </div>


            </form>


        </FormProvider>

    );
}