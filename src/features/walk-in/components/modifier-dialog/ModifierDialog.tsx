"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { useModifierDialog } from "../../store/useModifierDialog";
import { useOrderStore } from "../../store/useOrderStore";

import { useModifierSelection } from "../../hooks/useModifierSelection";

import { ModifierGroupCard } from "./ModifierGroupCard";
import { OrderNotes } from "./OrderNotes";
import { OrderSummary } from "./OrderSummary";
import { useEffect } from "react";


export function ModifierDialog() {

    const {
        open,
        item,
        closeDialog,
        editItem
    } = useModifierDialog();


    const addItem =
        useOrderStore(
            state => state.addItem
        );


    const updateItem =
        useOrderStore(
            state => state.updateItem
        );


    const selection =
        useModifierSelection(item);






    const {

        selected,

        setSelected,

        note,

        setNote,

        toggle,

        selectSingle,

        total,

        valid


    } = selection;
    useEffect(() => {

        if (!open) {
            return;
        }


        if (!editItem) {

            setSelected({});

            setNote("");

            return;

        }



        const existing: Record<number, number[]> = {};



        editItem.modifiers.forEach(mod => {

            if (!existing[mod.groupId]) {

                existing[mod.groupId] = [];

            }


            existing[mod.groupId].push(
                mod.id
            );

        });



        setSelected(existing);


        setNote(
            editItem.note ?? ""
        );


    }, [
        open,
        editItem
    ]);

    if (!item) {
        return null;
    }


    const menuItem = item;



    function save() {

        const modifiers =
            menuItem.modifier_groups?.flatMap(group => {

                const ids =
                    selected[group.id] ?? [];


                return group.modifiers
                    .filter(
                        modifier =>
                            ids.includes(modifier.id)
                    )
                    .map(modifier => ({

                        id: modifier.id,

                        groupId: group.id,

                        groupName: group.name,

                        name: modifier.name,

                        price: Number(
                            modifier.price
                        )

                    }));

            }) ?? [];



        if (editItem) {


            updateItem(
                editItem.lineId,
                {

                    modifiers,

                    note

                }
            );


        }
        else {
            addItem({

                lineId:
                    crypto.randomUUID(),

                menuItem,

                quantity: 1,

                modifiers,

                note

            });


        }
        setSelected({});
        setNote("");


        closeDialog();

    }




    return (

        <Dialog
            open={open}
            onOpenChange={closeDialog}
        >

            <DialogContent
                className="
                !max-w-3xl
                w-[95vw]
                max-h-[90vh]
                overflow-y-auto
                rounded-3xl
                p-6
            "
            >

                <DialogHeader>

                    <DialogTitle>
                        {item.name}
                    </DialogTitle>

                </DialogHeader>
                <div
                    className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-4
                    "
                >


                    {
                        item.modifier_groups?.map(group => (

                            <ModifierGroupCard

                                key={group.id}

                                group={group}

                                selected={selected}

                                toggle={toggle}

                                selectSingle={selectSingle}

                            />

                        ))
                    }
                </div>

                <OrderNotes

                    value={note}

                    onChange={setNote}

                />


                <OrderSummary
                    total={total}
                />


                <div
                    className="
        sticky
        bottom-0
        bg-white
        pt-4
    "
                >

                    <Button

                        disabled={!valid}

                        onClick={save}

                        className="
            h-10
            w-full
            rounded-2xl
            text-lg
            shadow-xl
        "

                    >

                        Add To Order

                    </Button>

                </div>


            </DialogContent>

        </Dialog>

    );

}