// src/app/dashboard/view-detail/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getDetailList } from "../../../../service/dashboardApi";

const ViewDashboardDetail = () => {
  const router = useRouter();
  const params = useSearchParams();

  const apiType = params.get("apiType");
  const title = params.get("title");
  const month = params.get("month");
  const year = params.get("year");

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getDetailList(apiType, month, year); // 👈 your detail API
        setData(res.data || []);
      } catch (error) {
        console.error("Error fetching detail data:", error);
      }
    };
    fetchDetail();
  }, [apiType, month, year]);
  return (
    <div className="p-6">
      <button
        onClick={() => router.back()}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-semibold mb-4">
        {title} - Detailed Report ({month}/{year})
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Created At</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, idx) => (
                <tr key={idx} className="text-center hover:bg-gray-50">
                  <td className="px-4 py-2 border">{idx + 1}</td>
                  <td className="px-4 py-2 border">{item.name}</td>
                  <td className="px-4 py-2 border">{item.email}</td>
                  <td className="px-4 py-2 border">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-gray-500 py-4 border"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ViewDashboardDetail;