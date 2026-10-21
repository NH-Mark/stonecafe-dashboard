"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
    CalendarDays,
    CreditCard,
    Mail,
    Phone,
    User,
    Users,
    Clock,
    Building2,
    Hash,
    Info,
} from "lucide-react";

import { Registered } from "@/types/registered";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    registration: Registered;
}

export default function RegisteredDetailsDialog({
    open,
    onOpenChange,
    registration,
}: Props) {
    const metadata = registration.metadata ?? {};
    const mailLogs = registration.mail_logs ?? [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl! p-0">
                <DialogHeader className="border-b px-5 py-4">
                    <div className="flex items-center justify-between gap-4 pr-6">
                        <div>
                            <DialogTitle className="text-lg">
                                Registration Details
                            </DialogTitle>

                            <p className="text-xs text-muted-foreground">
                                Registration #{registration.id}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <StatusBadge
                                label={registration.status}
                                type="registration"
                            />

                            <StatusBadge
                                label={registration.payment_status}
                                type="payment"
                            />
                        </div>
                    </div>
                </DialogHeader>

                <div className="max-h-[75vh] overflow-y-auto px-5 py-4">
                    {/* Attendee + Event */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <CompactSection
                            icon={<User className="h-4 w-4" />}
                            title="Attendee"
                        >
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                <DetailItem
                                    icon={<User className="h-3.5 w-3.5" />}
                                    label="Name"
                                    value={registration.full_name}
                                />

                                <DetailItem
                                    icon={<Mail className="h-3.5 w-3.5" />}
                                    label="Email"
                                    value={registration.email}
                                />

                                <DetailItem
                                    icon={<Phone className="h-3.5 w-3.5" />}
                                    label="Phone"
                                    value={registration.phone}
                                />

                        

                                <DetailItem
                                    icon={<Users className="h-3.5 w-3.5" />}
                                    label="Seats"
                                    value={registration.seat_count}
                                />
                            </div>
                        </CompactSection>

                        <CompactSection
                            icon={<CalendarDays className="h-4 w-4" />}
                            title="Event"
                        >
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                <DetailItem
                                    label="Event"
                                    value={registration.event?.name}
                                />

                                <DetailItem
                                    label="Time Slot"
                                    value={registration.timeSlot?.name}
                                />

                                <DetailItem
                                    icon={
                                        <CalendarDays className="h-3.5 w-3.5" />
                                    }
                                    label="Date"
                                    value={
                                        registration.event?.date
                                            ? new Date(registration.event.date).toLocaleDateString(
                                                "en-GB",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )
                                            : null
                                    }
                                />

                                <DetailItem
                                    icon={<Clock className="h-3.5 w-3.5" />}
                                    label="Time"
                                    value={
                                        registration.timeSlot
                                            ? `${formatTime(
                                                registration.timeSlot.start_time
                                            )} - ${formatTime(
                                                registration.timeSlot.end_time
                                            )}`
                                            : null
                                    }
                                />
                            </div>
                        </CompactSection>
                    </div>

                    <Separator className="my-5" />

                    {/* Payment */}
                    <CompactSection
                        icon={<CreditCard className="h-4 w-4" />}
                        title="Payment & Registration"
                    >
                        <div className="grid grid-cols-2 gap-x-5 gap-y-3 md:grid-cols-4">
                            <DetailItem
                                icon={<Hash className="h-3.5 w-3.5" />}
                                label="Registration ID"
                                value={registration.id}
                            />

                            <DetailItem
                                label="Amount"
                                value={
                                    registration.payment_amount !== null
                                        ? `${registration.payment_amount} ${
                                              registration.payment_currency ??
                                              ""
                                          }`
                                        : null
                                }
                            />

                            <DetailItem
                                label="Reference"
                                value={registration.payment_reference}
                            />

                           <DetailItem
                                label="Paid At"
                                value={
                                    registration.paid_at
                                        ? new Date(
                                            registration.paid_at
                                        ).toLocaleDateString([], {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })
                                        : null
                                }
                            />
                        </div>
                    </CompactSection>

                    {/* Metadata */}
                    {Object.keys(metadata).length > 0 && (
                        <>
                            <Separator className="my-5" />

                            <CompactSection
                                icon={<Info className="h-4 w-4" />}
                                title="Registration Information"
                            >
                                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                                    {Object.entries(metadata).map(
                                        ([key, value]) => (
                                            <MetadataItem
                                                key={key}
                                                label={formatKey(key)}
                                                value={value}
                                            />
                                        )
                                    )}
                                </div>
                            </CompactSection>
                        </>
                    )}

                    {mailLogs.length > 0 && (
                        <>
                            <Separator className="my-5" />

                            <CompactSection
                                icon={<Mail className="h-4 w-4" />}
                                title="Email Logs"
                            >
                                <div className="space-y-3">
                                    {mailLogs.map((log) => (
                                        <div
                                            key={log.id}
                                            className="rounded-xl border bg-muted/20 p-3 shadow-sm"
                                        >
                                            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                                <div className="font-medium text-foreground">
                                                    {formatText(log.email_type)}
                                                </div>

                                                <Badge
                                                    variant={
                                                        log.status === "sent"
                                                            ? "default"
                                                            : log.status === "failed"
                                                                ? "destructive"
                                                                : "secondary"
                                                    }
                                                    className="text-[10px]"
                                                >
                                                    {formatText(log.status)}
                                                </Badge>
                                            </div>

                                            <div className="space-y-1 text-sm text-muted-foreground">
                                                <div>
                                                    <span className="font-medium text-foreground">
                                                        To:
                                                    </span>{" "}
                                                    {log.recipient_email}
                                                </div>

                                                {/* {log.queued_at && (
                                                    <div>
                                                        <span className="font-medium text-foreground">
                                                            Queued:
                                                        </span>{" "}
                                                        {new Date(log.queued_at).toLocaleString()}
                                                    </div>
                                                )} */}

                                                {log.sent_at && (
                                                    <div>
                                                        <span className="font-medium text-foreground">
                                                            Sent:
                                                        </span>{" "}
                                                        {new Date(log.sent_at).toLocaleString()}
                                                    </div>
                                                )}

                                                {log.failed_at && (
                                                    <div>
                                                        <span className="font-medium text-foreground">
                                                            Failed:
                                                        </span>{" "}
                                                        {new Date(log.failed_at).toLocaleString()}
                                                    </div>
                                                )}

                                                {log.error_message && (
                                                    <div className="rounded-md border border-red-200 bg-red-50 p-2 text-red-700">
                                                        {log.error_message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CompactSection>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* -------------------------------------------------------------------------- */
/* Section */
/* -------------------------------------------------------------------------- */

function CompactSection({
    icon,
    title,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section>
            <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                    {icon}
                </div>

                <h3 className="text-sm font-semibold">
                    {title}
                </h3>
            </div>

            {children}
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/* Detail */
/* -------------------------------------------------------------------------- */

function DetailItem({
    icon,
    label,
    value,
}: {
    icon?: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="min-w-0">
            <div className="mb-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                {icon}
                {label}
            </div>

            <div className="wrap-break-word text-sm font-medium">
                {value ?? "-"}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Metadata */
/* -------------------------------------------------------------------------- */

function MetadataItem({
    label,
    value,
}: {
    label: string;
    value: unknown;
}) {
    return (
        <div className="rounded-md border px-3 py-2">
            <div className="mb-1 text-[11px] text-muted-foreground">
                {label}
            </div>

            <div className="wrap-break-word text-sm font-medium">
                {formatValue(value)}
            </div>
        </div>
    );
}

function formatValue(value: unknown): React.ReactNode {
    if (value === null || value === undefined) {
        return (
            <span className="text-muted-foreground">
                Not provided
            </span>
        );
    }

    if (typeof value === "boolean") {
        return (
            <Badge
                variant={value ? "default" : "secondary"}
                className="h-5 px-2 text-[10px]"
            >
                {value ? "Yes" : "No"}
            </Badge>
        );
    }

    if (Array.isArray(value)) {
        return value.join(", ");
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return formatText(String(value));
}

/* -------------------------------------------------------------------------- */
/* Status */
/* -------------------------------------------------------------------------- */

function StatusBadge({
    label,
    type,
}: {
    label: string | null | undefined;
    type: "registration" | "payment";
}) {
    let variant:
        | "default"
        | "secondary"
        | "destructive"
        | "outline" = "secondary";

    if (type === "registration") {
        if (label === "confirmed") {
            variant = "default";
        }

        if (label === "cancelled") {
            variant = "destructive";
        }
    }

    if (type === "payment") {
        if (label === "paid") {
            variant = "default";
        }

        if (label === "failed" || label === "refunded") {
            variant = "destructive";
        }

        if (label === "not_required") {
            variant = "outline";
        }
    }

    return (
        <Badge
            variant={variant}
            className="h-6 px-2 text-[11px]"
        >
            {formatText(label ?? "-")}
        </Badge>
    );
}

/* -------------------------------------------------------------------------- */
/* Formatters */
/* -------------------------------------------------------------------------- */

function formatKey(value: string) {
    return formatText(value);
}

function formatText(value: string) {
    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatTime(value: string | null | undefined) {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}