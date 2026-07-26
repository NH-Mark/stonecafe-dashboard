"use client";


import {
    useEffect,
    useState
} from "react";


import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";


import {
    Button
} from "@/components/ui/button";


import {
    Input
} from "@/components/ui/input";


import {
    Checkbox
} from "@/components/ui/checkbox";


import {
    Plus
} from "lucide-react";



interface Props {

    groups: any[];
    selectedGroupIds: number[];
    onAdd: (groups: any[]) => void;

}



export default function AddModifierGroupDialog({
    groups,
    selectedGroupIds,
    onAdd
}: Props) {


    const [open, setOpen] = useState(false);

    const [selected, setSelected] = useState<number[]>([]);

    const [search, setSearch] = useState("");

    useEffect(() => {
        if (open) {
            setSelected(selectedGroupIds);
        }
    }, [open, selectedGroupIds]);

    const filtered = groups.filter(group =>
        group.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );



    function toggle(id: number) {

        setSelected(prev =>

            prev.includes(id)

                ? prev.filter(x => x !== id)

                : [...prev, id]

        );

    }



    function submit() {

        const selectedGroups =
            groups.filter(group =>
                selected.includes(group.id)
            );


        onAdd(selectedGroups);


        setSelected([]);

        setOpen(false);

    }



    return (

        <Dialog
            open={open}
            onOpenChange={setOpen}
        >


            <DialogTrigger
                render={
                    <Button size="sm">

                        <Plus className="mr-2 h-4 w-4" />

                        Add Group

                    </Button>
                }
            />




            <DialogContent>


                <DialogHeader>

                    <DialogTitle>
                        Add Modifier Groups
                    </DialogTitle>

                </DialogHeader>



                <Input

                    placeholder="Search groups..."

                    value={search}

                    onChange={(e) => setSearch(e.target.value)}

                />



                <div className="space-y-3 max-h-80 overflow-y-auto">


                    {filtered.map((group) => {

                        const isExisting = selectedGroupIds.includes(group.id);

                        return (
                            <div
                                key={group.id}
                                className="
            flex
            items-center
            gap-3
            border
            rounded-md
            p-3
            "
                            >

                                <Checkbox
                                    checked={selected.includes(group.id)}
                                    disabled={isExisting}
                                    onCheckedChange={() => toggle(group.id)}
                                />

                                <div className="flex-1">

                                    <p className="font-medium">
                                        {group.name}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        {group.modifiers_count ?? 0} options
                                    </p>

                                    {isExisting && (
                                        <span className="text-xs text-muted-foreground">
                                            Already added
                                        </span>
                                    )}

                                </div>

                            </div>
                        );

                    })}


                </div>



                <Button
                    onClick={submit}
                    disabled={selected.length === 0}
                >

                    Add Selected

                </Button>


            </DialogContent>


        </Dialog>

    );

}