import api from "@/lib/axios";


export async function getPaymentMethods() {
  return api.get("/api/payment-methods");
}