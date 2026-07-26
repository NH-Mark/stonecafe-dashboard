"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Badge
} from "@/components/ui/badge";

import {
    Input
} from "@/components/ui/input";

import {
    Check,
    Search,
    X,
    Tag as TagIcon
} from "lucide-react";

import {
    useState
} from "react";


interface Tag {
    id:number;
    name:string;
    active:boolean;
}


interface Props {

    tags:Tag[];

    selectedTags:number[];

    onChange:(ids:number[])=>void;

}



export default function TagsCard({

    tags,

    selectedTags,

    onChange

}:Props){


    const [search,setSearch] = useState("");



    const filteredTags = tags.filter(tag =>

        tag.name
            .toLowerCase()
            .includes(
                search.toLowerCase()
            )

    );



    const selected =
        tags.filter(tag =>
            selectedTags.includes(tag.id)
        );



    function toggleTag(id:number){

        if(selectedTags.includes(id)){

            onChange(
                selectedTags.filter(
                    x => x !== id
                )
            );

        }else{

            onChange([
                ...selectedTags,
                id
            ]);

        }

    }



    return (

        <Card>


            <CardHeader>

                <div className="flex items-center gap-2">

                    <div
                        className="
                        rounded-md
                        bg-muted
                        p-2
                        "
                    >
                        <TagIcon
                            className="
                            h-4
                            w-4
                            "
                        />
                    </div>


                    <div>

                        <CardTitle>
                            Menu Tags
                        </CardTitle>


                        <CardDescription>
                            Add labels for filtering and organization.
                        </CardDescription>

                    </div>

                </div>


            </CardHeader>



            <CardContent className="space-y-5">



                {/* Selected */}

                <div className="space-y-2">


                    <p className="text-sm font-medium">
                        Selected Tags
                    </p>


                    {
                        selected.length === 0 ? (

                            <div
                                className="
                                rounded-lg
                                border
                                border-dashed
                                p-4
                                text-sm
                                text-muted-foreground
                                "
                            >

                                No tags selected

                            </div>


                        ) : (


                            <div
                                className="
                                flex
                                flex-wrap
                                gap-2
                                "
                            >

                                {
                                    selected.map(tag=>(

                                        <Badge

                                            key={tag.id}

                                            variant="secondary"

                                            className="
                                            gap-1
                                            px-3
                                            py-1
                                            "

                                        >

                                            {tag.name}


                                            <button

                                                type="button"

                                                onClick={() =>
                                                    toggleTag(tag.id)
                                                }

                                                className="
                                                hover:text-destructive
                                                "

                                            >

                                                <X
                                                    className="
                                                    h-3
                                                    w-3
                                                    "
                                                />

                                            </button>


                                        </Badge>


                                    ))
                                }


                            </div>


                        )
                    }


                </div>




                {/* Search */}


                <div className="relative">


                    <Search

                        className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        h-4
                        w-4
                        text-muted-foreground
                        "

                    />


                    <Input

                        className="pl-9"

                        placeholder="Search tags..."

                        value={search}

                        onChange={(e)=>
                            setSearch(
                                e.target.value
                            )
                        }

                    />


                </div>




                {/* Tag picker */}


                <div
                    className="
                    grid
                    grid-cols-2
                    md:grid-cols-3
                    gap-3
                    max-h-64
                    overflow-y-auto
                    pr-1
                    "
                >


                    {
                        filteredTags.length === 0 ? (


                            <div
                                className="
                                col-span-full
                                rounded-lg
                                border
                                border-dashed
                                p-8
                                text-center
                                text-sm
                                text-muted-foreground
                                "
                            >

                                No tags found


                            </div>


                        ) : (


                            filteredTags.map(tag=>(


                                <button

                                    key={tag.id}

                                    type="button"

                                    onClick={() =>
                                        toggleTag(tag.id)
                                    }


                                    className={`
                                    relative
                                    rounded-lg
                                    border
                                    p-3
                                    text-left
                                    transition
                                    hover:bg-muted

                                    ${
                                        selectedTags.includes(tag.id)
                                        ?
                                        "border-primary bg-primary/5"
                                        :
                                        ""
                                    }

                                    `}


                                >


                                    <div className="flex items-center justify-between">


                                        <span
                                            className="
                                            text-sm
                                            font-medium
                                            "
                                        >

                                            {tag.name}

                                        </span>



                                        {
                                            selectedTags.includes(tag.id)
                                            &&

                                            <Check
                                                className="
                                                h-4
                                                w-4
                                                text-primary
                                                "
                                            />

                                        }


                                    </div>


                                </button>


                            ))


                        )
                    }


                </div>


            </CardContent>


        </Card>

    );

}