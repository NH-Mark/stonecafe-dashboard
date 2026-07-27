import api from "@/lib/axios";


export async function getOrders() {
  return api.get("/api/orders");
}