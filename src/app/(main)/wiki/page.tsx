"use client";

import React, { useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/shared/ui/section-heading";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { getApiToken, getApiDomain, isJson } from "@/shared/api/utils";

const DOMAIN = getApiDomain();
const PARTNER_TOKEN = "YOUR_PARTNER_TOKEN";

const ADD_LEAD_CODE = `<?php
$headers = [
    'Content-Type: application/json',
    'Partner-Token: ${PARTNER_TOKEN}'
];

$j_data = array(
    'first_name'  => 'test_lead',
    'last_name'   => 'test_lead',
    'email'       => 'testlead@testlead.com',
    'phone'       => '+19185789789',
    'country'     => 'US',
    'lang'        => 'en',
    'user_ip'     => '111.111.111.111',
    'funnel'      => 'funnel',
    'utm_comment' => 'utm comment'
);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, '${DOMAIN}/leads/add_lead/');
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($j_data));
echo curl_exec($ch);`;

const GET_LEADS_CODE = `<?php
$leads = json_decode(
    file_get_contents('${DOMAIN}/leads/get_leads_partner/?partner_token=${PARTNER_TOKEN}&leads_per_page=100'),
    true
);
echo $leads;`;

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="w-full rounded-md bg-gray-1100 px-4 py-3 text-sm font-mono text-gray-900 dark:text-gray-300 overflow-auto whitespace-pre-wrap break-all">
      {children}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="w-full space-y-1.5">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      {children}
    </div>
  );
}

export default function WikiPage() {
  const t = useTranslations("wiki");
  const [view, setView] = useState<"docs" | "code">("docs");
  const [code, setCode] = useState(ADD_LEAD_CODE);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiDomain() + "/sendbox/send_code/", {
        method: "POST",
        headers: { "Auth-Token": getApiToken() },
        body: JSON.stringify({ code }),
      });
      let data = await res.text();
      if (isJson(data)) data = JSON.stringify(JSON.parse(data), null, 2);
      setAnswer(data);
    } catch {
      setAnswer(t("requestFailed"));
    } finally {
      setLoading(false);
    }
  };

  const showExample = (exampleCode: string) => {
    setCode(exampleCode);
    setView("code");
  };

  if (view === "code") {
    return (
      <div className="space-y-4 w-full">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="md" onClick={() => setView("docs")}>
            <ChevronLeft /> {t("back")}
          </Button>
          <h1 className="text-base font-semibold text-gray-900 dark:text-white">{t("phpExample")}</h1>
        </div>

        <Textarea
          className="font-mono text-sm min-h-[50vh]"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">{t("apiResponse")}</span>
            <Button variant="blue" size="md" onClick={runCode} disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              {t("run")}
            </Button>
          </div>
          <CodeBlock>{answer || t("responsePlaceholder")}</CodeBlock>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      <SectionHeading title={t("title")} />

      {/* Add a Lead */}
      <div className="space-y-4 w-full">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t("addLead")}</h2>
          <Button variant="secondary" size="sm" onClick={() => showExample(ADD_LEAD_CODE)}>
            {t("showPhpExample")}
          </Button>
        </div>

        <Section label="Request URL">
          <CodeBlock>{`POST ${DOMAIN}/leads/add_lead/`}</CodeBlock>
        </Section>

        <Section label="Request headers">
          <CodeBlock>{`{
  "Content-Type": "application/json",
  "Partner-Token": "${PARTNER_TOKEN}"
}`}</CodeBlock>
        </Section>

        <Section label="Request body">
          <CodeBlock>{`{
  "first_name":  "test",
  "last_name":   "test",
  "email":       "test@test.com",
  "phone":       "+123123123",
  "country":     "RU",
  "lang":        "ru",
  "campaign_id": 15,           // optional
  "password":    "123123",
  "user_ip":     "111.111.111.111",
  "funnel":      "test funnel",
  "utm_content": "content",    // optional
  "utm_comment": "comment"     // optional
}`}</CodeBlock>
        </Section>

        <Section label="Successful response">
          <CodeBlock>{`{
  "success":       true,
  "lead_id":       214,
  "status":        "New",
  "autologin_url": "https://autologin_url.com"
}`}</CodeBlock>
        </Section>

        <Section label="Error examples">
          <CodeBlock>{`{"success": false, "error": 4, "info": "Email format is invalid"}
{"success": false, "info": "Partner-Token is missing or incorrect"}
{"success": false, "error": 5, "info": "Unknown partner token"}
{"success": false, "error": 5, "info": "No matching campaign"}
{"success": false, "info": "Failed to send lead to broker"}`}</CodeBlock>
        </Section>
      </div>

      <hr className="border-gray-1000" />

      {/* Get Leads */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t("getLeads")}</h2>
          <Button variant="secondary" size="sm" onClick={() => showExample(GET_LEADS_CODE)}>
            {t("showPhpExample")}
          </Button>
        </div>

        <Section label="Request URL">
          <CodeBlock>{`GET ${DOMAIN}/leads/get_leads_partner/?partner_token=${PARTNER_TOKEN}`}</CodeBlock>
        </Section>

        <Section label="Request URL with filters">
          <CodeBlock>{`GET ${DOMAIN}/leads/get_leads_partner/?partner_token=${PARTNER_TOKEN}&from=2023-04-07&to=2023-04-20&leads_per_page=100&page=2`}</CodeBlock>
        </Section>

        <Section label="Successful response">
          <CodeBlock>{`{
  "success":      true,
  "total_leads":  "9",
  "pages":        1,
  "current_page": 1,
  "data": [
    { "id": "27", "status": "New", "ftd": false },
    { "id": "28", "status": "New", "ftd": false }
  ]
}`}</CodeBlock>
        </Section>

        <Section label="Error examples">
          <CodeBlock>{`{"success": false, "error": 5, "info": "Partner-Token undefined!"}
{
  "success":      true,
  "total_leads":  "9",
  "pages":        1,
  "current_page": 10,
  "error":        "Page is out of range, data array is empty",
  "data":         []
}`}</CodeBlock>
        </Section>
      </div>
    </div>
  );
}
