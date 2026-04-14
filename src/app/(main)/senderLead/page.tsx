"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, X, Play, Code, List } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Select, type SelectOption } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { cn } from "@/shared/lib/css";
import { getApiDomain, generateToken, isJson } from "@/shared/api/utils";
import {Input } from "@/shared/ui/input";
const METHOD_OPTIONS: SelectOption[] = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "PATCH", label: "PATCH" },
  { value: "DELETE", label: "DELETE" },
];

const inputCls = "flex-1 min-w-0 rounded-md bg-gray-200 dark:bg-gray-1000 border border-gray-1000 px-3 h-9 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 outline-none transition-colors focus:ring-2 focus:ring-transparent focus:ring-offset-2 focus:ring-offset-blue-600";

interface Header { id: number; name: string; value: string }

export default function SenderLeadPage() {
  const t = useTranslations("senderLead");
  const [method, setMethod]   = useState("POST");
  const [url, setUrl]         = useState(getApiDomain() + "/api/leads");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer]   = useState("");
  const [bodyType, setBodyType] = useState<"list" | "code">("list");

  const [headers, setHeaders] = useState<Header[]>([
    { id: 0, name: "Content-type", value: "application/json" },
    { id: 1, name: "partner-token", value: "" },
    { id: 2, name: "user-agent", value: "" },
  ]);

  const [body, setBody] = useState<Record<string, string>>({
    email:      generateToken(10) + "@gmail.com",
    firstName:  generateToken(5),
    lastName:   generateToken(5),
    country:    "US",
    language:   "en",
    ip:         "209.142.68.29",
    phone:      "+14845219623",
    funnel:     "funnel",
    password:   generateToken(5),
    utmComment: "",
    utmContent: "",
  });

  const [bodyCode, setBodyCode] = useState(() => JSON.stringify(body, null, 2));

  // --- headers ---
  const addHeader = () =>
    setHeaders((h) => [...h, { id: Date.now(), name: "", value: "" }]);

  const removeHeader = (id: number) =>
    setHeaders((h) => h.filter((x) => x.id !== id));

  const updateHeader = (id: number, field: "name" | "value", val: string) =>
    setHeaders((h) => h.map((x) => (x.id === id ? { ...x, [field]: val } : x)));

  // --- body ---
  const addBodyParam = () =>
    setBody((b) => {
      const key = "param" + Object.keys(b).length;
      return { ...b, [key]: "" };
    });

  const removeBodyParam = (key: string) =>
    setBody((b) => { const c = { ...b }; delete c[key]; return c; });

  const updateBodyKey = (oldKey: string, newKey: string) =>
    setBody((b) => {
      const entries = Object.entries(b);
      const idx = entries.findIndex(([k]) => k === oldKey);
      if (idx === -1) return b;
      entries[idx][0] = newKey;
      return Object.fromEntries(entries);
    });

  const updateBodyValue = (key: string, value: string) =>
    setBody((b) => ({ ...b, [key]: value })); 

  // --- send ---
  const sendQuery = async () => {
    if (!method || !url) return;
    setLoading(true);

    const hdrs: Record<string, string> = {};
    headers.forEach((h) => { if (h.name) hdrs[h.name.toLowerCase()] = h.value; });
    if (!hdrs["content-type"]) hdrs["content-type"] = "application/json";

    const payload = bodyType === "code"
      ? isJson(bodyCode) ? JSON.parse(bodyCode) : body
      : body;

    const hasBody = ["POST", "PUT", "PATCH"].includes(method);

    try {
      const res = await fetch(url, {
        method,
        headers: hdrs,
        ...(hasBody ? { body: JSON.stringify(payload) } : {}),
      });
      const text = await res.text();
      setAnswer(isJson(text) ? JSON.stringify(JSON.parse(text), null, 2) : text);
    } catch (e) {
      setAnswer(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 px-10">
      <div className="space-y-4">

        {/* Top: left col (Method+URL, Headers, Run) + right col (Body) */}
        <div className="grid grid-cols-2 gap-4 items-start">

          {/* Left column */}
          <div className="space-y-4">

            {/* Method + URL */}
            <div className="rounded-lg border border-gray-1000">
              <div className="flex gap-3 p-4">
                <Select
                  options={METHOD_OPTIONS}
                  value={method}
                  onChange={setMethod}
                  className="w-30 shrink-0"
                />
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className={cn(inputCls, "flex-1")}
                  placeholder="URL"
                  noIcon
                />
              </div>
            </div>

            {/* Headers */}
            <div className="rounded-lg border border-gray-1000">
              <div className="flex items-center justify-between border-b border-gray-1000 px-4 py-3">
                <span className="text-sm font-medium text-gray-500">{t("headers")}</span>
                <Button variant="ghost" size="sm" onClick={addHeader}>
                  <Plus /> {t("add")}
                </Button>
              </div>
              <div className="space-y-2 p-4">
                {headers.map((h) => (
                  <div key={h.id} className="flex items-center gap-2">
                    <Input
                      value={h.name}
                      onChange={(e) => updateHeader(h.id, "name", e.target.value)}
                      placeholder={t("name")}
                      className={inputCls}
                      noIcon
                    />
                    <Input
                      value={h.value}
                      onChange={(e) => updateHeader(h.id, "value", e.target.value)}
                      placeholder={t("value")}
                      className={inputCls}
                      noIcon
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeHeader(h.id)}>
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Response */}
            <div className="rounded-lg border border-gray-1000">
              <div className="border-b border-gray-1000 px-4 py-3">
                <span className="text-sm font-medium text-gray-500">{t("response")}</span>
              </div>
              <div className="p-4">
                <Textarea
                  value={answer}
                  readOnly
                  rows={12}
                  placeholder={t("responsePlaceholder")}
                  className="font-mono text-xs"
                />
              </div>
            </div>

          </div>

          {/* Right column — Body + Run */}
          <div className="space-y-4">
          <div className="rounded-lg border border-gray-1000">
            <div className="flex items-center justify-between border-b border-gray-1000 px-4 py-3">
              <span className="text-sm font-medium text-gray-500">{t("body")}</span>
              <div className="flex items-center gap-2">
                {bodyType === "list" && (
                  <Button variant="ghost" size="sm" onClick={addBodyParam}>
                    <Plus /> {t("add")}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (bodyType === "list") {
                      setBodyCode(JSON.stringify(body, null, 2));
                      setBodyType("code");
                    } else {
                      if (isJson(bodyCode)) setBody(JSON.parse(bodyCode));
                      setBodyType("list");
                    }
                  }}
                >
                  {bodyType === "list" ? <><Code /> {t("code")}</> : <><List /> {t("list")}</>}
                </Button>
              </div>
            </div>
            <div className="p-4">
              {bodyType === "list" ? (
                <div className="space-y-2">
                  {Object.entries(body).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Input
                        defaultValue={key}
                        onBlur={(e) => updateBodyKey(key, e.target.value)}
                        placeholder={t("key")}
                        className={inputCls}
                        noIcon
                      />
                      <Input
                        value={val}
                        onChange={(e) => updateBodyValue(key, e.target.value)}
                        placeholder={t("value")}
                        className={inputCls}
                        noIcon
                      />
                      <Button variant="ghost" size="sm" onClick={() => removeBodyParam(key)}>
                        <X />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <Textarea
                  value={bodyCode}
                  onChange={(e) => setBodyCode(e.target.value)}
                  rows={14}
                  className="font-mono text-xs"
                />
              )}
            </div>
          </div>

            {/* Run */}
            <Button
              variant="blue"
              size="lg"
              className="w-full"
              onClick={sendQuery}
              disabled={loading}
            >
              <Play />
              {loading ? t("sending") : t("run")}
            </Button>

          </div>

        </div>

      </div>
    </div>
  );
}
