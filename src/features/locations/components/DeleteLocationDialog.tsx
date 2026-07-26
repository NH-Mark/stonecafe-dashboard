"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { deleteLocation } from "../location.service";
import { Location } from "@/types/location";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    location: Location;
    onSuccess: () => Promise<void>;
}

export default function DeleteLocationDialog({
    open,
    onOpenChange,
    location,
    onSuccess,
}: Props) {

    async function remove() {
        try {
            await deleteLocation(location.id);

            await onSuccess();

            onOpenChange(false);
            toast.success("Location Deleted successfully.");
        }
        catch{
            toast.error(
            "Failed to delete."
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
                        Delete Location
                    </DialogTitle>

                    <DialogDescription>
                        Are you sure you want to delete{" "}
                        <strong>{location.name}</strong>?
                        <br />
                        This action cannot be undone.
                    </DialogDescription>

                </DialogHeader>

                <DialogFooter>

                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={remove}
                    >
                        Delete
                    </Button>

                </DialogFooter>

            </DialogContent>

        </Dialog>

    );

}