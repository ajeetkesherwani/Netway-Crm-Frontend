import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate, useParams } from "react-router-dom";
import { getResellerWiseUserList } from "../../../../service/resellerWiseDetail";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function ResellerWiseDetails() {
  const { type, resellerId } = useParams();
  const navigate = useNavigate();

  const [filter, setFilter] = useState("day");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);

  const load = async () => {
    if (!resellerId || !type) return;
    setLoading(true);
    setError("");
    try {
      const res = await getResellerWiseUserList(type, resellerId, {
        filter,
        month: selectedMonth,
        year: selectedYear,
        page: 1,
        limit: 1000,
      });

      const root = res?.data ?? res;
      const list = Array.isArray(root?.result) ? root.result : Array.isArray(root?.data) ? root.data : Array.isArray(root) ? root : [];

      // API returns items like { label: "1 October", count: 0 }
      const labels = list.map((r) => String(r.label ?? ""));
      const values = list.map((r) => Number(r.count ?? r.totalUsers ?? 0));

      setChartData({
        labels,
        datasets: [
          {
            label: "Users",
            data: values,
            backgroundColor: labels.map((_, i) => ["#36A2EB", "#4BC0C0", "#FF6384", "#FFCE56", "#9966FF"][i % 5]),
            borderRadius: 6,
            maxBarThickness: 40,
          },
        ],
      });
    } catch (err) {
      setError(err?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-line */ }, [filter, selectedMonth, selectedYear, type, resellerId]);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: `${type ? type.toUpperCase() : ""} — ${filter.charAt(0).toUpperCase()+filter.slice(1)} Wise` },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 0,
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
        grid: { color: "#eee" },
      },
    },
    layout: { padding: { top: 8, bottom: 24 } },
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Reseller Wise — {type}</h1>
        <button onClick={() => navigate(-1)} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">Back</button>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button className={`px-3 py-1 rounded ${filter === "day" ? "bg-blue-600 text-white" : "bg-gray-100"}`} onClick={() => setFilter("day")}>Day</button>
          <button className={`px-3 py-1 rounded ${filter === "week" ? "bg-blue-600 text-white" : "bg-gray-100"}`} onClick={() => setFilter("week")}>Week</button>
          <button className={`px-3 py-1 rounded ${filter === "month" ? "bg-blue-600 text-white" : "bg-gray-100"}`} onClick={() => setFilter("month")}>Month</button>
        </div>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(+e.target.value)} className="border px-2 py-1 rounded" disabled={filter === "month"}>
          {monthNames.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
        </select>
        <select value={selectedYear} onChange={(e) => setSelectedYear(+e.target.value)} className="border px-2 py-1 rounded">
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      {loading ? (
        <div className="p-8 text-center">Loading chart...</div>
      ) : error ? (
        <div className="p-4 text-red-600">{error}</div>
      ) : (
        <div style={{ height: 420 }}>
          <Bar options={options} data={chartData} />
        </div>
      )}
    </div>
  );
}