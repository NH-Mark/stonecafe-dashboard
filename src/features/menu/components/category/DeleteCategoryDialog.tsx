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
    Category
} from "@/types/category";


import {
    deleteCategory
} from "../../category.service";


import {
    toast
} from "sonner";



interface Props {

    category: Category;

    open: boolean;

    onOpenChange: (open: boolean) => void;

    onSuccess: () => Promise<void>;

}



export default function DeleteCategoryDialog({

    category,

    open,

    onOpenChange,

    onSuccess

}: Props) {



    const [loading, setLoading] = useState(false);



    async function remove() {


        try {


            setLoading(true);



            await deleteCategory(
                category.id
            );



            toast.success(
                "Category deleted"
            );



            await onSuccess();



            onOpenChange(false);



        }

        catch (error) {


            toast.error(
                "Failed to delete category"
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
                        Delete Category
                    </DialogTitle>


                </DialogHeader>



                <p className="text-sm text-muted-foreground">

                    Are you sure you want to delete

                    <strong className="mx-1">
                        {category.name}
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