"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import { useOrderStore } from "../../store/useOrderStore";


export function OrderNoteDialog({

    open,
    onClose

}: {
    open: boolean;
    onClose: () => void;

}) {


    const note =
        useOrderStore(
            state => state.orderNote
        );


    const setNote =
        useOrderStore(
            state => state.setOrderNote
        );



    return (

        <Dialog
            open={open}
            onOpenChange={onClose}
        >


            <DialogContent
                className="rounded-3xl"
            >

                <DialogHeader>

                    <DialogTitle>
                        Order Notes
                    </DialogTitle>

                </DialogHeader>



                <Textarea

                    value={note}

                    onChange={
                        e => setNote(e.target.value)
                    }

                    placeholder="
Example: Customer requested extra sauce...
"

                    rows={5}

                />



                <Button
                    onClick={onClose}
                    className="mt-4"
                >

                    Save Note

                </Button>


            </DialogContent>


        </Dialog>

    )

} 