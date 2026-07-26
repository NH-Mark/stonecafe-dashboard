import api from "@/lib/axios";
import { RoleFormValues } from "./role.schema";

export async function createRole(data: {
  name: string;
  permissions: string[];
}) {
  const response = await api.post("/api/roles", data);
  return response.data;
}

export async function getRoles() {
  return api.get("/api/roles");
}

export async function updateRole(
  id:number,
  data:RoleFormValues
){
  return api.put(
    `/api/roles/${id}`,
    data
  );
}


export async function deleteRole(
    id:number
){

    const response =
        await api.delete(
            `/api/roles/${id}`
        );


    return response.data;

}