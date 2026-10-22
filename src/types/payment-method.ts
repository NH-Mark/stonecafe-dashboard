export interface PaymentMethod {
    id:number;
    name:string;
    code:string;
    status:boolean;
    sort_order?: number;
}