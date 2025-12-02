import React, { useState } from "react";

const UserRechargePackage = () => {
  const [packages] = useState([
    { _id: "1", name: "AN-NEW 100 Mbps - 1M", price: 100 },
    { _id: "2", name: "AN-NEW 200 Mbps - 1M", price: 200 },
    { _id: "3", name: "AN-NEW 300 Mbps - 1M", price: 300 },
  ]);

  const [mode, setMode] = useState("renew");
  const [selectedPkg, setSelectedPkg] = useState("");
  const [mrp, setMrp] = useState("");
  const [discount, setDiscount] = useState("0");
  const [refund, setRefund] = useState("0");
  const [wallet, setWallet] = useState("-100.00");
  const [totalPay, setTotalPay] = useState("200.00");

  const [advanceRenew, setAdvanceRenew] = useState(true);
  const [renewDate, setRenewDate] = useState("2026-01-01");

  const [sales, setSales] = useState("");
  const [remark, setRemark] = useState("");

  const [paymentReceived, setPaymentReceived] = useState("no");
  const [amount, setAmount] = useState("0");
  const [paymentDate, setPaymentDate] = useState("2025-12-02");
  const [paymentMode, setPaymentMode] = useState("Cash");

  const handlePackage = (id) => {
    setSelectedPkg(id);
    const pkg = packages.find((p) => p._id === id);
    setMrp(pkg?.price || "");
    setTotalPay(pkg?.price || "");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">

      {/* HEADER */}
      <h2 className="text-center text-xl font-bold mb-3">
        Purchase / Renew Plan , User ID : <span className="font-bold">SACHINGX142036</span>
      </h2>

      {/* MODES */}
      <div className="flex justify-center gap-10 text-lg mb-2">
        <label className="flex items-center gap-2">
          <input type="radio" checked={mode === "renew"} onChange={() => setMode("renew")} />
          Renew
        </label>

        <label className="flex items-center gap-2">
          <input type="radio" checked={mode === "upgrade"} onChange={() => setMode("upgrade")} />
          Upgrade
        </label>
      </div>

      {/* MAIN BOX */}
      <div className="bg-white border border-gray-300 rounded-md p-6 max-w-5xl mx-auto">

        <div className="grid grid-cols-2 gap-6">

          {/* LEFT SIDE */}
          <div>
            <label className="font-semibold">Current Plan *</label>
            <select
              className="w-full border p-2 rounded mt-1 bg-gray-100"
              value={selectedPkg}
              onChange={(e) => handlePackage(e.target.value)}
            >
              <option value="">Select Plan</option>
              {packages.map((pkg) => (
                <option key={pkg._id} value={pkg._id}>
                  {pkg.name}
                </option>
              ))}
            </select>

            <label className="mt-3 block font-semibold">MRP :</label>
            <input className="w-full border p-2 rounded bg-gray-100" value={mrp} readOnly />

            <label className="mt-3 block font-semibold">Discount :</label>
            <input className="w-full border p-2 rounded" value={discount} onChange={(e) => setDiscount(e.target.value)} />

            <label className="mt-3 block font-semibold">Refund Charge :</label>
            <input className="w-full border p-2 rounded" value={refund} onChange={(e) => setRefund(e.target.value)} />

            <label className="mt-3 block font-semibold">Wallet Balance :</label>
            <input className="w-full border p-2 rounded bg-gray-100" value={wallet} readOnly />

            <label className="mt-3 block font-semibold">Total Pay Amount :</label>
            <input className="w-full border p-2 rounded bg-gray-100 font-bold" value={totalPay} readOnly />

            <label className="mt-3 block font-semibold">CAF No :</label>
            <input className="w-full border p-2 rounded bg-gray-100" value="NIPL-0021001" readOnly />
          </div>

          {/* RIGHT SIDE */}
          <div>
            <div className="flex items-center gap-3 mt-2">
              <input type="checkbox" checked={advanceRenew} onChange={() => setAdvanceRenew(!advanceRenew)} />
              <label className="font-semibold">Advance Renewal</label>

              <input
                type="date"
                className="border p-2 rounded ml-4"
                value={renewDate}
                onChange={(e) => setRenewDate(e.target.value)}
              />
            </div>

            <p className="mt-3"><b>Validity :</b> 1 Month</p>
            <p className="mt-1"><b>Volume Quota :</b> UNLIMITED</p>
            <p className="mt-1"><b>Time Quota :</b> UNLIMITED</p>
            <p className="mt-1"><b>Old Plan Used :</b> 0</p>

            <label className="mt-4 block font-semibold">Select Sales Representative :</label>
            <select className="w-full border p-2 rounded bg-gray-100">
              <option>Select Sales Representative</option>
              <option>Rahul Sharma</option>
              <option>Amit Singh</option>
            </select>

            <label className="mt-3 block font-semibold">Remark :</label>
            <textarea className="w-full border p-2 rounded h-20" value={remark} onChange={(e) => setRemark(e.target.value)} />
          </div>
        </div>

        {/* PAYMENT RECEIVED SECTION */}
        <hr className="my-6 border-gray-400" />

        <h3 className="text-center text-lg font-bold">Payment Received</h3>

        {/* RADIO BUTTONS */}
        <div className="flex justify-center gap-10 mt-3">
          <label className="flex items-center gap-2">
            <input type="radio" checked={paymentReceived === "yes"} onChange={() => setPaymentReceived("yes")} /> Yes
          </label>

          <label className="flex items-center gap-2">
            <input type="radio" checked={paymentReceived === "no"} onChange={() => setPaymentReceived("no")} /> No
          </label>
        </div>

        {/* SINGLE COLUMN PAYMENT INPUTS */}
        {paymentReceived === "yes" && (
          <div className="mt-4 w-1/2 mx-auto">

            <label className="font-semibold">Amount</label>
            <input
              type="number"
              className="w-full border p-2 rounded mb-3"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <label className="font-semibold">Payment Date</label>
            <input
              type="date"
              className="w-full border p-2 rounded mb-3"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />

            <label className="font-semibold">Payment Mode</label>
            <select
              className="w-full border p-2 rounded mb-3"
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
              className="w-full border p-2 rounded h-20"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            ></textarea>
          </div>
        )}

        {/* SUMMARY SECTION */}
        <div className="mt-6 text-sm">
          <p className="flex justify-between border-b py-1"><span>Total Payable Amount</span><span>{totalPay}</span></p>
          <p className="flex justify-between border-b py-1"><span>Payment Received</span><span>{paymentReceived === "yes" ? amount : "0"}</span></p>
          <p className="flex justify-between border-b py-1 font-bold text-black">
            <span>Remaining Payable Amount</span>
            <span>{paymentReceived === "yes" ? totalPay - amount : totalPay}</span>
          </p>
          <p className="flex justify-between py-1">
            <span>Wallet Balance After Purchase</span>
            <span>-200.00</span>
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-center gap-10 mt-6">
          <button className="px-10 py-2 rounded-full border border-gray-700 bg-gray-200 hover:bg-gray-300">
            Save
          </button>

          <button className="px-10 py-2 rounded-full border border-gray-700 bg-gray-300 hover:bg-gray-400">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserRechargePackage;
