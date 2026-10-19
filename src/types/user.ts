import { Location } from "./location";
import { Role } from "./role";



export interface User {

    id:number;

    name:string;

    email:string;
    
    locations: Location[];


    roles:Role[];


    permissions:string[];

    status?: boolean;

}