
"use client";

import { useState, useEffect } from "react";
import { User, LogOut, MapPin } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/auth.service";

export default function AdminHeader() {
  const router = useRouter();
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    setLocationName(
      Cookies.get("active_location_name") ?? ""
    );
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
            <span className="font-medium">
              {locationName}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={() => router.push("/account")}
          className="flex items-center gap-2 text-gray-700 hover:text-[#40332a]"
        >
          <User size={18} />
          My Account
        </Button>

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
