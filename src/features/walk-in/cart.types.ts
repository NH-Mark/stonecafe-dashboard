import { Discount } from "@/types/discount";
import { MenuItem } from "@/types/menu-item";
import { ModifierGroup } from "@/types/modifier-group";

export interface ModifierGroupPivot {
    selection_type: "single" | "multiple";
    required: boolean;
    min_selection: number;
    max_selection: number;
}

export interface MenuItemModifierGroup extends ModifierGroup {
    pivot: ModifierGroupPivot;
}

export interface CartModifier {

    id:number;

    groupId:number;

    groupName:string;

    name:string;

    price:number;

}

export interface CartItem {

    lineId:string;

    menuItem:MenuItem;

    quantity:number;

    modifiers:CartModifier[];

    note:string;

    discount?:Discount | null;
    saved?: boolean;

}
export interface CartDiscount {

    type: "percentage" | "fixed";

    value: number;

}
