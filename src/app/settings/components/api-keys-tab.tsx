"use client";

import { useState } from "react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

const MOCK_API_KEYS = [
  { id: 1, name: "IP Quality Score", service_url: "https://ipqualityscore.com/api", data: "", about: "Fraud IP check" },
  { id: 2, name: "MaxMind GeoIP", service_url: "https://geoip.maxmind.com/geoip/v2.1", data: "", about: "Geo location" },
  { id: 3, name: "SendGrid", service_url: "https://api.sendgrid.com/v3", data: "", about: "Email service" },
];

interface ApiKeyItem {
  id: number;
  name: string;
  service_url: string;
  data: string;
  about: string;
}

export function ApiKeysTab() {
  const [apiKeysList, setApiKeysList] = useState<ApiKeyItem[]>(MOCK_API_KEYS);

  const handleChange = (index: number, field: keyof ApiKeyItem, value: string) => {
    const updated = [...apiKeysList];
    updated[index] = { ...updated[index], [field]: value };
    setApiKeysList(updated);
  };

  return (
    <div className="space-y-3">
      {apiKeysList.map((item, idx) => (
        <div key={item.id} className="flex items-end gap-3">
          <Input label="Service name" value={item.name} readOnly className="w-40 shrink-0" />
          <Input label="Service URL" value={item.service_url} readOnly className="flex-1" />
          <Input
            label="Service data (key)"
            placeholder="Enter API key..."
            value={item.data}
            onChange={(e) => handleChange(idx, "data", e.target.value)}
            className="flex-1"
          />
          <Input
            label="About"
            placeholder="Description"
            value={item.about}
            onChange={(e) => handleChange(idx, "about", e.target.value)}
            className="w-40 shrink-0"
          />
          <Button className="shrink-0 h-9">Save</Button>
        </div>
      ))}
    </div>
  );
}
