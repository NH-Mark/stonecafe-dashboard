"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cancelConfirmedOrder } from "../order.service";


interface CancelOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string | number;
  onCancelled: () => void;
}

export function CancelOrderDialog({
  open,
  onOpenChange,
  orderId,
  onCancelled,
}: CancelOrderDialogProps) {
  const [reason, setReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    if (cancelling) return;

    onOpenChange(nextOpen);

    if (!nextOpen) {
      setReason("");
    }
  }

  async function handleCancel() {
    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      toast.error("Please enter a cancellation reason.");
      return;
    }

    setCancelling(true);

    try {
      await cancelConfirmedOrder(Number(orderId), trimmedReason);

      toast.success("Order cancelled successfully.");
      setReason("");
      onOpenChange(false);
      onCancelled();
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error
          ? (
              error as {
                response?: { data?: { message?: string } };
              }
            ).response?.data?.message
          : undefined;

      toast.error(message || "Unable to cancel order.");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
          <AlertDialogDescription>
            This will cancel the confirmed order. If the kitchen ticket
            has already been sent, the kitchen must also be notified.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <label
            htmlFor="cancel-order-reason"
            className="text-sm font-medium"
          >
            Cancellation reason
          </label>

          <Textarea
            id="cancel-order-reason"
            placeholder="Enter the reason for cancellation..."
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            disabled={cancelling}
            maxLength={500}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={cancelling}>
            Keep Order
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={cancelling || !reason.trim()}
            onClick={(event) => {
                event.preventDefault();
                void handleCancel();
            }}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 disabled:pointer-events-none disabled:opacity-50"
            >
            {cancelling ? "Cancelling..." : "Confirm Cancellation"}
            </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
