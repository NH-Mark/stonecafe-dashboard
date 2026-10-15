export interface SalesSummary {


    today_sales: number;


    orders: number;


    customers: number;


    average_order: number;


}





export interface SalesStat {

    title:string;

    value:string | number;

    change?:string;

    icon:string;

}

export interface SalesDashboardFilters {
    range?: string;
    start_date?: string;
    end_date?: string;
    location_id?: number;
    order_type?: string;
    order_source_id?: number;
    payment_method_id?: number;
    status?: string;
    cashier_id?: number;
    customer_id?: number;
}

export type OrderTypeSales = {

    name:string;

    value:number;

};


export interface TopItem {
  menu_item_id: number;
  name: string;
  category_id: number | null;
  category_name: string | null;
  qty: number;
  sales: number;
  cogs: number;
  profitability: {
    percentage: number;
    amount: number;
  };
}

export type TopModifier = {
    modifier_id:number;
    name: string;
    qty: number;
    sales: number;
    menu_item:string;
    price:number;
    category_id: number | null;
    category_name: string | null;
};

export type HourlyBreakdown = {
    date: string;
    hours: number[];
};
