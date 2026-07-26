"use client";


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


import {
    Category
} from "@/types/category";


import {
    useState
} from "react";
import { ModifierGroup } from "@/types/modifier-group";
import EditModifierGroupDialog from "./EditModifierGroupDialog";
import DeleteModifierGroupDialog from "./DeleteModifierGroupDialog";


interface Props {
    group: ModifierGroup;
    onSuccess: () => Promise<void>;
}

export default function ModifierGroupActions({
    group,
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

                            <MoreHorizontal className="h-4 w-4" />

                        </Button>

                    }

                />



                <DropdownMenuContent align="end">


                    <DropdownMenuItem

                        onClick={() => setEditOpen(true)}

                    >

                        <Pencil className="mr-2 h-4 w-4" />

                        Edit

                    </DropdownMenuItem>



                    <DropdownMenuItem

                        className="text-destructive"

                        onClick={() => setDeleteOpen(true)}

                    >

                        <Trash2 className="mr-2 h-4 w-4" />

                        Delete

                    </DropdownMenuItem>


                </DropdownMenuContent>


            </DropdownMenu>




            <EditModifierGroupDialog

                open={editOpen}

                onOpenChange={setEditOpen}

                group={group}

                onSuccess={onSuccess}

            />

            <DeleteModifierGroupDialog

                open={deleteOpen}

                onOpenChange={setDeleteOpen}

                group={group}

                onSuccess={onSuccess}

            />


        </>


    );

}