"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Button
} from "@/components/ui/button";

import {
    Folder,
    Plus
} from "lucide-react";

import { Category } from "@/types/category";
import CreateCategoryDialog from "./CreateCategoryDialog";
import CategoryActions from "./CategoryActions";

interface Props {

    categories: Category[];

    selectedCategory: number | null;

    onSelect: (id: number | null) => void;

    onRefresh: () => Promise<void>;

}



export default function CategorySidebar({
    categories,
    selectedCategory,
    onSelect,
    onRefresh,

}: Props) {


    return (

        <Card>

            <CardHeader>

                <div className="flex items-center justify-between">

                    <CardTitle>
                        Categories
                    </CardTitle>


                    <CreateCategoryDialog

                        onSuccess={onRefresh}

                        categories={categories}

                    />


                </div>

            </CardHeader>



            <CardContent className="space-y-2">


                <Button

                    className="w-full justify-start"

                    variant={
                        selectedCategory === null
                            ? "secondary"
                            : "ghost"
                    }

                    onClick={() => onSelect(null)}

                >

                    <Folder className="mr-2 h-4 w-4" />

                    All Items

                </Button>



                {
                    categories.map(category => (


                        <div

                            key={category.id}

                            className="flex items-center gap-1"

                        >


                            <Button

                                className="flex-1 justify-between"

                                variant={
                                    selectedCategory === category.id
                                        ? "secondary"
                                        : "ghost"
                                }

                                onClick={() => onSelect(category.id)}

                            >

                                <span>
                                    {category.name}
                                </span>


                                <span className="text-xs text-muted-foreground">

                                    {category.menu_items_count ?? 0}

                                </span>


                            </Button>



                            <CategoryActions

                                category={category}
                                categories={categories}
                                onRefresh={onRefresh}

                            />


                        </div>


                    ))

                }



            </CardContent>

        </Card>


    );

}