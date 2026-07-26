"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
    Plus,
    Pencil,
    Trash2,
} from "lucide-react";
import AddModifierGroupDialog from "../../components/menu-item/AddModifierGroupDialog";


interface Props {
    groups: any[];

    availableGroups: any[];

    onAdd: (groups:any[]) => void;
    onRemove: (id: number) => void;
    onEdit: (group:any) => void;
}


export default function ModifierGroupsCard({
    groups,
    availableGroups,
    onAdd,
    onRemove,
    onEdit
}: Props) {


    return (

        <Card>

            <CardHeader className="flex flex-row items-center justify-between">

                <div>

                    <CardTitle>
                        Modifier Groups
                    </CardTitle>

                    <CardDescription>
                        Add reusable choices like size, toppings and extras.
                    </CardDescription>

                </div>


                <AddModifierGroupDialog
                    groups={availableGroups}
                    selectedGroupIds={groups.map(group => group.id)}
                    onAdd={onAdd}
                />

            </CardHeader>



            <CardContent className="space-y-3">


                {
                    groups.length === 0 ? (

                        <div
                            className="
                            rounded-lg
                            border-dashed
                            border
                            p-8
                            text-center
                            "
                        >

                            <p className="font-medium">
                                No modifier groups added
                            </p>


                            <p className="text-sm text-muted-foreground">
                                Add groups customers can choose from.
                            </p>
                        </div>

                    ) : (
                      
                        groups.map((group)=> (

                            <div
                                key={group.id}
                                className="
                                rounded-lg
                                border
                                p-4
                                flex
                                justify-between
                                items-center
                                "
                            >

                                <div>


                                    <div className="flex gap-2 items-center">


                                        <h3 className="font-medium">
                                            {group.name}
                                        </h3>


                                        {
                                            Boolean(group.pivot?.required) && (

                                                <Badge variant="destructive">
                                                    Required
                                                </Badge>

                                            )
                                        }


                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">

                                        Choose{" "}
                                        {group.pivot?.min_selection ?? group.min_selection}
                                        {" - "}
                                        {group.pivot?.max_selection ?? group.max_selection}

                                        {" "}options

                                    </p>

                                    <Badge
                                        variant="outline"
                                        className="mt-2"
                                    >

                                        {group.modifiers_count ?? 0}
                                        {" "}options

                                    </Badge>


                                </div>



                                <div className="flex gap-1">


                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => onEdit(group)}
                                    >
                                        <Pencil className="h-4 w-4"/>
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => onRemove(group.id)}
                                    >

                                        <Trash2 className="h-4 w-4"/>

                                    </Button>


                                </div>


                            </div>

                        ))

                    )
                }


            </CardContent>


        </Card>

    );
}