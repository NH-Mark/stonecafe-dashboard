import api from "@/lib/axios";


export function getStaff(){

    return api.get("/api/users");

}
export async function createStaff(
    data:{
        name:string;
        email:string;
        password:string;
        role_id:number|null;
        location_id:number|null;
    }
){

    const response =
        await api.post(
            "/api/users",
            data
        );


    return response.data;

}



export async function updateStaff(
    id:number,
    data:{
        name:string;
        email:string;
        password?:string;
        role_id:number|null;
        location_id:number|null;
    }
){

    const response =
        await api.put(
            `/api/users/${id}`,
            data
        );


    return response.data;

}



export async function deleteStaff(
    id:number
){

    const response =
        await api.delete(
            `/api/users/${id}`
        );


    return response.data;

}
export function getPermissions(){

    return api.get("/api/permissions");

}