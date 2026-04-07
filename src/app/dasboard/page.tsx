"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/shared/ui/button";
import { DateInput } from "@/shared/ui/date-input";
import { Select } from "@/shared/ui/select";

const PARTNER_OPTIONS = [
  { value: "1", label: "Partner Alpha" },
  { value: "2", label: "Partner Beta" },
  { value: "3", label: "Partner Gamma" },
];

const BROKER_OPTIONS = [
  { value: "1", label: "Broker One" },
  { value: "2", label: "Broker Two" },
  { value: "3", label: "Broker Three" },
];

const lineData = [
  { date: "01 Mar", leads: 42, sales: 18 },
  { date: "02 Mar", leads: 58, sales: 24 },
  { date: "03 Mar", leads: 35, sales: 15 },
  { date: "04 Mar", leads: 71, sales: 31 },
  { date: "05 Mar", leads: 63, sales: 27 },
  { date: "06 Mar", leads: 80, sales: 36 },
  { date: "07 Mar", leads: 54, sales: 22 },
];

const barData = [
  { broker: "Broker One", leads: 210, sales: 87 },
  { broker: "Broker Two", leads: 175, sales: 64 },
  { broker: "Broker Three", leads: 143, sales: 59 },
  { broker: "Broker Four", leads: 98, sales: 41 },
  { broker: "Broker Five", leads: 67, sales: 28 },
];

const topPartners = [
  { rank: 1, name: "Partner Alpha", leads: 312, sales: 124, revenue: "$18,400" },
  { rank: 2, name: "Partner Beta", leads: 278, sales: 98, revenue: "$14,200" },
  { rank: 3, name: "Partner Gamma", leads: 241, sales: 87, revenue: "$12,100" },
  { rank: 4, name: "Partner Delta", leads: 198, sales: 73, revenue: "$9,800" },
  { rank: 5, name: "Partner Epsilon", leads: 154, sales: 61, revenue: "$7,500" },
];

const topBrokers = [
  { rank: 1, name: "Broker One", leads: 210, sales: 87, revenue: "$11,200" },
  { rank: 2, name: "Broker Two", leads: 175, sales: 64, revenue: "$9,400" },
  { rank: 3, name: "Broker Three", leads: 143, sales: 59, revenue: "$7,800" },
  { rank: 4, name: "Broker Four", leads: 98, sales: 41, revenue: "$5,300" },
  { rank: 5, name: "Broker Five", leads: 67, sales: 28, revenue: "$3,600" },
];

const chartStyles = {
  grid: "#374151",
  axis: "#6b7280",
  tooltip: {
    contentStyle: {
      backgroundColor: "#1f2937",
      border: "1px solid #374151",
      borderRadius: "8px",
      color: "#fff",
    },
  },
};

export default function DashboardPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [brokerId, setBrokerId] = useState("");

  const handleReset = () => {
    setDateFrom("");
    setDateTo("");
    setPartnerId("");
    setBrokerId("");
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Filters */}
      <section className="flex items-center gap-3">
        <Select options={PARTNER_OPTIONS} placeholder="All partners" value={partnerId} onChange={setPartnerId} className="w-full" />
        <Select options={BROKER_OPTIONS} placeholder="All brokers" value={brokerId} onChange={setBrokerId} className="w-full" />
        <DateInput type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full" />
        <DateInput type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full" />
        <Button size="sm">Apply</Button>
        <Button size="sm" variant="ghost" onClick={handleReset}>Clear</Button>
      </section>

      {/* Charts */}
      <section className="grid gap-4 lg:grid-cols-2">
        {/* Line chart */}
        <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-1100 p-4">
          <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Leads &amp; Sales over time</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.grid} />
              <XAxis dataKey="date" tick={{ fill: chartStyles.axis, fontSize: 12 }} />
              <YAxis tick={{ fill: chartStyles.axis, fontSize: 12 }} />
              <Tooltip {...chartStyles.tooltip} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="sales" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart */}
        <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-1100 p-4">
          <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Leads vs Sales by Broker</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.grid} />
              <XAxis dataKey="broker" tick={{ fill: chartStyles.axis, fontSize: 11 }} />
              <YAxis tick={{ fill: chartStyles.axis, fontSize: 12 }} />
              <Tooltip {...chartStyles.tooltip} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="leads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sales" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Top5 tables */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Top5Table title="Top 5 Partners" rows={topPartners} />
        <Top5Table title="Top 5 Brokers" rows={topBrokers} />
      </section>
    </div>
  );
}

interface Top5Row {
  rank: number;
  name: string;
  leads: number;
  sales: number;
  revenue: string;
}

function Top5Table({ title, rows }: { title: string; rows: Top5Row[] }) {
  return (
    <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-1100 p-4">
      <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-xs text-gray-500">
            <th className="pb-2 font-medium">#</th>
            <th className="pb-2 font-medium">Name</th>
            <th className="pb-2 text-right font-medium">Leads</th>
            <th className="pb-2 text-right font-medium">Sales</th>
            <th className="pb-2 text-right font-medium">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.rank}
              className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-1000/40 transition-colors"
            >
              <td className="py-2 pr-2 text-gray-400 font-medium">{row.rank}</td>
              <td className="py-2 text-gray-900 dark:text-white">{row.name}</td>
              <td className="py-2 text-right text-gray-900 dark:text-white">{row.leads}</td>
              <td className="py-2 text-right text-gray-900 dark:text-white">{row.sales}</td>
              <td className="py-2 text-right text-green-600 dark:text-green-400 font-medium">{row.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
