"use client";

import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/shared/ui/section-heading";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { PUBLIC_API_URL } from "@/shared/api/config";

const PARTNER_TOKEN = "YOUR_PARTNER_TOKEN";

const addLeadCode = (domain: string) => `<?php
$headers = [
    'Content-Type: application/json',
    'Partner-Token: ${PARTNER_TOKEN}',
    'User-Agent: Mozilla/5.0'
];

$j_data = array(
    'firstName'  => 'test_lead',
    'lastName'   => 'test_lead',
    'email'      => 'testlead@testlead.com',
    'phone'      => '+19185789789',
    'country'    => 'US',
    'language'   => 'en',
    'ip'         => '111.111.111.111',
    'funnel'     => 'funnel',
    'utmComment' => 'utm comment'
);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, '${domain}/leads');
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($j_data));
echo curl_exec($ch);`;

const getLeadsCode = (domain: string) => `<?php
$leads = json_decode(
    file_get_contents('${domain}/leads?partner-token=${PARTNER_TOKEN}&page=1'),
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

  // Direct backend address (NEXT_PUBLIC_API_URL), shown in the partner examples.
  const domain = PUBLIC_API_URL.replace(/\/+$/, "");

  const [view, setView] = useState<"docs" | "code">("docs");
  const [example, setExample] = useState<"add" | "get">("add");
  const showExample = (ex: "add" | "get") => {
    setExample(ex);
    setView("code");
  };
  const code = example === "get" ? getLeadsCode(domain) : addLeadCode(domain);

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
          readOnly
          spellCheck={false}
        />

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
          <Button variant="secondary" size="sm" onClick={() => showExample("add")}>
            {t("showPhpExample")}
          </Button>
        </div>

        <Section label="Request URL">
          <CodeBlock>{`POST ${domain}/leads`}</CodeBlock>
        </Section>

        <Section label="Request headers">
          <CodeBlock>{`{
  "Content-Type": "application/json",
  "Partner-Token": "${PARTNER_TOKEN}",
  "User-Agent": "<client user agent>"
}`}</CodeBlock>
        </Section>

        <Section label="Request body">
          <CodeBlock>{`{
  "firstName":  "test",
  "lastName":   "test",
  "email":      "test@test.com",
  "phone":      "+123123123",
  "country":    "RU",
  "language":   "ru",
  "password":   "123123",      // optional
  "ip":         "111.111.111.111",
  "funnel":     "test funnel", // optional
  "utmContent": "content",     // optional
  "utmComment": "comment"      // optional
}`}</CodeBlock>
        </Section>

        <Section label="Successful response">
          <CodeBlock>{`{
  "id":           214,
  "status":       "New",
  "autoLoginUrl": "https://autologin_url.com",
  "ftd":          false
}`}</CodeBlock>
        </Section>

        <Section label="Error examples">
          <CodeBlock>{`{"statusCode": 400, "message": "Validation failed", "errors": [...]}
{"statusCode": 400, "message": "Partner token not found", "error": "Bad Request"}
{"statusCode": 404, "message": "Partner not found", "error": "Not Found"}`}</CodeBlock>
        </Section>
      </div>

      <hr className="border-gray-1000" />

      {/* Get Leads */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t("getLeads")}</h2>
          <Button variant="secondary" size="sm" onClick={() => showExample("get")}>
            {t("showPhpExample")}
          </Button>
        </div>

        <Section label="Request URL">
          <CodeBlock>{`GET ${domain}/leads?partner-token=${PARTNER_TOKEN}`}</CodeBlock>
        </Section>

        <Section label="Request URL with filters">
          <CodeBlock>{`GET ${domain}/leads?partner-token=${PARTNER_TOKEN}&from=2023-04-07&to=2023-04-20&page=2`}</CodeBlock>
        </Section>

        <Section label="Successful response">
          <CodeBlock>{`{
  "items": [
    { "id": 27, "status": "New", "ftd": false },
    { "id": 28, "status": "New", "ftd": false }
  ],
  "meta": {
    "totalItems":   9,
    "itemCount":    9,
    "itemsPerPage": 10,
    "totalPages":   1,
    "currentPage":  1
  }
}`}</CodeBlock>
        </Section>

        <Section label="Error examples">
          <CodeBlock>{`{"statusCode": 400, "message": "Partner token not found", "error": "Bad Request"}
{"statusCode": 404, "message": "Partner not found", "error": "Not Found"}`}</CodeBlock>
        </Section>
      </div>
    </div>
  );
}
