import api from "@/lib/axios";

export interface CreateImportResponse {
  success: boolean;
  message?: string;
  data: {
    import_id: number;
  };
}

export async function createSapaadImport(
  ordersFile: File,
  itemsFile: File
): Promise<CreateImportResponse> {
  const formData = new FormData();

  formData.append("orders_file", ordersFile);
  formData.append("items_file", itemsFile);

  const response = await api.post<CreateImportResponse>(
    "/api/imports/sapaad",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}