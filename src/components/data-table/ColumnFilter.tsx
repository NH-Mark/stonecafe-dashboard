"use client";


import {
    useState
} from "react";


import {
    Column
} from "@tanstack/react-table";


import {
    Button
} from "@/components/ui/button";


import {
    Input
} from "@/components/ui/input";


import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";


import {
    Filter
} from "lucide-react";



interface Props<TData> {

    column: Column<TData, unknown>;

}



export default function ColumnFilter<TData>({
    column
}: Props<TData>) {


    const [value, setValue] = useState(
        (column.getFilterValue() ?? "") as string
    );



    function apply() {

        column.setFilterValue(value);

    }



    function reset() {

        setValue("");

        column.setFilterValue("");

    }



    return (

        <Popover>


            <PopoverTrigger
                render={
                    <button
                        type="button"
                        className="
                            flex
                            h-6
                            w-6
                            items-center
                            justify-center
                            rounded-md
                            hover:bg-accent
                        "
                    >
                        <Filter
                            className={
                                column.getFilterValue()
                                    ? "h-3 w-3 text-primary"
                                    : "h-3 w-3 text-muted-foreground"
                            }
                        />
                    </button>
                }
            />




            <PopoverContent

                className="w-64"

                align="start"

            >


                <div className="space-y-4">


                    <select

                        className="
w-full
rounded-md
border
p-2
text-sm
"

                    >

                        <option>
                            Contains
                        </option>


                        <option>
                            Equals
                        </option>


                        <option>
                            Starts With
                        </option>


                    </select>




                    <Input

                        placeholder="Filter..."

                        value={value}

                        onChange={
                            e => setValue(e.target.value)
                        }

                    />



                    <div className="flex justify-end gap-2">


                        <Button

                            variant="outline"

                            size="sm"

                            onClick={reset}

                        >

                            Reset

                        </Button>



                        <Button

                            size="sm"

                            onClick={apply}

                        >

                            Apply

                        </Button>



                    </div>



                </div>


            </PopoverContent>


        </Popover>


    );

}