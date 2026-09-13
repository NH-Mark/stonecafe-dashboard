import { RestaurantTable } from "../walk-in/components/tables/tables.service";

export interface OrderItemModifier {
    modifier: string;
    quantity: number;
    price: number;
}

export interface OrderItemDiscount {
    id: number;
    name: string;
    amount: number;
}

export interface OrderItem {
    id: number;
    menu_item: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    notes?: string;

    modifiers: OrderItemModifier[];
    discounts: OrderItemDiscount[];
}

export interface Payment {
    id: number;
    method: string;
    amount: number;
    reference?: string;
    received_by?: string;
    paid_at?: string;
}

export interface Order {
    id: number;
    order_no: string;

    type: string;
    order_type_code:string;
    source: string;

    customer?: string;
    table?: string;
    restaurant_table:RestaurantTable;
    cashier?: string;
    location?: string;

    status: string;
    payment_status: string;
    kitchen_status: string;

    subtotal: number;
    discount_amount: number;
    tax_amount: number;
    service_charge: number;
    total: number;

    notes?: string;
    ordered_at: string;

    items: OrderItem[];
    payments: Payment[];

    discounts?: OrderDiscount[];
    number_plate: string;
    dining_session_id:number;
    order_source_id:number;
}

export interface OrderDiscount {
    name: string;
    amount: number;
}