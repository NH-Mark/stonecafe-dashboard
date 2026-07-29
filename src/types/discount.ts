export interface Discount {

    id:number;

    name:string;

    type:
    "percentage"
    |
    "fixed";


    value:number;

}