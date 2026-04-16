"use client";

import { ServiceSection } from "./components/service-section";
import type { ServiceItem } from "./components/service-table";
import { SectionHeading } from "@/shared/ui/section-heading";

const MOCK: ServiceItem[] = [
  {
    id: 1,
    login_email: "admin@example.com",
    ip: "192.168.1.1",
    auth_time: "2024-01-15 10:30:00",
    last_connect_time: "2024-01-15 12:45:00",
  },
  {
    id: 2,
    login_email: "manager@example.com",
    ip: "10.0.0.5",
    auth_time: "2024-01-15 09:00:00",
    last_connect_time: "2024-01-15 11:20:00",
  },
  {
    id: 3,
    login_email: "user@domain.com",
    ip: "78.40.12.99",
    auth_time: "2024-01-14 18:15:00",
    last_connect_time: "2024-01-15 08:00:00",
  },
];

export default function ServicePage() {
  return (
    <div className="space-y-4">
      <SectionHeading title="Service" />
      <ServiceSection data={MOCK} />
    </div>
  );
}
