import { ModifierGroup } from "./modifier-group";

export interface Modifier {

    id: number;

    modifier_group_id: number;

    name: string;

    price: number;

    active: boolean;

    group?: ModifierGroup;
    
    modifier_group : ModifierGroup
}