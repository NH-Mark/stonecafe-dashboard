export interface InventorySupplier {
    id: number;
    supplier_code?: string | null;
    name: string;
    email?: string | null;
    phone?: string | null;
    alternate_phone?: string | null;
    tax_number?: string | null;
    address?: string | null;
    city?: string | null;
    country?: string | null;
    notes?: string | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}
