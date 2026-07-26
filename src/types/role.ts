export interface Role {
  id: number;
  name: string;
  users_count?: number;
  permissions: string[];
}