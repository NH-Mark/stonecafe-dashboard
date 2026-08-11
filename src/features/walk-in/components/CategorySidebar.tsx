import { Category } from "@/types/category";
import { imageUrl } from "@/utils/image";
import { Pizza, ChevronRight } from "lucide-react";


interface Props {

    categories: Category[];

    selectedCategory: number | null;

    onSelectCategory: (id: number | null) => void;

}



export function CategorySidebar({
    categories,
    selectedCategory,
    onSelectCategory

}: Props) {


    return (

        <div
            className="
                flex
                h-full
                min-h-0
                flex-col
                overflow-y-auto
                rounded-3xl
                bg-white
                shadow-sm
            "
        >


            {/* Header */}

            <div className="border-b p-5">

                <h2 className="text-lg font-bold text-slate-800">
                    Categories
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Choose menu section
                </p>

            </div>



            {/* Category list */}

            <div
                className="
                    flex-1
                    min-h-0
                    space-y-2
                    overflow-y-auto
                    p-4
                "
            >


                {/* All */}

                <button

                    onClick={() => onSelectCategory(null)}

                    className={`
                        group
                        flex
                        w-full
                        items-center
                        justify-between
                        rounded-2xl
                        p-3
                        transition-all
                        duration-200

                        ${
                            selectedCategory === null
                            ?
                            "bg-primary text-white shadow-md"
                            :
                            "text-slate-700 hover:bg-slate-100"
                        }
                    `}
                >

                    <div className="flex items-center gap-3">

                        <div
                            className={`
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl

                                ${
                                    selectedCategory === null
                                    ?
                                    "bg-white/20"
                                    :
                                    "bg-slate-100"
                                }
                            `}
                        >

                            <Pizza className="h-5 w-5"/>

                        </div>


                        <span className="font-medium text-sm">
                            All Items
                        </span>


                    </div>


                    <ChevronRight
                        className="
                            h-4
                            w-4
                            opacity-60
                        "
                    />

                </button>





                {
                    categories.map((item)=>{


                        const active = selectedCategory === item.id;


                        return (

                            <button

                                key={item.id}

                                onClick={() => onSelectCategory(item.id)}

                                className={`
                                    group
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-2xl
                                    p-3
                                    transition-all
                                    duration-200

                                    ${
                                        active
                                        ?
                                        "bg-primary text-white shadow-md"
                                        :
                                        "text-slate-700 hover:bg-slate-100"
                                    }
                                `}

                            >


                                <div className="flex items-center gap-3">


                                    <div
                                        className={`
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            overflow-hidden
                                            rounded-xl

                                            ${
                                                active
                                                ?
                                                "bg-white/20"
                                                :
                                                "bg-slate-100"
                                            }
                                        `}
                                    >

                                        {
                                            item.image
                                            ?

                                            <img
                                                src={imageUrl(item.image)}
                                                alt={item.name}
                                                className="
                                                    h-full
                                                    w-full
                                                    object-cover
                                                "
                                            />

                                            :

                                            <Pizza className="h-5 w-5"/>

                                        }


                                    </div>



                                    <div className="text-left">

                                        <p className="font-medium text-sm">
                                            {item.name}
                                        </p>


                                        {
                                            item.menu_items_count !== undefined && (

                                                <p
                                                    className={`
                                                        text-xs

                                                        ${
                                                            active
                                                            ?
                                                            "text-white/80"
                                                            :
                                                            "text-slate-400"
                                                        }
                                                    `}
                                                >
                                                    {item.menu_items_count} items
                                                </p>

                                            )
                                        }


                                    </div>


                                </div>



                                <ChevronRight
                                    className={`
                                        h-4
                                        w-4
                                        transition-transform

                                        ${
                                            active
                                            ?
                                            "translate-x-1"
                                            :
                                            "opacity-40"
                                        }
                                    `}
                                />


                            </button>

                        )

                    })
                }


            </div>


        </div>

    )

}