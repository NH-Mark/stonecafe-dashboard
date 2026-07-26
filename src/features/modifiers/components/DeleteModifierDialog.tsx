"use client";


import {
    Trash2
} from "lucide-react";


import {
    Button
} from "@/components/ui/button";


import {
    toast
} from "sonner";


import {
    deleteModifier
} from "../modifier.service";


import {
    Modifier
} from "@/types/modifier";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { useState } from "react";


interface Props {
   open: boolean;
    onOpenChange: (open: boolean) => void;
    modifier: Modifier;

    onSuccess: () => Promise<void>;

}



export default function DeleteModifierDialog({
    open,onOpenChange,
    modifier,
    onSuccess

}: Props) {
    const [loading, setLoading] = useState(false);


    async function remove() {


        try {


            await deleteModifier(
                modifier.id
            );


            toast.success(
                "Modifier deleted"
            );


            await onSuccess();



        } catch (error) {


            toast.error(
                "Delete failed"
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
                        Delete Category
                    </DialogTitle>


                </DialogHeader>



                <p className="text-sm text-muted-foreground">

                    Are you sure you want to delete

                    <strong className="mx-1">
                        {modifier.name}
                    </strong>

                    ?


                </p>



                <DialogFooter>


                    <Button

                        variant="outline"

                        onClick={() =>
                            onOpenChange(false)
                        }

                    >

                        Cancel

                    </Button>



                    <Button

                        variant="destructive"

                        disabled={loading}

                        onClick={remove}

                    >


                        <Trash2 className="mr-2 h-4 w-4" />

                        {
                            loading
                                ?
                                "Deleting..."
                                :
                                "Delete"
                        }


                    </Button>


                </DialogFooter>



            </DialogContent>


        </Dialog>

    );


}