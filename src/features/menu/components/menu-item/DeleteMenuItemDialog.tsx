"use client";


import {
    useState
} from "react";


import {
    Trash2
} from "lucide-react";


import {
    Button
} from "@/components/ui/button";


import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";


import {
    toast
} from "sonner";
import { MenuItem } from "@/types/menu-item";
import { deleteMenuItem } from "../../menu.service";



interface Props {

    menu_item: MenuItem;

    open: boolean;

    onOpenChange: (open: boolean) => void;

    onSuccess: () => Promise<void>;

}



export default function DeleteMenuItemDialog({

    menu_item,

    open,

    onOpenChange,

    onSuccess

}: Props) {



    const [loading, setLoading] = useState(false);



    async function remove() {


        try {


            setLoading(true);

            console.log("id");
console.log(menu_item.id);
            await deleteMenuItem(
                menu_item.id
            );



            toast.success(
                "MenuItem deleted"
            );



            await onSuccess();



            onOpenChange(false);



        }

        catch (error) {


            toast.error(
                "Failed to delete menu item"
            );


        }

        finally {


            setLoading(false);


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
                        Delete Menu Item
                    </DialogTitle>


                </DialogHeader>



                <p className="text-sm text-muted-foreground">

                    Are you sure you want to delete

                    <strong className="mx-1">
                        {menu_item.name}
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