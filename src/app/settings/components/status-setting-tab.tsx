"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { TagsInput } from "react-tag-input-component";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { fetchClient } from "@/shared/api";

interface StatusItem {
  statusName: string;
  externalStatuses: string[];
}

export function StatusSettingTab() {
  const tSettings = useTranslations("settings");
  const tCommon = useTranslations("common");
  const [pendingChanges, setPendingChanges] = useState<Record<string, string[]>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["status-mappings"],
    queryFn: async () => {
      const { data, error } = await fetchClient.GET("/status-mappings");
      if (error) throw error;
      return data as StatusItem[];
    },
  });

  const displayData = data?.map((item) => ({
    ...item,
    externalStatuses: pendingChanges[item.statusName] ?? item.externalStatuses,
  })) ?? [];

  const { mutate: saveAll, isPending } = useMutation({
    mutationFn: async () => {
      await Promise.all(
        Object.entries(pendingChanges).map(([statusName, externalStatuses]) =>
          fetchClient.PATCH("/status-mappings/{statusName}", {
            params: { path: { statusName } },
            body: externalStatuses,
          })
        )
      );
      setPendingChanges({});
    },
  });

  const updateTags = (statusName: string, newTags: string[]) => {
    setPendingChanges((prev) => ({ ...prev, [statusName]: newTags }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayData.map((item) => (
        <div key={item.statusName} className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-gray-500">{item.statusName}</span>
          <div className="[&_.rti--container]:bg-gray-200! dark:[&_.rti--container]:bg-gray-1000! [&_.rti--container]:border-gray-200! dark:[&_.rti--container]:border-gray-1000! [&_.rti--container]:rounded-md [&_.rti--container]:shadow-none [&_.rti--container]:min-h-9 [&_.rti--container]:px-3 [&_.rti--container]:py-1.5 [&_.rti--container:focus-within]:ring-2 [&_.rti--container:focus-within]:ring-offset-2 [&_.rti--container:focus-within]:ring-transparent [&_.rti--container:focus-within]:ring-offset-blue-600">
            <TagsInput
              value={item.externalStatuses}
              onChange={(tags) => updateTags(item.statusName, tags)}
              name={item.statusName}
              placeHolder={tSettings("status.placeholder")}
              classNames={{
                input: "!bg-transparent !text-gray-900 dark:!text-white !caret-gray-900 dark:!caret-white !text-sm placeholder:!text-gray-500 !outline-none",
                tag: "!bg-gray-300 dark:!bg-gray-1100 !text-gray-900 dark:!text-white !text-xs !rounded !border-0",
              }}
            />
          </div>
        </div>
      ))}
      <Button
        className="w-full mt-2"
        disabled={isPending}
        onClick={() => saveAll()}
      >
        {isPending ? tCommon("saving") : tCommon("save")}
      </Button>
    </div>
  );
}
