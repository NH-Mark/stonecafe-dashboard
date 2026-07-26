export type AccountForm = {
  name: string;
  email: string;
  location_id: number | "";
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};