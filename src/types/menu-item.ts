import { Category } from "./category";
import { FoodSymbol } from "./food-symbol";
import { MenuItemTag } from "./menu-item-tag";
import { ModifierGroup } from "./modifier-group";

export interface MenuItem {

    id: number;

    menu_category_id: number | null;

    category?: Category;

    name: string;

    code: string;

    description?: string | null;

    price: number;

    cost_price: number;

    barcode?: string | null;

    sku?: string | null;

    image?: string | null;


    modifier_groups?: {
        id:number;

        pivot?: {
            selection_type:"single"|"multiple";
            required:boolean;
            min_selection:number;
            max_selection:number;
        }

        selection_type:"single"|"multiple";
        required:boolean;
        min_selection:number;
        max_selection:number;
        modifiers_count:number;

    }[];

    
    food_symbols: FoodSymbol[];


    menu_item_tags: MenuItemTag[];


    active: boolean;
}