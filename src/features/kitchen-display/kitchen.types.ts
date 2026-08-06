import { MenuItem } from "@/types/menu-item";
import { Modifier } from "@/types/modifier";

export type KitchenStatus =
    | "pending"
    | "preparing"
    | "ready";

export interface KitchenOrderModifier {
    id: number;
    modifier: Modifier;
    quantity: number;
}

export interface KitchenOrderItem {
    id: number;

    quantity: number;

    notes?: string;

    menu_item: MenuItem;

    modifiers: KitchenOrderModifier[];
    unit_price: number;
    total_price: number;
}

export interface KitchenOrder {
    id: number;

    order_no: string;

    table?: string;


    ordered_at: string;

    kitchen_status: KitchenStatus;

    notes?: string;

    items: KitchenOrderItem[];
    status:string;
    customer?: {
        id:number;
        name:string;
        phone?:string;
        email?:string;
    };

}