
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCurrentPlan,
  createPurchasedPlan,
  renewPurchasedPlan,
  getAssignedPackageList,
} from "../../service/recharge";
import ProtectedAction from "../../components/ProtectedAction";

const UserRechargePackage = () => {
  const { id: userId } = useParams();

  const [plan, setPlan] = useState(null);
  const [packages, setPackages] = useState([]); // assigned packages
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isRenew, setIsRenew] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null); // for display

  const [form, setForm] = useState({
    packageId: "",
    amountPaid: 0,
    startDate: "",
    expiryDate: "",
    paymentReceived: "No",
    paymentAmount: 0,
    paymentDate: "",
    paymentMethod: "Cash",
    remark: "",
    paymentRemark: "",
  });

  useEffect(() => {
    fetchCurrentPlan();
    fetchPackages();
  }, [userId]);

  const fetchCurrentPlan = async () => {
    try {
      setLoading(true);
      const res = await getCurrentPlan(userId);
      if (res.status && res.data && res.data.length > 0) {
        const active = res.data.find((p) => p.status === "active") || res.data[0];
        setPlan(active);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await getAssignedPackageList(userId);
      if (res.status) {
        setPackages(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load packages", err);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

  const openPurchaseModal = () => {
    setIsRenew(false);
    const today = new Date().toISOString().split("T")[0];
    setForm({
      packageId: "",
      amountPaid: 0,
      startDate: today,
      expiryDate: "",
      paymentReceived: "No",
      paymentAmount: 0,
      paymentDate: today,
      paymentMethod: "Cash",
      remark: "",
      paymentRemark: "",
    });
    setSelectedPackage(null);
    setShowModal(true);
  };

  const openRenewModal = () => {
    if (!plan) return alert("No active plan to renew");

    const assignedPkg = packages.find(p => p.packageId === plan.packageId?._id);
    if (!assignedPkg) return alert("Assigned package not found");

    const start = new Date(plan.expiryDate);
    start.setDate(start.getDate() + 1);
    const expiry = new Date(start);
    expiry.setMonth(expiry.getMonth() + (assignedPkg.validity?.number || 1));

    setIsRenew(true);
    setSelectedPackage(assignedPkg);
    setForm({
      packageId: assignedPkg._id,
      amountPaid: assignedPkg.customPrice,
      startDate: start.toISOString().split("T")[0],
      expiryDate: expiry.toISOString().split("T")[0],
      paymentReceived: "No",
      paymentAmount: assignedPkg.customPrice,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "Cash",
      remark: "Renewed plan",
      paymentRemark: "",
    });
    setShowModal(true);
  };

  const handlePackageChange = (assignedPkgId) => {
    const pkg = packages.find((p) => p._id === assignedPkgId);
    if (!pkg) return;

    setSelectedPackage(pkg);

    const start = isRenew ? new Date(plan.expiryDate) : new Date();
    start.setDate(start.getDate() + (isRenew ? 1 : 0));
    const expiry = new Date(start);
    expiry.setMonth(expiry.getMonth() + (pkg.validity?.number || 1));

    setForm({
      ...form,
      packageId: pkg._id,
      amountPaid: pkg.customPrice,
      paymentAmount: pkg.customPrice,
      startDate: start.toISOString().split("T")[0],
      expiryDate: expiry.toISOString().split("T")[0],
    });
  };

  const handleSubmit = async () => {
    if (!form.packageId) return alert("Please select a package");

    try {
      setMessage("Processing...");
      const payload = {
        userId,
        packageId: selectedPackage?.packageId,
        assignedPackageId: form.packageId,
        startDate: new Date(form.startDate).toISOString(),
        expiryDate: new Date(form.expiryDate).toISOString(),
        amountPaid: parseFloat(form.amountPaid),
        paymentMethod: form.paymentMethod,
        paymentStatus: form.paymentReceived === "Yes" ? "paid" : "pending",
        paymentDate: form.paymentReceived === "Yes" ? new Date(form.paymentDate).toISOString() : null,
        remark: form.remark,
        paymentRemark: form.paymentRemark,
      };

      let res;
      if (isRenew && plan?._id) {
        res = await renewPurchasedPlan(plan._id, payload);
      } else {
        res = await createPurchasedPlan(payload);
      }

      if (res.status) {
        setMessage("Plan processed successfully!");
        setTimeout(() => {
          setShowModal(false);
          fetchCurrentPlan();
          setMessage("");
        }, 2000);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">User Recharge Management</h2>

          <div className="flex justify-end gap-6 mb-8">
            <ProtectedAction module="customer" action="purchasedNewPackage">
            <button
              onClick={openPurchaseModal}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold py-3 px-10 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            >
              Purchase New Plan
            </button>
            </ProtectedAction>
          </div>

          {!plan ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-xl text-gray-600">No active plan found for this user.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gray-800 text-white p-4">
                <h3 className="text-xl font-bold">Current Active Plan</h3>
              </div>
              <table className="w-full">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left">Package</th>
                    <th className="px-6 py-4 text-left">Speed</th>
                    <th className="px-6 py-4 text-left">Validity</th>
                    <th className="px-6 py-4 text-left">Start</th>
                    <th className="px-6 py-4 text-left">Expiry</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <ProtectedAction module="customer" action="renewPackage">
                    <th className="px-6 py-4 text-left">Action</th>
                    </ProtectedAction>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50 border-b">
                    <td className="px-6 py-4 font-semibold">{plan.packageId?.name}</td>
                    <td className="px-6 py-4">{plan.packageId?.speed} Mbps</td>
                    <td className="px-6 py-4">
                      {plan.packageId?.validity?.number} {plan.packageId?.validity?.unit}
                    </td>
                    <td className="px-6 py-4">{formatDate(plan.startDate)}</td>
                    <td className="px-6 py-4">{formatDate(plan.expiryDate)}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold">
                        Active
                      </span>
                    </td>
                    <ProtectedAction module="customer" action="renewPackage">
                    <td className="px-6 py-4">
                      <button
                        onClick={openRenewModal}
                        className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-bold py-2 px-5 rounded shadow transition"
                      >
                        Renew Now
                      </button>
                    </td>
                    </ProtectedAction>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL - ALL FIELDS PRESERVED + BLUE BORDER + COMPACT */}

      {showModal && (
        <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl border-4 border-blue-500 max-h-screen">
            {/* Header */}
            <div className="bg-gray-700 text-white px-5 py-2.5 flex items-center justify-between text-sm sticky top-0 z-10">
              <div className="font-bold text-sm">
                {isRenew ? "Renew Plan" : "Purchase / Upgrade Plan"} | User ID: {userId}
              </div>
              <div className="flex items-center gap-6 text-xs">
                <label className="flex items-center gap-1.5">
                  <input type="radio" checked={isRenew} readOnly className="w-3.5 h-3.5" />
                  <span>Renew</span>
                </label>
                <label className="flex items-center gap-1.5">
                  <input type="radio" checked={!isRenew} readOnly className="w-3.5 h-3.5" />
                  <span>Upgrade</span>
                </label>
              </div>
            </div>

            <div className="p-1 bg-gray-50 text-xs space-y-3.5 text-gray-700">
              <div className="grid grid-cols-2 gap-6">

                {/* LEFT COLUMN */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <label className="w-36 font-semibold">Current Plan :</label>
                    <select
                      className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
                      value={form.packageId}
                      onChange={(e) => handlePackageChange(e.target.value)}
                      disabled={isRenew}
                    >
                      <option value="">Select Package</option>
                      {packages.map((pkg) => (
                        <option key={pkg._id} value={pkg._id}>
                          {pkg.packageName}
                          {/* - ₹{pkg.customPrice}  */} 
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-36">MRP :</label>
                    <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100" value={selectedPackage?.customPrice || "0"} readOnly />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-36">Discount :</label>
                    <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100" value="0" readOnly />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-36">Refund Charge :</label>
                    <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100" value="0.0" readOnly />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-36">Wallet Balance :</label>
                    <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100 font-bold" value="-100.00" readOnly />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-36 font-bold ">Total Pay Amount :</label>
                    <input
                      type="text"
                      className="flex-1 border-2 border-gray-300 rounded px-3 py-1.5 bg-gray-100 font-bold "
                      value={form.amountPaid || "0.00"}
                      readOnly
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-36">CAF No :</label>
                    <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5" defaultValue="NIPL-0021013" />
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4" defaultChecked={isRenew} />
                    <span className="font-bold text-xs">Advance Renewal</span>
                    <input type="text" className="w-28 border border-gray-300 rounded px-2 py-1 bg-gray-200 text-center text-xs" value="03/01/2026" readOnly />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-36">Validity :</label>
                    <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100" value={`${selectedPackage?.validity?.number || ""} ${selectedPackage?.validity?.unit || ""}`} readOnly />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-36">Volume Quota :</label>
                    <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100" value="UNLIMITED" readOnly />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-36">Time Quota :</label>
                    <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100" value="UNLIMITED" readOnly />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-36">Old Plan Used :</label>
                    <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100" value="" readOnly />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-40">Sales Rep :</label>
                    <select className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-xs">
                      <option>Select Sales Representative</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-36">Remark :</label>
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-xs"
                      value={form.remark}
                      onChange={(e) => setForm({ ...form, remark: e.target.value })}
                      placeholder="Enter remark"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="border-t-2 border-gray-400 mt-4 pt-3.5 pb-2">
                <div className="text-center mb-2">
                  <span className="font-bold text-sm">Payment Received</span>
                  <div className="inline-flex gap-8 ml-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={form.paymentReceived === "Yes"}
                        onChange={() => setForm({ ...form, paymentReceived: "Yes", paymentAmount: form.amountPaid })}
                        className="w-4 h-4"
                      />
                      <span className="font-bold text-sm">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={form.paymentReceived === "No"}
                        onChange={() => setForm({ ...form, paymentReceived: "No" })}
                        className="w-4 h-4"
                      />
                      <span className="font-bold text-sm">No</span>
                    </label>
                  </div>
                </div>

                {form.paymentReceived === "Yes" && (
                  <div className="grid grid-cols-2 gap-5 max-w-4xl mx-auto text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Amount</span>
                      <input type="number" className="w-52 border border-gray-400 rounded px-3 py-1.5" value={form.paymentAmount} onChange={(e) => setForm({ ...form, paymentAmount: e.target.value })} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Payment Date</span>
                      <input type="date" className="w-52 border border-gray-400 rounded px-3 py-1.5" value={form.paymentDate} onChange={(e) => setForm({ ...form, paymentDate: e.target.value })} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Payment Mode</span>
                      <select className="w-52 border border-gray-400 rounded px-3 py-1.5" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
                        <option>Cash</option>
                        <option>UPI</option>
                        <option>Bank Transfer</option>
                        <option>Cheque</option>
                        <option>Online</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Remark</span>
                      <input type="text" className="w-52 border border-gray-400 rounded px-3 py-1.5" value={form.paymentRemark} onChange={(e) => setForm({ ...form, paymentRemark: e.target.value })} placeholder="e.g. Paid via GPay" />
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-300 my-2"></div>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold max-w-4xl mx-auto">
                  <div className="flex justify-between"><span>Total Payable</span><span className="text-gray-800">₹{form.amountPaid || "0.00"}</span></div>
                  <div className="flex justify-between"><span>Remaining</span><span className="text-gray-800">₹{form.paymentReceived === "Yes" ? (form.amountPaid - (parseFloat(form.paymentAmount) || 0)).toFixed(2) : form.amountPaid || "0.00"}</span></div>
                  <div className="flex justify-between"><span>Payment Received</span><span className="text-gray-800">₹{form.paymentReceived === "Yes" ? form.paymentAmount || "0.00" : "0.00"}</span></div>
                  <div className="flex justify-between"><span>Wallet After</span><span className="text-gray-800">₹{form.paymentReceived === "Yes" ? (-100 - (form.amountPaid - (parseFloat(form.paymentAmount) || 0))).toFixed(2) : (-100 - form.amountPaid).toFixed(2)}</span></div>
                </div>
              </div>

              {/* Buttons - Tight & Clean */}

              <div className="flex justify-center gap-2 py-2 border-t border-gray-300 -mt-3">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-8 rounded shadow transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1.5 px-8 rounded shadow transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserRechargePackage;