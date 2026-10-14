
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

import { useAuth } from "./useAuth";
import PageLoader from "@/components/common/PageLoader";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const locations = user?.locations ?? [];
  const activeLocationId = Cookies.get("active_location_id");

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    // Automatically select the only permitted location.
    if (locations.length === 1) {
        const location = locations[0];
        console.log("location");
        console.log(location);

        const cookieOptions = {
          expires: 7,
          sameSite: "strict" as const,
          secure: window.location.protocol === "https:",
        };

        // Store the active location ID and display name.
        Cookies.set(
          "active_location_id",
          String(location.id),
          cookieOptions
        );

        Cookies.set(
          "active_location_name",
          location.name,
          cookieOptions
        );

        if (pathname === "/select-location") {
          router.replace("/dashboard");
        }

        return;
    }

    // Multiple or no permitted locations require selection.
    if (!activeLocationId && pathname !== "/select-location") {
      router.replace("/select-location");
    }
  }, [
    loading,
    user,
    locations,
    activeLocationId,
    pathname,
    router,
  ]);

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return null;
  }

  // Prevent rendering protected content before location resolution.
  if (
    locations.length === 1 &&
    !Cookies.get("active_location_id")
  ) {
    return <PageLoader />;
  }

  if (
    locations.length !== 1 &&
    !Cookies.get("active_location_id") &&
    pathname !== "/select-location"
  ) {
    return <PageLoader />;
  }

  return <>{children}</>;
}