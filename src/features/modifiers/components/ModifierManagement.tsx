"use client";

import { useEffect, useState } from "react";
import { getModifierGroups, getModifiers } from "../modifier.service";
import ModifierGroupSidebar from "./ModifierGroupSidebar";
import ModifierTable from "./ModifierTable";
import CreateModifierDialog from "./CreateModifierDialog";


export default function ModifierManagement() {

    const [groups,setGroups] = useState([]);

    const [modifiers,setModifiers] = useState([]);

    const [selectedGroup,setSelectedGroup] =
        useState<number|null>(null);

    async function load(){

        const [g,m] = await Promise.all([
            getModifierGroups(),
            getModifiers(),
        ]);
        setGroups(g.data.data??g.data);

        setModifiers(m.data.data??m.data);

    }

    useEffect(()=>{

        load();

    },[]);

    const filtered =
        selectedGroup===null
        ? modifiers
        : modifiers.filter(
            (m:any)=>
                m.modifier_group_id===selectedGroup
        );

    return(

        <div className="grid lg:grid-cols-4 gap-6">

            <ModifierGroupSidebar

                groups={groups}

                selectedGroup={selectedGroup}

                onSelect={setSelectedGroup}

                onRefresh={load}

            />

            <div className="lg:col-span-3">
                <div className="flex justify-between mb-5">
                
                                    <h2 className="text-lg font-semibold">
                                        Modifiers
                                    </h2>
                
                
                                    <CreateModifierDialog
                                        groups={groups}
                                        onSuccess={load}
                
                                    />
                
                
                </div>

                <ModifierTable

                    modifiers={filtered}

                    groups={groups}

                    onSuccess={load}

                /> 

            </div>

        </div>

    );

}