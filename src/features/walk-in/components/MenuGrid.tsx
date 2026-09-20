import { useEffect, useState } from "react";
import { MenuItemCard } from "./MenuItemCard";
import { getMenuItems, listMenuItems } from "@/features/menu/menu.service";
import PageLoader from "@/components/common/PageLoader";
import { useMenuSearch } from "../store/useMenuSearch";


export function MenuGrid({ categoryId }: {
    categoryId: number | null
}) {

    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const search =
        useMenuSearch(
            state=>state.search
        );

    useEffect(() => {

        loadMenuItems();

    }, [categoryId]);


    async function loadMenuItems() {

        try {
            setLoading(true);
            const response = categoryId
                ? await listMenuItems(categoryId)
                : await listMenuItems();
            setItems(response.data.data);

        } catch(error) {

            console.error("Menu loading error:", error);

            setItems([]);

        } finally {

            setLoading(false);

        }

    }
    const filteredItems =
        items.filter(item =>
            item.name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );
          console.log("filteredItems");

    console.log(filteredItems);



    return (

        <div
    className="
        flex
        h-full
        min-h-0
        flex-col
        overflow-hidden
        rounded-3xl
        bg-white
        shadow-sm
    "
>
    <div
        className="
            flex-1
            min-h-0
            overflow-y-auto
            p-4
        "
    >
        {/* cards */}
    


            <div className="border-b p-5">

                <h2 className="text-xl font-semibold">
                    Menu
                </h2>

            </div>


            <div
                className="
                     grid
                    min-h-0
                    flex-1
                    grid-cols-2
                    gap-4
                    overflow-y-auto
                    p-4
                    md:grid-cols-4
                    md:gap-5
                    md:p-5
                "
            >


                {
                        loading && (

                            <div
                                className="
                                   col-span-2
                                    flex
                                    h-full
                                    min-h-[300px]
                                    items-center
                                    justify-center
                                    md:col-span-4
                                "
                            >
                                <PageLoader />
                            </div>

                        )
                    }
                {
                    !loading && filteredItems.map((item) => (

                        <MenuItemCard
                            key={item.id}
                            item={item}
                        />

                    ))
                }



                {
                    !loading && filteredItems.length === 0 && (

                        <div className="col-span-2
                                        text-center
                                        text-gray-500
                                        md:col-span-4">

                            No menu items found

                        </div>

                    )
                }


            </div>


        </div>
</div>

    );

}