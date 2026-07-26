"use client";

import { useState } from "react";

import {
    MoreHorizontal,
    Pencil,
    Trash2
} from "lucide-react";


import {
    Button
} from "@/components/ui/button";


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";




import { Modifier } from "@/types/modifier";
import EditModifierDialog from "./EditModifierDialog";
import DeleteModifierDialog from "./DeleteModifierDialog";


interface Props {

    modifier: Modifier;

    groups: {
        id: number;
        name: string;
    }[];

    onSuccess: () => Promise<void>;

}



export default function ModifierActions({

    modifier,
    groups,
    onSuccess

}: Props) {


    const [editOpen, setEditOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);



    return (

        <>

            <DropdownMenu>


                <DropdownMenuTrigger
                    render={
                        <Button
                            variant="ghost"
                            size="icon"
                        >
                            <MoreHorizontal
                                className="h-4 w-4"
                            />
                        </Button>
                    }
                />


                <DropdownMenuContent align="end">


                    <DropdownMenuItem
                        onClick={() =>
                            setEditOpen(true)
                        }
                    >

                        <Pencil className="mr-2 h-4 w-4" />

                        Edit

                    </DropdownMenuItem>



                    <DropdownMenuItem
                        onClick={() =>
                            setDeleteOpen(true)
                        }
                    >

                        <Trash2 className="mr-2 h-4 w-4" />

                        Delete

                    </DropdownMenuItem>



                </DropdownMenuContent>


            </DropdownMenu>



            <EditModifierDialog

                modifier={modifier}

                groups={groups}

                open={editOpen}

                onOpenChange={setEditOpen}

                onSuccess={onSuccess}

            />



            <DeleteModifierDialog

                modifier={modifier}

                open={deleteOpen}

                onOpenChange={setDeleteOpen}

                onSuccess={onSuccess}

            />


        </>

    );


}