import { LucideIcon } from "lucide-react";

export interface AdminMenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permission?: string | null;
  children?: AdminMenuItem[];
}