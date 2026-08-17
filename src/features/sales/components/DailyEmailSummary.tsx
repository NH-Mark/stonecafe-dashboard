"use client"

import { useEffect, useState } from "react"
import { Mail, Save, Send, Clock } from "lucide-react"
import { toast } from "sonner"

import {
    getDailySalesEmailSettings,
    sendDailySalesEmailNow,
    updateDailySalesEmailSettings,
} from "../sales.service"

export default function SalesEmailSettings() {

    const [enabled, setEnabled] = useState(false)
    const [emails, setEmails] = useState("")
    const [sendTime, setSendTime] = useState("18:00")

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [sending, setSending] = useState(false)

    useEffect(() => {

        async function load() {

            try {

                const settings =
                    await getDailySalesEmailSettings()

                setEnabled(settings.enabled)

                setEmails(
                    settings.recipients.join(", ")
                )

                setSendTime(settings.send_time)

            } catch (error) {

                toast.error(
                    "Failed to load email settings"
                )

            } finally {

                setLoading(false)

            }
        }

        load()

    }, [])

    async function handleSave() {

        const recipients = emails
            .split(",")
            .map(email => email.trim())
            .filter(Boolean)

        if (enabled && recipients.length === 0) {

            toast.error(
                "Please enter at least one recipient email."
            )

            return
        }

        setSaving(true)

        try {

            await updateDailySalesEmailSettings({
                enabled,
                recipients,
                send_time: sendTime,
            })

            toast.success(
                "Daily email settings saved."
            )

        } catch (error) {

            toast.error(
                "Failed to save email settings."
            )

        } finally {

            setSaving(false)

        }
    }

    async function handleSendNow() {

        setSending(true)

        try {

            await sendDailySalesEmailNow()

            toast.success(
                "Daily sales summary sent."
            )

        } catch (error) {

            toast.error(
                "Failed to send email."
            )

        } finally {

            setSending(false)

        }
    }

    if (loading) {
        return null
    }

    return (
        <div
            className="
                rounded-xl
                border
                bg-white
                p-5
            "
            style={{
                borderColor: "#e1ddd8",
            }}
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-4
                "
            >

                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#f5f1ed]
                            text-[#6b5849]
                        "
                    >
                        <Mail className="h-4 w-4" />
                    </div>

                    <div>

                        <h3
                            className="
                                text-sm
                                font-semibold
                                text-[#40332a]
                            "
                        >
                            Daily Sales Email
                        </h3>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                text-muted-foreground
                            "
                        >
                            Automatically send yesterday's
                            sales summary every day.
                        </p>

                    </div>

                </div>

                {/* STATUS */}

                <div className="flex items-center gap-2">

                    <span
                        className="
                            text-xs
                            font-medium
                            text-muted-foreground
                        "
                    >
                        {enabled
                            ? "Enabled"
                            : "Disabled"}
                    </span>

                    <button
                        type="button"
                        aria-label={
                            enabled
                                ? "Disable daily sales email"
                                : "Enable daily sales email"
                        }
                        onClick={() =>
                            setEnabled(value => !value)
                        }
                        className={`
                            relative
                            h-6
                            w-11
                            shrink-0
                            rounded-full
                            transition-colors
                            ${
                                enabled
                                    ? "bg-[#6b5849]"
                                    : "bg-gray-300"
                            }
                        `}
                    >

                        <span
                            className={`
                                absolute
                                top-0.5
                                h-5
                                w-5
                                rounded-full
                                bg-white
                                shadow
                                transition-transform
                                ${
                                    enabled
                                        ? "translate-x-5"
                                        : "translate-x-0.5"
                                }
                            `}
                        />

                    </button>

                </div>

            </div>


            {/* ================================================= */}
            {/* SETTINGS */}
            {/* ================================================= */}

            {enabled && (

                <div
                    className="
                        mt-5
                        border-t
                        pt-5
                    "
                    style={{
                        borderColor: "#eeeae6",
                    }}
                >

                    <div
                        className="
                            grid
                            gap-4
                            lg:grid-cols-[1fr_180px_auto]
                            lg:items-end
                        "
                    >

                        {/* ================================================= */}
                        {/* RECIPIENT EMAILS */}
                        {/* ================================================= */}

                        <div>

                            <label
                                className="
                                    mb-1.5
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    font-medium
                                    text-[#40332a]
                                "
                            >

                                <span>
                                    Recipient emails
                                </span>

                                <span
                                    className="
                                        font-normal
                                        text-muted-foreground
                                    "
                                >
                                    Separate multiple emails
                                    with commas.
                                </span>

                            </label>

                            <input
                                type="text"
                                value={emails}
                                onChange={event =>
                                    setEmails(
                                        event.target.value
                                    )
                                }
                                placeholder="manager@example.com, owner@example.com"
                                className="
                                    h-9
                                    w-full
                                    rounded-lg
                                    border
                                    bg-white
                                    px-3
                                    text-sm
                                    text-[#40332a]
                                    outline-none
                                    transition
                                    placeholder:text-muted-foreground
                                    focus:border-[#6b5849]
                                    focus:ring-2
                                    focus:ring-[#6b5849]/10
                                "
                            />

                        </div>


                        {/* ================================================= */}
                        {/* SEND TIME */}
                        {/* ================================================= */}

                        <div>

                            <label
                                className="
                                    mb-1.5
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    font-medium
                                    text-[#40332a]
                                "
                            >

                                <Clock
                                    className="
                                        h-3.5
                                        w-3.5
                                        text-[#6b5849]
                                    "
                                />

                                Send time

                            </label>

                            <input
                                type="time"
                                value={sendTime}
                                onChange={event =>
                                    setSendTime(
                                        event.target.value
                                    )
                                }
                                className="
                                    h-9
                                    w-full
                                    rounded-lg
                                    border
                                    bg-white
                                    px-3
                                    text-sm
                                    text-[#40332a]
                                    outline-none
                                    focus:border-[#6b5849]
                                    focus:ring-2
                                    focus:ring-[#6b5849]/10
                                "
                            />

                        </div>


                        {/* ================================================= */}
                        {/* ACTIONS */}
                        {/* ================================================= */}

                        <div
                            className="
                                flex
                                items-center
                                justify-end
                                gap-2
                            "
                        >

                           


                            <button
                                type="button"
                                disabled={saving}
                                onClick={handleSave}
                                className="
                                    inline-flex
                                    h-9
                                    items-center
                                    gap-2
                                    rounded-lg
                                    bg-[#40332a]
                                    px-3
                                    text-xs
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-[#514238]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                <Save className="h-3.5 w-3.5" />

                                {saving
                                    ? "Saving..."
                                    : "Save"}

                            </button>
                             <button
                                type="button"
                                disabled={sending}
                                onClick={handleSendNow}
                                className="
                                    inline-flex
                                    h-9
                                    items-center
                                    gap-2
                                    rounded-lg
                                    border
                                    px-3
                                    text-xs
                                    font-medium
                                    text-[#40332a]
                                    transition
                                    hover:bg-[#faf9f7]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                                style={{
                                    borderColor: "#e1ddd8",
                                }}
                            >

                                <Send className="h-3.5 w-3.5" />

                                {sending
                                    ? "Sending..."
                                    : "Send Test"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    )
}