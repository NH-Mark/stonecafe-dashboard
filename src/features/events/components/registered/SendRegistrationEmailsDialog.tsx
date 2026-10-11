
"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";

import { Registered } from "@/types/registered";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type RegistrationEmailGroup =
    | "selected"
    | "not_selected"
    | "waitlisted";

interface Props {
    registrations: Registered[];
    onSend: (
        eventId: number,
        group: RegistrationEmailGroup
    ) => Promise<void>;
}

const groups: {
    value: RegistrationEmailGroup;
    label: string;
    description: string;
}[] = [
    {
        value: "selected",
        label: "Selected members",
        description:
            "Send the selection confirmation email.",
    },
    {
        value: "not_selected",
        label: "Non-selected members",
        description:
            "Notify applicants who were not selected.",
    },
    {
        value: "waitlisted",
        label: "Waitlisted members",
        description:
            "Notify applicants on the waitlist.",
    },
];

export default function SendRegistrationEmailsDialog({
    registrations,
    onSend,
}: Props) {
    const [open, setOpen] = useState(false);
    const [eventId, setEventId] = useState("");
    const [group, setGroup] =
        useState<RegistrationEmailGroup>("selected");
    const [confirming, setConfirming] = useState(false);
    const [sending, setSending] = useState(false);

    const events = useMemo(() => {
        const uniqueEvents = new Map<
            number,
            { id: number; name: string }
        >();

        registrations.forEach((registration) => {
            if (registration.event) {
                uniqueEvents.set(registration.event_id, {
                    id: registration.event_id,
                    name: registration.event.name,
                });
            }
        });

        return Array.from(uniqueEvents.values());
    }, [registrations]);

    useEffect(() => {
        if (!events.length) {
            setEventId("");
            return;
        }

        if (!events.some((event) => String(event.id) === eventId)) {
            setEventId(String(events[0].id));
        }
    }, [events, eventId]);

    const selectedGroup = groups.find(
        (item) => item.value === group
    );

    // This is a preview of registrations currently loaded in the table,
    // not a guaranteed server-wide count.
    const recipientCount = registrations.filter(
        (registration) =>
            String(registration.event_id) === eventId &&
            registration.selection_status === group &&
            Boolean(registration.email)
    ).length;

    async function handleSend() {
        if (!eventId) {
            toast.error("Please select an event.");
            return;
        }

        try {
            setSending(true);
            await onSend(Number(eventId), group);
            toast.success("Email campaign request submitted.");
            setOpen(false);
            setConfirming(false);
        } catch {
            toast.error("Could not submit the email campaign.");
        } finally {
            setSending(false);
        }
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <Mail className="mr-2 h-4 w-4" />
                Send Emails
            </Button>

            <Dialog
                open={open}
                onOpenChange={(nextOpen) => {
                    setOpen(nextOpen);

                    if (!nextOpen) {
                        setConfirming(false);
                    }
                }}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            Send registration emails
                        </DialogTitle>
                        <DialogDescription>
                            Choose an event and the group of applicants
                            you want to contact.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Event
                            </label>

                            <Select
                                value={eventId}
                                onValueChange={(value) => {
                                    if (value) setEventId(value);
                                    setConfirming(false);
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select an event">
                                        {events.find(
                                            (event) => String(event.id) === eventId
                                        )?.name}
                                    </SelectValue>
                                </SelectTrigger>

                                <SelectContent>
                                    {events.map((event) => (
                                        <SelectItem
                                            key={event.id}
                                            value={String(event.id)}
                                        >
                                            {event.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Recipient group
                            </label>

                            <Select
                                value={group}
                                onValueChange={(value) => {
                                    if (
                                        value === "selected" ||
                                        value === "not_selected" ||
                                        value === "waitlisted"
                                    ) {
                                        setGroup(value);
                                        setConfirming(false);
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a group">
                                        {groups.find((item) => item.value === group)?.label}
                                    </SelectValue>
                                </SelectTrigger>

                                <SelectContent>
                                    {groups.map((item) => (
                                        <SelectItem
                                            key={item.value}
                                            value={item.value}
                                        >
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <p className="text-sm text-muted-foreground">
                                {selectedGroup?.description}
                            </p>
                        </div>

                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">
                                Matching recipients on the current page
                            </p>

                            <p className="mt-1 text-2xl font-semibold">
                                {recipientCount}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                The final recipient count must be calculated
                                by the backend across all matching registrations.
                            </p>
                        </div>

                        {confirming && (
                            <div className="rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-sm">
                                Confirm sending the{" "}
                                <strong>{selectedGroup?.label}</strong>{" "}
                                campaign for this event.
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                                setConfirming(false);
                            }}
                            disabled={sending}
                        >
                            Cancel
                        </Button>

                        {!confirming ? (
                            <Button
                                onClick={() => setConfirming(true)}
                                disabled={!eventId}
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSend}
                                disabled={sending || !eventId}
                            >
                                <Send className="mr-2 h-4 w-4" />
                                {sending ? "Submitting..." : "Confirm"}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}