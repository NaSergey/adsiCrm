"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import {
  useBrokerFile,
  useUpdateBrokerFile,
  useUpdateAndRunBrokerFile,
} from "@/entities/api/use-broker-file";

const CodeEditor = dynamic(
  () => import("./code-editor").then((m) => m.CodeEditor),
  { ssr: false }
);

const ADD_LEAD_EXAMPLE = `<?php
// Example code (add lead to broker)

// Get lead data from the system
$input = file_get_contents("php://stdin");
$payload = ($input === false || trim($input) === '') ? [] : json_decode($input, true);

$headers = [
    'Content-Type: application/json',
];

$data = array(
    'first_name' => $payload['first_name'],
    'last_name' => $payload['last_name'],
    'email' => $payload['email'],
    'phone' => $payload['phone'],
    'country' => strtolower($payload['country']),
    'language' => strtolower($payload['lang']),
    'ip' => $payload['ip'],
    'funnel' => $payload['funnel'],
    'password' => $payload['password'],
);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.broker.com/add_lead/');
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
$result = json_decode(curl_exec($ch), true);

// To correctly pass the response data back to the system,
// you must return a JSON with the parameters:
// lead_id (the lead ID on the broker side) and broker_response (full broker response).
// Also return autologin_url if it is present.

if (isset($result['id'])) {
    echo json_encode([
        'lead_id' => $result['id'],
        'broker_response' => $result,
        'autologin_url' => $result['autologin_url']
    ]);
} else {
    // It is required to return a response even in case of failure
    // in order to save it to the log
    echo json_encode([
        'broker_response' => $result
    ]);
}`;

const UPDATE_LEAD_EXAMPLE = `<?php
// Example code for update leads

// To successfully update leads, you need to return an array of leads with the parameters lead_id (lead ID from the broker), status (lead status), ftd (ftd flag)
// [
//     {
//         lead_id:22,
//         status:'deposit',
//         ftd:true,
//     },
//     {
//         lead_id:23,
//         status:'new',
//         ftd:false,
//     },
//     {
//         lead_id:24,
//         status:'rejected',
//         ftd:false,
//     },
// ]
function get_leads($page){
    $headers = [
        'Content-Type: application/json',
    ];

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => 'https://api.broker.com/get_leads?page='.$page,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTPHEADER => $headers,
    ]);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        curl_close($ch);
        return [];
    }

    curl_close($ch);

    $res = json_decode($response, true);
    return $res['data'] ?? [];
}

$page = 1;
$response = [];

while (true) {
    $leads = get_leads($page);

    if (empty($leads)) {
        break;
    }

    foreach ($leads as $lead) {
        $response[] = [
            'lead_id' => $lead['id'] ?? null,
            'status'  => $lead['status'] ?? null,
            'ftd'     => $lead['ftd'] ?? false,
        ];
    }

    $page++;
}

echo json_encode($response);`;

interface EditIntegCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brokerId: string;
  brokerName: string;
  type: "add" | "update";
}

export function EditIntegCodeModal({
  open,
  onOpenChange,
  brokerId,
  brokerName,
  type,
}: EditIntegCodeModalProps) {
  const t = useTranslations("editModals");
  const [code, setCode] = useState("");
  const [answer, setAnswer] = useState("");
  const [editorReady, setEditorReady] = useState(false);

  useEffect(() => {
    import("./code-editor").then(() => setEditorReady(true));
  }, []);

  const brokerIdNum = Number(brokerId);

  const { data: fileData } = useBrokerFile(brokerIdNum, type, open);

  useEffect(() => {
    if (!open) return;
    setAnswer("");
    const example = type === "add" ? ADD_LEAD_EXAMPLE : UPDATE_LEAD_EXAMPLE;
    setCode(fileData?.phpCode || example);
  }, [open, type, fileData]);

  const { mutate: save, isPending: isSaving } = useUpdateBrokerFile();
  const { mutate: saveAndRun, isPending: isRunning } = useUpdateAndRunBrokerFile();

  const loading = isSaving || isRunning;

  const handleSave = () => {
    save({ brokerId: brokerIdNum, fileType: type, phpCode: code });
  };

  const handleSaveAndRun = () => {
    setAnswer("");
    saveAndRun(
      { brokerId: brokerIdNum, fileType: type, phpCode: code },
      {
        onSuccess: (data) => {
          setAnswer(JSON.stringify(data, null, 2));
        },
        onError: (err) => {
          setAnswer(String(err));
        },
      }
    );
  };

  return (
    <Dialog open={open && editorReady} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-1100 border-gray-1000 max-w-5xl p-4 md:p-4 gap-0 overflow-hidden flex flex-col">
        <DialogTitle className="sr-only">
          {type === "add" ? t("addLeadInteg") : t("updateLeadInteg")}
        </DialogTitle>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-1000">
          <span
            className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
              type === "add"
                ? "bg-green-500/20 text-green-400"
                : "bg-blue-500/20 text-blue-400"
            }`}
          >
            {type === "add" ? t("addLeadBadge") : t("updateLeadsBadge")}
          </span>
          <span className="text-sm text-foreground">
            {t("brokerLabel")}:{" "}
            <span className="font-semibold">{brokerName || "—"}</span>
          </span>
        </div>

        {/* Editor */}
        <div className="border-b border-gray-1000" style={{ height: "55vh" }}>
          <CodeEditor value={code} onChange={setCode} />
        </div>

        {/* Actions + Response */}
        <div className="pt-4 flex flex-col gap-4">
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={loading} className="flex-1">
              {isSaving && (
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2 inline-block" />
              )}
              {t("save")}
            </Button>
            <Button
              variant="secondary"
              onClick={handleSaveAndRun}
              disabled={loading}
              className="flex-1"
            >
              {isRunning && (
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2 inline-block" />
              )}
              {t("saveAndRun")}
            </Button>
          </div>

          <div className="relative">
            <textarea
              value={answer}
              readOnly
              placeholder={t("responsePlaceholder")}
              className="w-full bg-gray-1000 border border-gray-1000 rounded-md px-3 py-2 text-sm font-mono text-foreground placeholder:text-gray-500 focus:outline-none resize-none min-h-34"
            />
            <span className="absolute top-2 right-3 text-xs font-medium text-gray-500 pointer-events-none">{t("response")}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
