// src/components/Dashboard/ViewDetails.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getToken } from '../../../utils/auth';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://192.168.1.13:5004';

const apiMap = {
  'register': '/dashboard/register/userList/details',
  'renewal': '/dashboard/renewal/userList/details',
  'active': '/dashboard/active/userList/details',
  'Inactive': '/dashboard/Inactive/userList/details',
  'case': '/dashboard/case/userList/details',
  'upcomig-renewal': '/dashboard/upcoming-renewal/userList/details',
};
const ViewDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [data, setData] = useState({ totalUsers: 0, users: [] });
  const [selectedMonth, setSelectedMonth] = useState(10);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const fetchDetails = async () => {
      if (!state?.type) return navigate('/dashboard');
      setLoading(true);
      try {
        const url = BASE_URL + apiMap[state.type] + (state.type === 'active' || state.type === 'register' ? `?filter=month&month=${selectedMonth}&year=${selectedYear}` : '');
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to fetch details');
        setData(result.data[0] || { totalUsers: 0, users: [] });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [state?.type, selectedMonth, selectedYear, navigate]);
  const handleBack = () => navigate('/');
  if (loading) return <p className="p-4">Loading details...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <button onClick={handleBack} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">
        Back to Dashboard
      </button>
      <div className="flex justify-center space-x-4 mb-6">
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(+e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          {monthNames.map((name, idx) => (
            <option key={idx} value={idx + 1}>
              {name}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(+e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          {Array.from({ length: 11 }, (_, i) => 2020 + i).map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200 text-[14px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1 text-left">S.No</th>
              <th className="px-2 py-1 text-left">Username</th>
              <th className="px-2 py-1 text-left">Name</th>
              <th className="px-2 py-1 text-left">Email</th>
              <th className="px-2 py-1 text-left">Phone</th>
              <th className="px-2 py-1 text-left">Wallet Balance</th>
              <th className="px-2 py-1 text-left">Plan</th>
              <th className="px-2 py-1 text-left">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.users.map((user, index) => (
              <tr key={user.username || index} className="hover:bg-gray-50">
                <td className="px-2 py-1">{index + 1}</td>
                <td className="px-2 py-1">{user.username}</td>
                <td className="px-2 py-1">{user.name}</td>
                <td className="px-2 py-1">{user.email}</td>
                <td className="px-2 py-1">{user.phone}</td>
                <td className="px-2 py-1">{user.wallet_balance !== undefined ? user.wallet_balance : '—'}</td>
                <td className="px-2 py-1">
                  {user.purchasedPlan ? `${user.purchasedPlan.packageName} (${user.purchasedPlan.validity})` : 'No Plan'}
                </td>
                <td className="px-2 py-1">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-gray-600">Total Users: {data.totalUsers}</p>
    </div>
  );
};
export default ViewDetails;