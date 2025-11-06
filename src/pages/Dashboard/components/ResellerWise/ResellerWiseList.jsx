import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResellerWiseUserList } from '../../../../service/resellerWiseData';
import { toast } from 'react-toastify';
import Card from '../Cards';
import ResellerCard from './ResellerCard';

const ResellerWiseListing = () => {
  const { type } = useParams(); // e.g., 'register', 'active', etc.
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getResellerWiseUserList(type);
        setData(res.data.result || []);
      } catch (err) {
        console.error('Error fetching reseller-wise data:', err);
        setError(err.message || 'Failed to load data');
        toast.error('Failed to load reseller-wise data ❌');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type]);

  if (loading) return <p className="p-4 text-center">Loading...</p>;
  if (error) return <p className="p-4 text-red-500 text-center">{error}</p>;

  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
  const colorMap = {
    'register': 'blue',
    'renewal': 'yellow',
    'active': 'green',
    'inActive': 'gray',
    'case': 'yellow',
    'upcomig-renewal': 'blue',
  };
  const cardColor = colorMap[type] || 'blue'; // Default to blue

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Reseller Wise - {capitalizedType}</h1>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
        >
          Back to Dashboard
        </button>
      </div>
      {data.length === 0 ? (
        <p className="text-gray-500 text-center">No data available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map((item) => (
            <ResellerCard
              key={item.resellerId }
              title={item.resellerName}
              big={item.totalUsers || item?.totalUpcomingRenewals || item?.totalRenewedUsers || item?.totalActiveUsers || 0}
              today={item.todayUsers || item?.todayExpiringUsers || item?.todayRenewedUsers || item?.todayActiveUsers || 0}
              week={item.weekUsers || item?.weekExpiringUsers || item?.weekRenewedUsers || item?.weekActiveUsers || 0}
              month={item.monthUsers || item?.monthExpiringUsers || item?.monthRenewedUsers || item?.monthActiveUsers || 0}
              color={cardColor}
              onViewDetails={() => navigate(`/reseller-wise-details/${type}/${item.resellerId}`)}
              onLcoWise={() => navigate(`/lco-wise-list/${type}/${item.resellerId}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default ResellerWiseListing;