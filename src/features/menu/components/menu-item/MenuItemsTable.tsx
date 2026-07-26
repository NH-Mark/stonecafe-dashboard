"use client";

import { DataTable } from "@/components/data-table/data-table";


import { Button } from "@/components/ui/button";
import { Category } from "@/types/category";
import { MenuItem } from "@/types/menu-item";
import { menuItemColumns } from "./MenuItemColumns";
import Link from "next/link";

interface Props {

    items: MenuItem[];

    categories: Category[];

    selectedCategory: number | null;

    onSuccess: () => Promise<void>;

}

export default function MenuItemsTable({

    items,

    categories,

    selectedCategory,

    onSuccess,

}: Props) {

    return (

        <div className="space-y-5">

            <div className="flex justify-between">

                <div>

                    <h2 className="text-xl font-semibold">

                        Menu Items

                    </h2>

                </div>

                <Button>
                    <Link href="/menu/create">
                        New Menu Item
                    </Link>
                </Button>

            </div>

            <DataTable

                columns={

                    menuItemColumns({

                        categories,

                        onSuccess,

                    })

                }

                data={items}

                searchKey="name"

                placeholder="Search menu items..."

            />

        </div>

    );

}