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

    type DateRangeType =
        | "today"
        | "yesterday"
        | "this_week"
        | "this_month"
        | "last_month"
        | "custom"

    const [dateRange, setDateRange] =
        useState<DateRangeType>("yesterday")

    const [customFrom, setCustomFrom] = useState("")
    const [customTo, setCustomTo] = useState("")

    const detectDateRange = (
        fromDate: string,
        toDate: string
    ): {
        range: DateRangeType
        customFrom: string
        customTo: string
    } => {
        const now = new Date()

        const formatDate = (date: Date) =>
            date.toISOString().split("T")[0]

        const today = formatDate(now)

        const yesterdayDate = new Date(now)
        yesterdayDate.setDate(now.getDate() - 1)

        const yesterday = formatDate(yesterdayDate)

        // Today
        if (
            fromDate === today &&
            toDate === today
        ) {
            return {
                range: "today",
                customFrom: "",
                customTo: "",
            }
        }

        // Yesterday
        if (
            fromDate === yesterday &&
            toDate === yesterday
        ) {
            return {
                range: "yesterday",
                customFrom: "",
                customTo: "",
            }
        }

        // This week
        const weekStart = new Date(now)
        const day = weekStart.getDay()
        const diff = day === 0 ? 6 : day - 1

        weekStart.setDate(
            weekStart.getDate() - diff
        )

        if (
            fromDate === formatDate(weekStart) &&
            toDate === today
        ) {
            return {
                range: "this_week",
                customFrom: "",
                customTo: "",
            }
        }

        // This month
        const monthStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        )

        if (
            fromDate === formatDate(monthStart) &&
            toDate === today
        ) {
            return {
                range: "this_month",
                customFrom: "",
                customTo: "",
            }
        }

        // Last month
        const lastMonthStart = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
        )

        const lastMonthEnd = new Date(
            now.getFullYear(),
            now.getMonth(),
            0
        )

        if (
            fromDate === formatDate(lastMonthStart) &&
            toDate === formatDate(lastMonthEnd)
        ) {
            return {
                range: "last_month",
                customFrom: "",
                customTo: "",
            }
        }

        // Custom range
        return {
            range: "custom",
            customFrom: fromDate,
            customTo: toDate,
        }
    }
    const getDateRange = () => {
        const now = new Date()

        const formatDate = (date: Date) =>
            date.toISOString().split("T")[0]

        if (dateRange === "today") {
            const today = formatDate(now)

            return {
                from_date: today,
                to_date: today,
            }
        }

        if (dateRange === "yesterday") {
            const yesterday = new Date(now)
            yesterday.setDate(now.getDate() - 1)

            const date = formatDate(yesterday)

            return {
                from_date: date,
                to_date: date,
            }
        }

        if (dateRange === "this_week") {
            const start = new Date(now)
            const day = start.getDay()

            const diff = day === 0 ? 6 : day - 1

            start.setDate(start.getDate() - diff)

            return {
                from_date: formatDate(start),
                to_date: formatDate(now),
            }
        }

        if (dateRange === "this_month") {
            const start = new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            )

            return {
                from_date: formatDate(start),
                to_date: formatDate(now),
            }
        }

        if (dateRange === "last_month") {
            const start = new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                1
            )

            const end = new Date(
                now.getFullYear(),
                now.getMonth(),
                0
            )

            return {
                from_date: formatDate(start),
                to_date: formatDate(end),
            }
        }

        return {
            from_date: customFrom,
            to_date: customTo,
        }
    }

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

            const detected = detectDateRange(
                settings.from_date,
                settings.to_date
            )

            setDateRange(detected.range)
            setCustomFrom(detected.customFrom)
            setCustomTo(detected.customTo)

        } catch (error) {
            console.error(error)

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
        const range = getDateRange()

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
                date_range:dateRange,
                from_date: range.from_date,
                to_date: range.to_date,
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

    async function handleToggle() {
        const range = getDateRange()
        const newEnabled = !enabled

        setSaving(true)

        try {
            const recipients = emails
                .split(",")
                .map(email => email.trim())
                .filter(Boolean)

            await updateDailySalesEmailSettings({
                enabled: newEnabled,
                recipients,
                send_time: sendTime,
                date_range:dateRange,
                from_date: range.from_date,
                to_date: range.to_date,
            })

            setEnabled(newEnabled)

            toast.success(
                newEnabled
                    ? "Daily sales email enabled."
                    : "Daily sales email disabled."
            )

        } catch (error) {
            console.error(error)

            toast.error(
                "Failed to update email setting."
            )
        } finally {
            setSaving(false)
        }
    }

    async function handleSendNow() {
        if (dateRange === "custom") {
            if (!customFrom || !customTo) {
                toast.error(
                    "Please select both start and end dates."
                )
                return
            }

            if (customFrom > customTo) {
                toast.error(
                    "Start date cannot be after end date."
                )
                return
            }
        }

        setSending(true)

        try {
            const range = getDateRange()

            await sendDailySalesEmailNow({
                date_range:dateRange,
                from_date: range.from_date,
                to_date: range.to_date,
            })

            toast.success(
                "Sales summary sent."
            )
        } catch (error) {
            console.error(error)

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
                            Automatically send
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
                        onClick={handleToggle}
                        disabled={saving}
                        className={`
        relative
        h-6
        w-11
        shrink-0
        rounded-full
        transition-colors
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${enabled
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
            ${enabled
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
                            lg:grid-cols-[minmax(0,1fr)_180px_180px_180px]
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
                        <div className="lg:col-span-1">
                            <label
                                className="
            mb-1.5
            block
            text-xs
            font-medium
            text-[#40332a]
        "
                            >
                                Sales date range
                            </label>

                            <select
                                value={dateRange}
                                onChange={event =>
                                    setDateRange(
                                        event.target.value as DateRangeType
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
                            >
                                <option value="today">Today</option>
                                <option value="yesterday">Yesterday</option>
                                <option value="this_week">This week</option>
                                <option value="this_month">This month</option>
                                <option value="last_month">Last month</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>

                        {dateRange === "custom" && (
                            <>
                                <div>
                                    <label
                                        className="
                    mb-1.5
                    block
                    text-xs
                    font-medium
                    text-[#40332a]
                "
                                    >
                                        From
                                    </label>

                                    <input
                                        type="date"
                                        value={customFrom}
                                        onChange={event =>
                                            setCustomFrom(event.target.value)
                                        }
                                        className="
                    h-9
                    w-full
                    min-w-0
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

                                <div>
                                    <label
                                        className="
                    mb-1.5
                    block
                    text-xs
                    font-medium
                    text-[#40332a]
                "
                                    >
                                        To
                                    </label>

                                    <input
                                        type="date"
                                        min={customFrom || undefined}
                                        value={customTo}
                                        onChange={event =>
                                            setCustomTo(event.target.value)
                                        }
                                        className="
                    h-9
                    w-full
                    min-w-0
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
                            </>
                        )}





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
        whitespace-nowrap
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
                                <Send className="h-3.5 w-3.5 shrink-0" />

                                {sending ? "Sending..." : "Send Test"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    )
}