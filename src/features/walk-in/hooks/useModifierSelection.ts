import { useMemo, useState } from "react";
import { MenuItem } from "@/types/menu-item";


export function useModifierSelection(
    item: MenuItem | null
) {

    const [selected, setSelected] = useState<
        Record<number, number[]>
    >({});


    const [note, setNote] = useState("");



    function toggle(
        groupId: number,
        modifierId: number
    ) {

        setSelected(prev => {

            const current =
                prev[groupId] ?? [];


            if (current.includes(modifierId)) {

                return {
                    ...prev,

                    [groupId]:
                        current.filter(
                            id => id !== modifierId
                        )
                };
            }


            return {
                ...prev,

                [groupId]: [
                    ...current,
                    modifierId
                ]
            };

        });

    }



    function selectSingle(
        groupId: number,
        modifierId: number
    ) {

        setSelected(prev => ({
            ...prev,

            [groupId]: [
                modifierId
            ]
        }));

    }



    const total = useMemo(() => {

        if (!item) {
            return 0;
        }


        let value =
            Number(item.price);



        item.modifier_groups?.forEach(group => {


            const ids =
                selected[group.id] ?? [];



            group.modifiers
                .filter(
                    modifier =>
                        ids.includes(
                            modifier.id
                        )
                )
                .forEach(
                    modifier => {

                        value += Number(
                            modifier.price
                        );

                    }
                );


        });


        return value;


    }, [
        item,
        selected
    ]);





    const valid = useMemo(() => {


        if (!item) {
            return false;
        }



        return item.modifier_groups?.every(group => {


            const config =
                group.pivot ?? {

                    required:
                        group.required,

                    min_selection:
                        group.min_selection,

                    max_selection:
                        group.max_selection,

                    selection_type:
                        group.selection_type

                };



            if (!config.required) {

                return true;

            }



            const count =
                selected[group.id]?.length ?? 0;



            return count >= config.min_selection;


        }) ?? true;



    }, [
        item,
        selected
    ]);





   return {

    selected,

    setSelected,

    note,

    setNote,

    toggle,

    selectSingle,

    total,

    valid

};

}