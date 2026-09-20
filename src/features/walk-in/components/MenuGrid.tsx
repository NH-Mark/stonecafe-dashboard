
import { useEffect, useState } from "react";
import { MenuItemCard } from "./MenuItemCard";
import { listMenuItems } from "@/features/menu/menu.service";
import PageLoader from "@/components/common/PageLoader";
import { useMenuSearch } from "../store/useMenuSearch";

export function MenuGrid({
    categoryId,
}: {
    categoryId: number | null;
}) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const search = useMenuSearch(
        (state) => state.search
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
        } catch (error) {
            console.error("Menu loading error:", error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }

    const filteredItems = items.filter((item) =>
        item.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

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
            {/* Header */}

            <div
                className="
                    shrink-0
                    border-b
                    p-5
                "
            >
                <h2 className="text-xl font-semibold">
                    Menu
                </h2>
            </div>

            {/* Menu content */}

            <div
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    p-5
                "
            >
                {loading && (
                    <div
                        className="
                            flex
                            min-h-[300px]
                            items-center
                            justify-center
                        "
                    >
                        <PageLoader />
                    </div>
                )}

                {!loading && (
                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-4
                            sm:grid-cols-3
                            lg:grid-cols-4
                            xl:grid-cols-5
                        "
                    >
                        {filteredItems.map((item) => (
                            <MenuItemCard
                                key={item.id}
                                item={item}
                            />
                        ))}

                        {filteredItems.length === 0 && (
                            <div
                                className="
                                    col-span-full
                                    py-10
                                    text-center
                                    text-gray-500
                                "
                            >
                                No menu items found
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
