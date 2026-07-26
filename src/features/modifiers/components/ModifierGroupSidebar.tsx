"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
    Layers,
} from "lucide-react";

import { ModifierGroup } from "@/types/modifier-group";

import CreateModifierGroupDialog from "./CreateModifierGroupDialog";
import ModifierGroupActions from "./ModifierGroupActions";

interface Props {

    groups: ModifierGroup[];

    selectedGroup: number | null;

    onSelect: (id: number | null) => void;

    onRefresh: () => Promise<void>;
}

export default function ModifierGroupSidebar({

    groups,

    selectedGroup,

    onSelect,

    onRefresh,

}: Props) {

    return (

        <Card>

            <CardHeader className="flex flex-row items-center justify-between">

                <CardTitle>

                    Modifier Groups

                </CardTitle>

                <CreateModifierGroupDialog

                    onSuccess={onRefresh}

                />

            </CardHeader>

            <CardContent className="space-y-2">

                <Button

                    variant={
                        selectedGroup === null
                            ? "secondary"
                            : "ghost"
                    }

                    className="w-full justify-start"

                    onClick={() => onSelect(null)}

                >

                    <Layers className="mr-2 h-4 w-4" />

                    All Modifiers

                </Button>

                {groups.map(group => (

                    <div

                        key={group.id}

                        className="flex items-center gap-2"

                    >

                        <Button

                            variant={
                                selectedGroup === group.id
                                    ? "secondary"
                                    : "ghost"
                            }

                            className="flex-1 justify-between"

                            onClick={() => onSelect(group.id)}

                        >

                            <span>

                                {group.name}

                            </span>

                            <span className="text-xs text-muted-foreground">

                                {group.modifiers_count ?? 0}

                            </span>

                        </Button>

                        <ModifierGroupActions

                            group={group}

                            onSuccess={onRefresh}

                        />

                    </div>

                ))}

            </CardContent>

        </Card>

    );

}