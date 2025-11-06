// src/components/Dashboard/DashboardDetails.jsx
import React, { useState, useEffect, useRef } from "react";
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
import { getUserListDetails } from "../../../service/dashboardApi";
import { useLocation, useNavigate } from "react-router";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const backgroundColors = [
  "#36A2EB", "#FF6384", "#4BC0C0", "#FFCE56",
  "#9966FF", "#FF9F40", "#E7E9ED", "#36A2EB",
  "#FF6384", "#4BC0C0", "#FFCE56", "#9966FF",
];

const DashboardDetails = () => {
  const location = useLocation();
  console.log(location," this is  the data in the location on  the view detail page")
  const { state } = location;
  const { type: apiType, title } = state || {};
  console.log(apiType, title, 'DashboardDetails received state');
  const [view, setView] = useState("day");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() +1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [tableData, setTableData] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);
  // safe title to avoid .replace on undefined
  const safeTitle = String(title ?? apiType ?? "");
  // map visible titles to API types — extend as needed
  const typeMap = {
    "Registered Users": "register",
    "Register": "register",
    "Active Users": "active",
    "Active": "active",
    "InActive Users": "inActive",
    "Inactive": "inActive",
    "Renewal": "renewal",
    "Upcoming Renewal": "upcomingRenewal",
    // fallback keys can be added here
  };
  const handleViewDetails = (titleValue) => {
    console.log(titleValue, 'title value in handleViewDetails');
    const resolvedType = typeMap[titleValue] || apiType || String(titleValue || "").toLowerCase();
    navigate("/dashboard/details", { state: { type: resolvedType } });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        let labels = [];
        let dataValues = [];
        let table = [];
        if (view === "day" || view === "week") {
          const res = await getUserListDetails(apiType, view, selectedMonth, selectedYear);
          const raw = res?.data ?? res;
          const items = Array.isArray(raw) ? raw : Array.isArray(raw?.result) ? raw.result : Array.isArray(raw?.data) ? raw.data : [];
          const sortedData = items.sort((a, b) =>
            view === "day" ? (a._id?.day || 0) - (b._id?.day || 0) : (a._id?.monthWeek || 0) - (b._id?.monthWeek || 0)
          );
          labels = sortedData.map(d =>
            view === "day"
              ? (d.label ?? `${d._id?.day} ${monthNames[selectedMonth - 1].slice(0, 3)}`)
              : (d.label ?? `Week ${d._id?.monthWeek}`)
          );
          dataValues = sortedData.map(d => Number(d.count ?? d.totalUsers ?? 0));
          table = sortedData.map(d => ({
            label: d.label ?? (view === "day" ? `${d._id?.day} ${monthNames[selectedMonth - 1].slice(0, 3)}` : `Week ${d._id?.monthWeek}`),
            count: Number(d.count ?? d.totalUsers ?? 0),
            users: d.users ?? [],
          }));
        } else {
          const res = await getUserListDetails(apiType, "month", selectedMonth, selectedYear);
          const raw = res?.data ?? res;
          const items = Array.isArray(raw) ? raw : Array.isArray(raw?.result) ? raw.result : Array.isArray(raw?.data) ? raw.data : [];
          if (items.length && items[0].label) {
            labels = items.map(i => i.label);
            dataValues = items.map(i => Number(i.count ?? i.totalUsers ?? 0));
            table = items.map(i => ({ label: i.label, count: Number(i.count ?? i.totalUsers ?? 0), users: i.users ?? [] }));
          } else {
            labels = monthNames.map(m => m.slice(0,3));
            const values = [];
            const rows = [];
            for (let m = 1; m <= 12; m++) {
              const r = items.find(it => (it._id?.month ?? it._id ?? 0) === m) ?? {};
              values.push(Number(r.count ?? r.totalUsers ?? 0));
              rows.push({ label: monthNames[m-1].slice(0,3), count: Number(r.count ?? r.totalUsers ?? 0), users: r.users ?? [] });
            }
            dataValues = values;
            table = rows;
          }
        }
        setChartData({
          labels,
          datasets: [
            {
              label: "Total Users",
              data: dataValues,
              backgroundColor: labels.map((_, i) => backgroundColors[i % backgroundColors.length]),
              borderRadius: 6,
              maxBarThickness: 40,
            },
          ],
        });
        setTableData(table);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };
    fetchData();
  }, [view, selectedMonth, selectedYear, apiType]);
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        // use safeTitle so replace doesn't crash when title is undefined
        text: `${safeTitle.replace(/\*$/, "")} - ${view.charAt(0).toUpperCase() + view.slice(1)} Wise`,
      },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        ticks: { autoSkip: false, maxRotation: 45, minRotation: 0 },
        grid: { display: false },
      },
      y: { title: { display: true, text: "Total Units" }, beginAtZero: true },
    },
    layout: { padding: { top: 8, bottom: 24 } },
  };

  // robust click handler using chartRef to get elements
  const handleBarClick = (event) => {
    try {
      const chart = chartRef.current;
      if (!chart) return;
      // event.native is provided by react-chartjs-2; fallback to event
      const nativeEvent = event?.native || event;
      const points = chart.getElementsAtEventForMode(nativeEvent, "nearest", { intersect: true }, true);
      if (!points || points.length === 0) return;
      const first = points[0];
      const index = first.index;
      const row = tableData[index];
      const users = row?.users ?? [];
      navigate("/dashboard/chart-users", {
        state: {
          label: row?.label ?? chartData.labels?.[index],
          count: row?.count ?? chartData.datasets?.[0]?.data?.[index] ?? 0,
          users,
          meta: { view, month: selectedMonth, year: selectedYear, apiType: apiType, title },
        },
      });
    } catch (err) {
      console.error("bar click error:", err);
    }
  };
  return (
    <div className="p-6">
      <div className="flex justify-end">
      <button onClick={() => navigate(-1)} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded ">Back to Dashboard</button>
</div>
      <div className="flex justify-center items-center space-x-4 mb-4">
        {["day", "week", "month"].map((typeBtn) => (
          <React.Fragment key={typeBtn}>
            <button className={`font-medium ${view === typeBtn ? "text-blue-500" : "text-gray-600"}`} onClick={() => setView(typeBtn)}>
              {typeBtn.charAt(0).toUpperCase() + typeBtn.slice(1)} Wise
            </button>
            <span>•</span>
          </React.Fragment>
        ))}
        <button className="font-medium text-gray-600" onClick={() => handleViewDetails(title)}>
          View Details
        </button>
        {/* <span>•</span> */}
        {/* <button className="font-medium text-gray-600" onClick={() => alert(`Reseller wise for ${title}`)}>Reseller Wise</button> */}
      </div>
      <div className="flex justify-center space-x-4 mb-6">
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(+e.target.value)} className="border border-gray-300 rounded px-2 py-1" disabled={view === "month"}>
          {monthNames.map((name, idx) => <option key={idx} value={idx + 1}>{name}</option>)}
        </select>
        <select value={selectedYear} onChange={(e) => setSelectedYear(+e.target.value)} className="border border-gray-300 rounded px-2 py-1">
          {years.map((year) => <option key={year} value={year}>{year}</option>)}
        </select>
      </div>
      <div className="w-full" style={{ height: 420 }}>
        <Bar
          ref={chartRef}
          options={options}
          data={chartData}
          onClick={handleBarClick}
        />
      </div>
      {showDetails && null}
    </div>
  );
};

export default DashboardDetails;
