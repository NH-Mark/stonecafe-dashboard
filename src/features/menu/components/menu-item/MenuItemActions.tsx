"use client";

import { useRouter } from "next/navigation";

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

import { MenuItem } from "@/types/menu-item";
import DeleteMenuItemDialog from "./DeleteMenuItemDialog";
import { useState } from "react";


interface Props {
    menuItem: MenuItem;
    onSuccess: () => Promise<void>;
}


export default function MenuItemActions({
    menuItem,
    onSuccess
}: Props) {

    const router = useRouter();

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
                        onClick={() =>
                            router.push(`/menu/${menuItem.id}`)
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


            <DeleteMenuItemDialog
                menu_item={menuItem}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onSuccess={onSuccess}
            />

        </>
    );
}