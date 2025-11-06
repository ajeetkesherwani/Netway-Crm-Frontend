import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRetailerWalletDetails } from "../../../service/retailer";

export default function RetailerWalletView() {
  const { id, transactionId } = useParams(); // Retailer ID and transaction ID
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await getRetailerWalletDetails(id, transactionId);
        setTransaction(res.data?.history || res);
      } catch (err) {
        console.error("Error fetching transaction:", err);
        setError("Failed to load transaction details");
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [id, transactionId]);

  if (loading) return <p className="p-4">Loading transaction details...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!transaction) return <p className="p-4">Transaction not found.</p>;

  // Helper function to format field names
  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Helper function to render values
  const renderValue = (value, key) => {
    if (key.toLowerCase().includes("date") && value) {
      return new Date(value).toLocaleString();
    }
    return value || "N/A";
  };

  // Combine transaction and reseller fields
  const transactionFields = [
    { key: "transactionId", value: transaction._id },
    { key: "amount", value: transaction.amount },
    { key: "paymentDate", value: transaction.paymentDate },
    { key: "mode", value: transaction.mode },
    { key: "remark", value: transaction.remark },
    { key: "createdBy", value: transaction.createdBy },
    { key: "createdById", value: transaction.createdById },
    { key: "createdAt", value: transaction.createdAt },
    { key: "updatedAt", value: transaction.updatedAt },
  ];

  const resellerFields = transaction.reseller
    ? [
        { key: "resellerId", value: transaction.reseller._id },
        { key: "resellerName", value: transaction.reseller.resellerName },
        { key: "phoneNo", value: transaction.reseller.phoneNo },
        { key: "email", value: transaction.reseller.email },
        { key: "houseNo", value: transaction.reseller.houseNo },
        { key: "pincode", value: transaction.reseller.pincode },
        { key: "area", value: transaction.reseller.area },
        { key: "subArea", value: transaction.reseller.subArea },
        { key: "mobileNo", value: transaction.reseller.mobileNo },
        { key: "fax", value: transaction.reseller.fax },
        { key: "messengerId", value: transaction.reseller.messengerId },
        { key: "dob", value: transaction.reseller.dob },
        { key: "balance", value: transaction.reseller.balance },
        { key: "panNumber", value: transaction.reseller.panNumber },
        { key: "resellerCode", value: transaction.reseller.resellerCode },
        { key: "contactPersonNumber", value: transaction.reseller.contactPersonNumber },
        { key: "whatsAppNumber", value: transaction.reseller.whatsAppNumber },
        { key: "address", value: transaction.reseller.address },
        { key: "taluka", value: transaction.reseller.taluka },
        { key: "state", value: transaction.reseller.state },
        { key: "website", value: transaction.reseller.website },
        { key: "annversaryDate", value: transaction.reseller.annversaryDate },
        { key: "gstNo", value: transaction.reseller.gstNo },
        { key: "contactPersonName", value: transaction.reseller.contactPersonName },
        { key: "supportEmail", value: transaction.reseller.supportEmail },
        { key: "walletBalance", value: transaction.reseller.walletBalance },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Retailer Wallet Transaction Details</h2>
        <button
          onClick={() => navigate(`/retailer/wallet/list/${id}`)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {transactionFields.map(({ key, value }) => (
          <div key={key}>
            <label className="block font-medium">{formatLabel(key)}</label>
            <p className="border p-2 rounded bg-gray-100">{renderValue(value, key)}</p>
          </div>
        ))}
        {resellerFields.length > 0 && (
          <>
            <h3 className="col-span-2 text-lg font-semibold mt-4">Reseller Details</h3>
            {resellerFields.map(({ key, value }) => (
              <div key={key}>
                <label className="block font-medium">{formatLabel(key)}</label>
                <p className="border p-2 rounded bg-gray-100">{renderValue(value, key)}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}