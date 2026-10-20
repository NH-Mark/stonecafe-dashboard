import {
    RadioGroup
} from "@/components/ui/radio-group";

import { ModifierOption } from "./ModifierOption";
import { ModifierGroup } from "@/types/modifier-group";

interface Props {

    group: ModifierGroup;

    selected: Record<number, number[]>;

    toggle: (
        groupId:number,
        modifierId:number
    ) => void;

    selectSingle: (
        groupId:number,
        modifierId:number | null
    ) => void;

}
export function ModifierGroupCard({

    group,

    selected,

    toggle,

    selectSingle


}: Props) {



    const config =
    group.pivot ?? {
        required: group.required,
        selection_type: "multiple"
    };

    const currentSingleValue = selected[group.id]?.[0]?.toString() ?? "";
    const isOptionalSingle =
        config.selection_type === "single" &&
        !config.required;

    return (

        <div
            className="
rounded-2xl
border
bg-slate-50
p-5
"
        >


            <div className="mb-4">

                <h3 className="font-semibold">

                    {group.name}

                </h3>


                <p className="text-sm text-muted-foreground">

                    {
                        config.required
                            ?
                            "Required"
                            :
                            "Optional"
                    }

                </p>


            </div>



            {
                config.selection_type === "single"


                    ?


                    <RadioGroup

                        value={currentSingleValue}

                        onValueChange={(value) => {
                            const nextValue = value ? Number(value) : null;

                            if (
                                isOptionalSingle &&
                                currentSingleValue === value
                            ) {
                                selectSingle(group.id, null);
                                return;
                            }

                            selectSingle(group.id, nextValue);
                        }}


                        className="space-y-3"

                    >


                        {
                            group.modifiers.map(
                                modifier => (

                                    <ModifierOption

                                        key={modifier.id}

                                        modifier={modifier}

                                        type="single"

                                        onClick={() => {
                                            if (
                                                isOptionalSingle &&
                                                selected[group.id]?.[0] === modifier.id
                                            ) {
                                                selectSingle(group.id, null);
                                                return;
                                            }

                                            selectSingle(group.id, modifier.id);
                                        }}

                                    />

                                )

                            )
                        }


                    </RadioGroup>


                    :


                    <div className="space-y-3">


                        {
                            group.modifiers.map(
                                modifier => (

                                    <ModifierOption

                                        key={modifier.id}

                                        modifier={modifier}

                                        type="multiple"

                                        checked={
                                            selected[group.id]
                                                ?.includes(
                                                    modifier.id
                                                )
                                        }

                                        onChange={() =>


                                            toggle(
                                                group.id,
                                                modifier.id
                                            )


                                        }


                                    />

                                )

                            )
                        }


                    </div>


            }


        </div>


    )

}