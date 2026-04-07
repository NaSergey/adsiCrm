"use client";

import { useEffect, useState } from "react";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Button } from "@/shared/ui/button";
import { fetchClient } from "@/shared/api";

const onetimeOptions = [
  { value: "true", label: "true — single use" },
  { value: "false", label: "false — reusable" },
];

export function AutologinTab() {
  const [lifetime, setLifetime] = useState("");
  const [onetimeUrl, setOnetimeUrl] = useState("false");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [durationRes, onetimeRes] = await Promise.all([
        fetchClient.GET("/autologin/duration-sec"),
        fetchClient.GET("/autologin/is-one-time"),
      ]);
      if (durationRes.data) setLifetime(String(durationRes.data.autologin_duration_sec));
      if (onetimeRes.data) setOnetimeUrl(String(onetimeRes.data.autologin_is_one_time));
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await Promise.all([
      fetchClient.PATCH("/autologin/duration-sec", {
        body: { durationSec: Number(lifetime) },
      }),
      fetchClient.PATCH("/autologin/is-one-time", {
        body: { isOneTime: onetimeUrl === "true" },
      }),
    ]);
    setSaving(false);
  };

  if (loading) return <div className="text-sm text-gray-500">Loading...</div>;

  return (
    <div className="space-y-4">
      <Input
        label="Lifetime (in sec.)"
        type="number"
        placeholder="120"
        value={lifetime}
        onChange={(e) => setLifetime(e.target.value)}
      />
      <Select
        label="One-time URL"
        options={onetimeOptions}
        value={onetimeUrl}
        onChange={setOnetimeUrl}
        className="w-full"
      />
      <Button className="w-full" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
