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
        modifierId:number
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

                        value={
                            selected[group.id]?.[0]?.toString() ?? ""
                        }

                        onValueChange={
                            (value) =>
                                selectSingle(
                                    group.id,
                                    Number(value)
                                )
                        }


                        className="space-y-3"

                    >


                        {
                            group.modifiers.map(
                                modifier => (

                                    <ModifierOption

                                        key={modifier.id}

                                        modifier={modifier}

                                        type="single"

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