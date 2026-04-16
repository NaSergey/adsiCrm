"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { IconLang } from "@/shared/ui/icon";
import { setLocale } from "@/shared/lib/set-locale";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "uk", label: "Українська" },
];

export function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSelect = (code: string) => {
    startTransition(async () => {
      await setLocale(code);
      router.refresh();
    });
  };

  return (
    <div className="group relative">
      <button
        type="button"
        className="hidden p-1.5 lg:flex"
        aria-label="Change language"
        disabled={isPending}
      >
        <IconLang className="size-5 cursor-pointer text-gray-400 group-hover:text-gray-100 transition-colors" />
      </button>

      <div className="pointer-events-none absolute right-0 top-full z-50 min-w-[140px] rounded-md border border-gray-1000 bg-gray-1100 py-1 opacity-0 shadow-lg transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
        {LOCALES.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            onClick={() => handleSelect(code)}
            className={`flex w-full items-center cursor-pointer gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-gray-1000 ${
              locale === code ? "text-white" : "text-gray-400"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${locale === code ? "bg-green-1000" : "bg-transparent"}`} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
