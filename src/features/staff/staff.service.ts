import api from "@/lib/axios";


export interface GetStaffParams {
page?: number;
per_page?: number;
search?: string;
role_id?: number | null;
}

export function getStaff(
params: GetStaffParams = {}
) {
return api.get("/api/users", {
params: {
page: params.page,
per_page: params.per_page,
search: params.search || undefined,
role_id:
params.role_id ?? undefined,
},
});
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