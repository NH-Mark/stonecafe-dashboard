
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { MapPin, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getLocationSelectors, selectLocation } from "@/features/locations/location.service";
import { Location } from "@/types/location";

export default function SelectLocationPage() {
  const router = useRouter();

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLocations() {
      try {
        const data = await getLocationSelectors();

        setLocations(data);

        // Preselect when only one location is available.
        if (data.length === 1) {
          setSelectedId(Number(data[0].id));
        }
      } catch {
        setError("Unable to load your assigned locations.");
      } finally {
        setLoading(false);
      }
    }

    loadLocations();
  }, []);

  async function handleContinue() {
    if (selectedId === null) {
      setError("Please select a location.");
      return;
    }

    const selectedLocation = locations.find(
      (location) => Number(location.id) === selectedId
    );

    if (!selectedLocation) {
      setError("Please select a valid location.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      // Validate and confirm selection with Laravel first.
      await selectLocation(selectedId);

      const cookieOptions = {
        expires: 7,
        sameSite: "strict" as const,
        secure: window.location.protocol === "https:",
      };

      // Store the active location ID and display name.
      Cookies.set(
        "active_location_id",
        String(selectedLocation.id),
        cookieOptions
      );

      Cookies.set(
        "active_location_name",
        selectedLocation.name,
        cookieOptions
      );

      router.replace("/dashboard");
    } catch {
      setError("Unable to select this location. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f3f3f3] p-4">
      <Card className="w-full max-w-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-[#40332a]">
            Select Location
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Choose the cafe location you want to work with.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {locations.length === 0 && (
            <p className="text-sm text-red-500">
              No locations are assigned to your account.
              Please contact your administrator.
            </p>
          )}

          {locations.map((location) => (
            <button
              key={location.id}
              type="button"
              onClick={() => setSelectedId(Number(location.id))}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                selectedId === Number(location.id)
                  ? "border-[#a57653] bg-[#a57653]/10 ring-1 ring-[#a57653]"
                  : "border-gray-200 bg-white hover:border-[#a57653]"
              }`}
            >
              <MapPin className="text-[#a57653]" />

              <span className="flex-1 font-medium text-[#40332a]">
                {location.name}
              </span>

              {selectedId === Number(location.id) && (
                <span className="text-sm text-[#a57653]">
                  Selected
                </span>
              )}
            </button>
          ))}

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button
            type="button"
            onClick={handleContinue}
            disabled={
              submitting ||
              selectedId === null ||
              locations.length === 0
            }
            className="h-11 w-full bg-[#40332a] text-white hover:bg-[#a57653]"
          >
            {submitting ? "Please wait..." : "Continue to Dashboard"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
