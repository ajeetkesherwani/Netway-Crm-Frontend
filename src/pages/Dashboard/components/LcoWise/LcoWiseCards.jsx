import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getLcoActiveUserList,
  getLcoRegisterUserList,
  getLcoInActiveUserList,
  getLcoRenewalUserList,
  getLcoUpcomingRenewalUserList,
} from "../../../../service/lcoWise";
import LcoWiseCard from "./LcoWiseCard";

export default function LcoWiseCards() {
  const { type, resellerId } = useParams(); // expect route like /dashboard/lco/:resellerId/:type
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // pagination & search (optional)
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let res;
        switch ((type || "").toLowerCase()) {
          case "active":
            res = await getLcoActiveUserList(resellerId, page, limit, search);
            break;
          case "register":
            res = await getLcoRegisterUserList(resellerId, page, limit, search);
            break;
          case "inactive":
          case "inActive":
            res = await getLcoInActiveUserList(resellerId, page, limit, search);
            break;
          case "renewal":
            res = await getLcoRenewalUserList(resellerId, page, limit, search);
            break;
          case "upcoming-renewal":
          case "upcomingrenewal":
          case "upcomig-renewal":
            res = await getLcoUpcomingRenewalUserList(resellerId, page, limit, search);
            break;
          default:
            res = await getLcoActiveUserList(resellerId, page, limit, search);
        }
        // flexible payload extraction (api may return {status, message, data: { data: [...] } })
        const payload = res?.data ?? res;
        const list = Array.isArray(payload?.data) ? payload.data : payload?.result ?? payload?.list ?? [];
        setData(list);
      } catch (err) {
        console.error("Failed to fetch LCO wise data", err);
        setError(err?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    if (resellerId) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, resellerId, page, search]);
  if (loading) return <p className="p-4 text-center">Loading...</p>;
  if (error) return <p className="p-4 text-red-500 text-center">{error}</p>;
  if (!data || data.length === 0) return <p className="p-4 text-center text-gray-500">No data available.</p>;
  // pick color based on type
  const colorMap = {
    register: "blue",
    renewal: "yellow",
    active: "green",
    inActive: "gray",
    inactive: "gray",
    "upcoming-renewal": "blue",
  };
  const cardColor = colorMap[type] || "blue";
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">LCO Wise - {type?.charAt(0)?.toUpperCase() + (type?.slice(1) || "")}</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">Back</button>
          {/* <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search LCO..."
            className="border p-2 rounded w-64"
          /> */}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((item) => (
          <LcoWiseCard
            key={item?.lcoId || item?._id || item?.id || item?.lco || item?.name}
            title={item?.lcoName || item?.name || item?.lco || "LCO"}
            big={item?.totalUsers ?? item?.total ?? 0}
            today={item.todayUsers ?? item.today ?? 0}
            week={item.weekUsers ?? item.week ?? 0}
            month={item.monthUsers ?? item.month ?? 0}
            color={cardColor}
            onViewDetails={() => navigate(`/lco-wise-details/${type}/${resellerId}/${item.lcoId || item._id || item.id}`)}
          />
        ))}
      </div>
    </div>
  );
}