import { Modifier } from "./modifier";

export interface ModifierGroup {
    id: number;

    name: string;
    name_ar: string;

    required: boolean;
    selection_type: "single" | "multiple";

    min_selection: number | null;

    max_selection: number | null;

    active: boolean;
    modifiers: Modifier[];


    modifiers_count?: number;
    pivot:{

        selection_type:"single"|"multiple";

        required:boolean;

        min_selection:number;

        max_selection:number;

    };
}