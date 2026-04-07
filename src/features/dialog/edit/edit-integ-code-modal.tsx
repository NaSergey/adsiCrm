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
// example code (add lead to broker)
// $lead_data - an array with data received from a partner

$headers = [
    'Content-Type: application/json',
];

$j_data = array(
    'first_name' => $lead_data->first_name,
    'last_name'  => $lead_data->last_name,
    'email'      => $lead_data->email,
    'phone'      => $lead_data->phone,
    'country'    => strtolower($lead_data->country),
    'lang'       => strtolower($lead_data->lang),
    'user_ip'    => $lead_data->user_ip,
    'funnel'     => $lead_data->funnel,
    'pass'       => $lead_data->password,
    'key'        => 'secret_key_from_broker',
);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.my_broker.com/add_lead/');
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($j_data));
$result = json_decode(curl_exec($ch), true);

if (isset($result['id'])) {
    return array('success' => true, 'lead_id' => $result['id'], 'broker_answer' => $result, 'autologin_url' => $result['autologin_url']);
} else {
    return array('success' => false, 'info' => 'error adding lead', 'lead_data' => $j_data, 'broker_answer' => $result);
}`;

const UPDATE_LEAD_EXAMPLE = `<?php
// example code for update leads

$answer = [];

$leads = json_decode(file_get_contents('https://api.mybroker/get_leads'), true);

for ($i = 0; $i < count($leads); $i++) {
    $answer[] = [
        'lead_id'  => $leads[$i]['id'],
        'status'   => $leads[$i]['broker_status'],
        'ftd'      => $leads[$i]['ftd'],
        'ftd_date' => $leads[$i]['ftd_date'],
    ];
}
return $answer;`;

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
      <DialogContent className="bg-gray-1100 border-gray-1000 max-w-5xl p-0 gap-0 overflow-hidden flex flex-col">
        <DialogTitle className="sr-only">
          {type === "add" ? t("addLeadInteg") : t("updateLeadInteg")}
        </DialogTitle>

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-1000">
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
        <div className="px-6 py-4 flex flex-col gap-4">
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

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-500">{t("response")}</span>
            <textarea
              value={answer}
              readOnly
              placeholder={t("responsePlaceholder")}
              className="w-full bg-gray-1000 border border-gray-1000 rounded-md px-3 py-2 text-sm font-mono text-foreground placeholder:text-gray-500 focus:outline-none resize-none min-h-[100px]"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
