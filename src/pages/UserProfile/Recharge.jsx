// const UserRechargePackage = () => {
//   return <h1>Recharge Package Page Loaded</h1>;
// };
// export default UserRechargePackage;

import React, { useState, useEffect } from "react";
// import { getAllPackages } from "../../service/userPackage"; // Replace with your API
// import {
//   purchasePlanForUser,
//   getUserPlanHistory,
//   getCurrentPlan,
// } from "../../service/planService"; // You will create these later

const UserRechargePackage = ({ }) => {
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [planHistory, setPlanHistory] = useState([]);
  const [packages, setPackages] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);

  const [selectedPkg, setSelectedPkg] = useState({
    packageId: "",
    name: "",
    price: "",
  });

  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    try {
      const pkg = await getAllPackages();
      setPackages(pkg.data || []);

      const current = await getCurrentPlan(userId);
      setCurrentPlan(current.data || null);

      const history = await getUserPlanHistory(userId);
      setPlanHistory(history.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const openPurchasePopup = () => {
    setSelectedPkg({ packageId: "", name: "", price: "" });
    setPopupOpen(true);
  };

  const handleSelectPackage = (id) => {
    const pkg = packages.find((x) => x._id === id);
    if (!pkg) return;
    setSelectedPkg({
      packageId: id,
      name: pkg.name,
      price: pkg.basePrice,
    });
  };

  const buyPlan = async () => {
    if (!selectedPkg.packageId) {
      alert("Select a plan!");
      return;
    }

    try {
      await purchasePlanForUser(userId, selectedPkg);

      alert("Plan purchased successfully");

      setPopupOpen(false);
      loadInitial();
    } catch (err) {
      console.log(err);
      alert("Failed to buy plan");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-xl bg-gray-100 min-h-screen">
        Loading...
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <h2 className="text-2xl font-bold mb-6">User Plan Details</h2>

      {/* ---------------------- NO PLAN PURCHASED ------------------------ */}
      {!currentPlan && (
        <div className="text-center mt-10">
          <button
            onClick={openPurchasePopup}
            className="bg-blue-600 text-white px-6 py-2 rounded-md text-lg"
          >
            Purchase Plan
          </button>
        </div>
      )}

      {/* ---------------------- CURRENT PLAN CARD ------------------------ */}
      {currentPlan && (
        <div className="bg-white shadow-md p-5 rounded-lg border border-gray-300 mb-6">
          <h3 className="text-xl font-bold mb-3">Current Plan</h3>

          <p className="text-lg">
            <b>{currentPlan.packageName}</b>
          </p>
          <p>Price: ₹{currentPlan.price}</p>
          <p>Status: {currentPlan.status}</p>
          <p>Validity: {currentPlan.validity} days</p>

          <button
            onClick={openPurchasePopup}
            className="mt-4 bg-green-600 text-white px-5 py-2 rounded-md"
          >
            Renew Plan
          </button>
        </div>
      )}

      {/* ---------------------- PLAN HISTORY TABLE ------------------------ */}
      {planHistory.length > 0 && (
        <div className="bg-white shadow-md border border-gray-300 rounded-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200 text-gray-900">
                <th className="py-3 px-3">Plan</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Start Date</th>
                <th className="py-3 px-3">End Date</th>
              </tr>
            </thead>

            <tbody>
              {planHistory.map((p, index) => (
                <tr
                  key={p._id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-3 px-3">{p.packageName}</td>
                  <td className="py-3 px-3">₹{p.price}</td>
                  <td className="py-3 px-3">{p.startDate}</td>
                  <td className="py-3 px-3">{p.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------------------- PURCHASE POPUP ------------------------ */}
    {popupOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg">

      {/* Title */}
      <h3 className="text-xl font-bold mb-4">Purchase / Renew Plan</h3>

      {/* Plan Dropdown */}
      <label className="font-semibold">Select Package</label>
      <select
        className="w-full border border-gray-400 p-2 rounded bg-gray-100 text-black mt-1 mb-4"
        value={selectedPkg.packageId}
        onChange={(e) => handleSelectPackage(e.target.value)}
      >
        <option value="">Select Package</option>
        {packages.map((pkg) => (
          <option key={pkg._id} value={pkg._id}>
            {pkg.name}
          </option>
        ))}
      </select>

      {/* Price */}
      <label className="font-semibold">Price</label>
      <input
        value={selectedPkg.price}
        readOnly
        className="w-full border border-gray-400 p-2 bg-gray-200 rounded"
      />

      {/* PAYMENT RECEIVED TOGGLE */}
      <div className="mt-5">
        <p className="font-bold mb-2">Payment Received</p>

        <div className="flex gap-8 items-center">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="yes"
              checked={paymentReceived === "yes"}
              onChange={() => setPaymentReceived("yes")}
            />
            Yes
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="no"
              checked={paymentReceived === "no"}
              onChange={() => setPaymentReceived("no")}
            />
            No
          </label>
        </div>
      </div>

      {/* PAYMENT FIELDS – Only If Yes */}
      {paymentReceived === "yes" && (
        <div className="mt-4">

          <label className="font-semibold">Amount</label>
          <input
            type="number"
            className="w-full border border-gray-400 p-2 rounded mb-3"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <label className="font-semibold">Payment Date</label>
          <input
            type="date"
            className="w-full border border-gray-400 p-2 rounded mb-3"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />

          <label className="font-semibold">Payment Mode</label>
          <select
            className="w-full border border-gray-400 p-2 rounded mb-3 bg-white"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
          >
            <option>Cash</option>
            <option>Online</option>
            <option>Bank Transfer</option>
            <option>Cheque</option>
          </select>

          <label className="font-semibold">Remark</label>
          <textarea
            className="w-full border border-gray-400 p-2 rounded"
            rows={3}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          ></textarea>
        </div>
      )}

      {/* BUTTONS */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setPopupOpen(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Close
        </button>

        <button
          onClick={buyPlan}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default UserRechargePackage;
