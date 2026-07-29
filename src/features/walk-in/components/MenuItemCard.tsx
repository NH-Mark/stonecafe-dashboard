import { Button } from "@/components/ui/button";
import { MenuItem } from "@/types/menu-item";
import { imageUrl } from "@/utils/image";
import { Plus } from "lucide-react";
import { useOrderStore } from "../store/useOrderStore";
import { useModifierDialog } from "../store/useModifierDialog";


export function MenuItemCard({
    item
}: {
    item: MenuItem
}) {

    const addItem = useOrderStore(state => state.addItem);

    const openDialog = useModifierDialog(
        state => state.openDialog
    );

    return (

        <div
            className="
                flex
                h-[280px]
                flex-col
                overflow-hidden
                rounded-3xl
                bg-white
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-1
                hover:shadow-lg
            "
        >


            {/* Image */}
            <div className="relative h-[150px] w-full shrink-0">

                <img
                    src={imageUrl(item.image)}
                    alt={item.name}
                    className="
                        h-full
                        w-full
                        object-cover
                    "
                />


                {/* Price */}
                <span
                    className="
                        absolute
                        right-3
                        top-3
                        rounded-full
                        bg-white
                        px-3
                        py-1
                        text-sm
                        font-bold
                        text-primary
                        shadow
                    "
                >
                    {item.price} QAR
                </span>

            </div>

            <div
                className="
                    flex
                    flex-1
                    flex-col
                    justify-between
                    p-4
                "
            >

                <div>

                    <h3
                        className="
                            truncate
                            text-base
                            font-semibold
                            text-slate-800
                        "
                    >
                        {item.name}
                    </h3>


                    {
                        item.category && (
                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                "
                            >
                                {item.category.name}
                            </p>
                        )
                    }

                </div>



                <Button

                    onClick={() => {

                        if (item.modifier_groups?.length) {

                            openDialog(item);

                            return;

                        }

                        addItem({

                            lineId: crypto.randomUUID(),

                            menuItem: item,

                            quantity: 1,

                            modifiers: [],

                            note: "",

                        });

                    }}

                >
                    Add
                </Button>


            </div>


        </div>

    );
}