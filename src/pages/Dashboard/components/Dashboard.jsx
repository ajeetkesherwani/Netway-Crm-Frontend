import React, { useState, useEffect } from 'react';
import Card from './Cards';
import DashboardDetails from './DashboardDetails';
import { getUserList, getAllType } from '../../../service/dashboardApi';
import { useNavigate } from 'react-router';
import { usePermission } from "../../../context/PermissionContext";
import { getDashboardSummary } from "../../../service/dashboardApi";
import DashboardSection from "./DashboardSection";
import MiniCard from "./MiniCard";

import {
  FaClock,
  FaTasks,
  FaCheckCircle,
  FaTimesCircle,
  FaFileAlt,
  FaBan,
  FaWifi,
} from "react-icons/fa";
const typeMap = {
  'Registration *': 'register',
  'Renewal': 'renewal',
  'Active': 'active',
  'Inactive': 'Inactive',
  'Case *': 'case',
  'Upcoming Renewal *': 'upcoming-renewal',
};
const Dashboard = () => {
  const { permissions, loading } = usePermission();
  const hasTruePermission = (group) =>
    group && Object.values(group).some((v) => v === true);
  const [data, setData] = useState({
    registration: { big: 0, today: 0, week: 0, month: 0 },
    renewal: { big: 0, today: 0, week: 0, month: 0 },
    active: { big: 0, today: 0, week: 0, month: 0 },
    inactive: { big: 0, today: 0, week: 0, month: 0 },
    case: { big: 0, today: 0, week: 0, month: 0 },
    upcomingRenewal: { big: 0, today: 0, week: 0, month: 0 },
    onlineUser: 0,
  });
  const navigate = useNavigate();
  console.log(data, " this is the dashboard data");
  const [selectedType, setSelectedType] = useState(null);

  const [summary, setSummary] = useState({
    tickets: {},
    caf: {},
    serviceOpted: {},
    ekyc: {},
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getDashboardSummary();
        setSummary(res.data || {});
      } catch (err) {
        console.error("Dashboard summary error", err);
      }
    };

    fetchSummary();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
        const currentYear = currentDate.getFullYear();
        const currentWeek = Math.ceil(currentDay / 7);

        const fetchForType = async (type) => {
          try {
            // Single API call for the type, assuming it returns all periods in one response
            const res = await getUserList(type, currentMonth, currentYear);
            console.log(res, `${type} response`);
            const data = res.data || {};
            return {
              today: data.todayUsers || data.todayRenewals || data.todayExpiring || 0,
              week: data.weekUsers || data.weekRenewals || data.weekExpiring || 0,
              month: data.monthUsers || data.monthRenewals || data.monthExpiring || 0,
              big: data.totalUsers || data.totalRenewalUsers || data.totalExpiringUsers || 0,
            };
          } catch (err) {
            console.error(`Error fetching ${type}:`, err);
            return { today: 0, week: 0, month: 0, big: 0 };
          }
        };
        const registration = await fetchForType('register');
        const renewal = await fetchForType('renewal');
        const active = await fetchForType('active');
        const inactive = await fetchForType('Inactive');
        // For 'case' and 'upcomingRenewal', assuming they use a different endpoint or the same with type
        const caseRes = await fetchForType('case');
        const upcomingRenewalRes = await fetchForType('upcomig-renewal');
        const allTypeRes = await getAllType();
        const allType = allTypeRes.data || {};
        console.log(registration, renewal, active, inactive, caseRes, upcomingRenewalRes, allType, 'fetched data');
        setData({
          registration: { ...registration, big: registration.big },
          renewal: { ...renewal, big: renewal.big },
          active: { ...active, big: allType.active || active.big },
          inactive: { ...inactive, big: allType.Inactive || inactive.big },
          case: { ...caseRes, big: allType.case || caseRes.big },
          upcomingRenewal: { ...upcomingRenewalRes, big: upcomingRenewalRes.big },
          // onlineUser: 5254,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  // const handleViewDetails = (title) => setSelectedType(title);
  const handleViewDetails = (title) => navigate("/dashboard/details", { state: { type: typeMap[title], title: typeMap[title] } });
  const handleResellerWise = (title) => navigate("/reseller-wise-list/" + title);

  if (selectedType) {
    return (
      <DashboardDetails
        apiType={typeMap[selectedType]}
        title={selectedType}
        onBack={() => setSelectedType(null)}
      />
    );
  }
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title="Registration *"
          big={data.registration.big}
          today={data.registration.today}
          week={data.registration.week}
          month={data.registration.month}
          color="blue"
          onViewDetails={() => handleViewDetails('Registration *')}
          onResellerWise={() => handleResellerWise('register')}
          viewPermission={permissions.dashboard?.RegistrationViewDetail}
          resellerWisePermission={permissions.dashboard?.RegistrationResellerWise}
        />

        <Card
          title="Renewal"
          big={data.renewal.big}
          today={data.renewal.today}
          week={data.renewal.week}
          month={data.renewal.month}
          color="yellow"
          onViewDetails={() => handleViewDetails('Renewal *')}
          onResellerWise={() => handleResellerWise('renewal')}
          viewPermission={permissions.dashboard?.RenewalViewDetail}
          resellerWisePermission={permissions.dashboard?.RenewalResellerWise}
        />

        <Card
          title="Active"
          big={data.active.big}
          today={data.active.today}
          week={data.active.week}
          month={data.active.month}
          color="green"
          onViewDetails={() => handleViewDetails('Active*')}
          onResellerWise={() => handleResellerWise('active')}
          viewPermission={permissions.dashboard?.ActiveViewDetail}
          resellerWisePermission={permissions.dashboard?.ActiveResellerWise}
        />

        <Card
          title="Inactive"
          big={data.inactive.big}
          today={data.inactive.today}
          week={data.inactive.week}
          month={data.inactive.month}
          color="gray"
          onViewDetails={() => handleViewDetails('Inactive *')}
          onResellerWise={() => handleResellerWise('inActive')}
          viewPermission={permissions.dashboard?.InactiveViewDetail}
          resellerWisePermission={permissions.dashboard?.InactiveResellerWise}
        />
        <Card
          title="Upcoming Renewal *"
          big={data.upcomingRenewal.big}
          today={data.upcomingRenewal.today}
          week={data.upcomingRenewal.week}
          month={data.upcomingRenewal.month}
          color="blue"
          onViewDetails={() => handleViewDetails('Upcoming Renewal *')}
          onResellerWise={() => handleResellerWise('upcomingRenewal')}
          viewPermission={permissions.dashboard?.UpComRenewalViewDetail}
          resellerWisePermission={permissions.dashboard?.UpComRenewalResellerWise}
        />
      </div>

      <DashboardSection title="Complaint Status">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MiniCard title="Open"
            value={summary.tickets?.Open}
            icon={<FaClock />}
            color="red"
            onCountClick={() => navigate("ticket/manage")}
          />

          <MiniCard
            title="Assigned"
            value={summary.tickets?.Assigned}
            icon={<FaTasks />}
            color="orange"
            onCountClick={() => navigate("ticket/manage")}
          />

          <MiniCard
            title="Fixed"
            value={summary.tickets?.Fixed}
            icon={<FaCheckCircle />}
            color="green"
            onCountClick={() => navigate("/ticket/approval")}
          />

          <MiniCard
            title="Closed"
            value={summary.tickets?.Closed}
            icon={<FaTimesCircle />}
            color="teal"
            onCountClick={() => navigate("/ticket/close")}
          />

          <MiniCard
            title="Total"
            value={summary.tickets?.total}
            icon={<FaFileAlt />}
            color="blue"
            onCountClick={() => navigate("/ticket/all")}
          />

        </div>
      </DashboardSection>

      <DashboardSection title="CAF Form">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MiniCard
            title="CAF Uploaded"
            value={summary.caf?.uploaded}
            icon={<FaCheckCircle />}
            color="green"
            onCountClick={() => navigate("/user/list")}
          />
          <MiniCard
            title="CAF Not Uploaded"
            value={summary.caf?.notUploaded}
            icon={<FaBan />}
            color="red"
            onCountClick={() => navigate("/user/list")}
          />
        </div>
      </DashboardSection>

      <DashboardSection title="Service">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MiniCard
            title="Intercom"
            value={summary.serviceOpted?.intercom}
            icon={<FaWifi />}
            color="blue"
            onCountClick={() => navigate("/user/list")}
          />
          <MiniCard
            title="Broadband"
            value={
              summary.serviceOpted?.broadband +
              (summary.serviceOpted?.broadBand || 0)
            }
            icon={<FaWifi />}
            color="green"
            onCountClick={() => navigate("/user/list")}
          />
          <MiniCard
            title="Corporate"
            value={summary.serviceOpted?.corporate}
            icon={<FaWifi />}
            color="gray"
            onCountClick={() => navigate("/user/list")}
          />
        </div>
      </DashboardSection>

      <DashboardSection title="eKYC Status">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MiniCard
            title="eKYC Completed"
            value={summary.ekyc?.yes}
            icon={<FaCheckCircle />}
            color="green"
            onCountClick={() => navigate("/user/list?ekyc=yes")}
          />

          <MiniCard
            title="eKYC Pending"
            value={summary.ekyc?.no}
            icon={<FaBan />}
            color="red"
            onCountClick={() => navigate("/user/list?ekyc=no")}
          />
        </div>
      </DashboardSection>


    </div>
  );
};

export default Dashboard;
