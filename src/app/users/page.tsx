"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { UsersSection } from "./components/users-section";
import { SectionHeading } from "@/shared/ui/section-heading";
import { Button } from "@/shared/ui/button";
import { CreateUserModal } from "@/features/dialog/create/create-user-modal";

export default function UsersPage() {
  const t = useTranslations("users");
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="p-6 px-10 space-y-4">
      <div className="flex items-center justify-between">
        <SectionHeading title={t("title")} />
        <Button className="min-w-32" onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          {t("newUser")}
        </Button>
      </div>
      <UsersSection />
      <CreateUserModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
