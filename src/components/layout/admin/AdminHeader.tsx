
"use client";

import { useState, useEffect } from "react";
import { User, LogOut, MapPin, ChevronDown } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/useAuth";
import { logout } from "@/features/auth/auth.service";

export default function AdminHeader() {
  const router = useRouter();
  const { user } = useAuth();
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    setLocationName(Cookies.get("active_location_name") ?? "");
  }, []);

  const handleLogout = async () => {
    try {
      await logout();

      Cookies.remove("token");
      Cookies.remove("active_location_id");
      Cookies.remove("active_location_name");

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#d9d9d8] px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-[#40332a]">
          Stone Cafe Dashboard
        </h1>

        {locationName && (
          <div className="flex items-center gap-2 rounded-lg bg-[#a57653]/10 px-3 py-2 text-sm text-[#40332a]">
            <MapPin size={16} className="text-[#a57653]" />
            <span className="font-medium">{locationName}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-gray-700 hover:text-[#40332a]"
                type="button"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#a57653]/10 text-[#40332a]">
                  <User size={16} />
                </div>
                <div className="hidden text-left sm:block">
                  <div className="text-sm font-medium text-[#40332a]">
                    {user?.name ?? "My Account"}
                  </div>
                </div>
                <ChevronDown size={16} />
              </Button>
            }
          />

          <DropdownMenuContent align="end" className="w-64 p-2">
            <div className="px-2 py-2">
              <p className="text-sm font-semibold text-[#40332a]">
                {user?.name ?? "User"}
              </p>
              <p className="text-xs text-gray-500">{user?.email ?? "No email"}</p>
            </div>

            <DropdownMenuItem
              onClick={() => router.push("/account")}
              className="cursor-pointer"
            >
              Edit Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-700 hover:text-[#40332a]"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </header>
  );
}
