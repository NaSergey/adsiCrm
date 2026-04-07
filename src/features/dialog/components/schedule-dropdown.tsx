"use client";

import { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";
import { Select, type SelectOption } from "@/shared/ui/select";
import { cn } from "@/shared/lib/css";

const TIME_OPTIONS: SelectOption[] = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, "0");
  const m = i % 2 === 0 ? "00" : "30";
  return { value: `${h}:${m}`, label: `${h}:${m}` };
});

const TIMEZONE_OPTIONS: SelectOption[] = [
  { value: "UTC",      label: "UTC" },
  { value: "UTC+1",    label: "UTC+1 (CET)" },
  { value: "UTC+2",    label: "UTC+2 (EET)" },
  { value: "UTC+3",    label: "UTC+3 (MSK)" },
  { value: "UTC+5:30", label: "UTC+5:30 (IST)" },
  { value: "UTC+8",    label: "UTC+8 (CST)" },
  { value: "UTC-5",    label: "UTC-5 (EST)" },
  { value: "UTC-6",    label: "UTC-6 (CST)" },
  { value: "UTC-8",    label: "UTC-8 (PST)" },
];

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;

export interface ScheduleData {
  activeDays: string[];
  timeFrom: string;
  timeTo: string;
  timezone: string;
}

interface ScheduleDropdownProps {
  onScheduleChange?: (data: ScheduleData) => void;
}

export function ScheduleDropdown({ onScheduleChange }: ScheduleDropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeDays, setActiveDays] = useState<string[]>([]);
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [timezone, setTimezone] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const notify = (patch: Partial<ScheduleData>) => {
    onScheduleChange?.({ activeDays, timeFrom, timeTo, timezone, ...patch });
  };

  const toggleDay = (day: string) => {
    const next = activeDays.includes(day)
      ? activeDays.filter((d) => d !== day)
      : [...activeDays, day];
    setActiveDays(next);
    notify({ activeDays: next });
  };

  const isActive = activeDays.length > 0;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center justify-center size-8 rounded-md transition-colors",
          open || isActive
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-1000 text-gray-500 hover:text-gray-900 dark:hover:text-white"
        )}
        aria-label="Schedule"
      >
        <Clock className="size-4" />
      </button>

      <div
        className={cn(
          "absolute right-0 top-full mt-1 z-50 w-68 rounded-md border border-gray-200 dark:border-gray-1000 bg-white dark:bg-gray-1100 shadow-lg p-3 space-y-3",
          "transition-all duration-200 origin-top-right",
          open ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
        )}
      >
        <div>
          <span className="text-xs font-medium text-gray-500 mb-1.5 block">Days of the week</span>
          <div className="flex gap-1">
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={cn(
                  "flex-1 h-7 text-xs font-medium rounded transition-colors",
                  activeDays.includes(day)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-1000 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <Select
          label="Time from"
          options={TIME_OPTIONS}
          placeholder="00:00"
          value={timeFrom}
          onChange={(v) => { setTimeFrom(v); notify({ timeFrom: v }); }}
        />
        <Select
          label="Time to"
          options={TIME_OPTIONS}
          placeholder="23:30"
          value={timeTo}
          onChange={(v) => { setTimeTo(v); notify({ timeTo: v }); }}
        />
        <Select
          label="Time zone"
          options={TIMEZONE_OPTIONS}
          placeholder="UTC"
          value={timezone}
          onChange={(v) => { setTimezone(v); notify({ timezone: v }); }}
        />
      </div>
    </div>
  );
}
