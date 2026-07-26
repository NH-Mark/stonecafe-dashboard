export interface ModifierGroup {
    id: number;

    name: string;

    required: boolean;
    selection_type: "single" | "multiple";

    min_selection: number | null;

    max_selection: number | null;

    active: boolean;

    modifiers_count?: number;
}