import api from "@/lib/axios";
import type { EmployeeLog } from "@/types/employee-log";

export async function getEmployeeLogs() {
    return api.get<EmployeeLog[]>("/api/employee-logs");
}
