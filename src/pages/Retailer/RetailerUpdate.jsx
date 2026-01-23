import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRetailerDetails, updateRetailer, getRetailer } from "../../service/retailer";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
  "Jammu and Kashmir", "Ladakh"
];

const API_BASE_URL = "http://localhost:5004";

export default function RetailerUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState(null);
  const [retailer, setRetailers] = useState(null);

  // useEffect(() => {
  //   const fetchRetailer = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await getRetailerDetails(id);
  //       if (res.data) {
  //         const r = res.data;

  //         setFormData({
  //           title: r.title || "Mr.",
  //           resellerName: r.resellerName || "",
  //           plainPassword: "",
  //           mobileNo: r.mobileNo?.toString() || "",
  //           phoneNo: r.phoneNo?.toString() || "",
  //           email: r.email || "",
  //           houseNo: r.houseNo || "",
  //           address: r.address || "",
  //           taluka: r.taluka || "",
  //           district: r.district || "",
  //           state: r.state || "",
  //           country: r.country || "India",
  //           pincode: r.pincode || "",
  //           area: r.area || "",
  //           subArea: r.subArea || "",
  //           website: r.website || "",
  //           gstNo: r.gstNo || "",
  //           panNumber: r.panNumber || "",
  //           resellerCode: r.resellerCode || "",
  //           balance: r.balance || r.walletBalance || "",
  //           contactPersonName: r.contactPersonName || "",
  //           contactPersonNumber: r.contactPersonNumber?.toString() || "",
  //           supportEmail: r.supportEmail || "",
  //           whatsAppNumber: r.whatsAppNumber?.toString() || "",
  //           description: r.description || "",
  //           status: r.status || "active",

  //           // Handle both string and array
  //           existingAadhaar: r.document?.aadhaarCard ? [r.document.aadhaarCard].flat() : [],
  //           existingPan: r.document?.panCard ? [r.document.panCard].flat() : [],
  //           existingLicense: r.document?.license ? [r.document.license].flat() : [],
  //           existingOther: r.document?.other ? [r.document.other].flat() : [],

  //           aadhaarCard: null,
  //           panCard: null,
  //           license: null,
  //           other: null,

  //           remove_aadhaarCard: false,
  //           remove_panCard: false,
  //           remove_license: false,
  //           remove_other: false,
  //         });
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   if (id) fetchRetailer();
  // }, [id]);

  useEffect(() => {
    const fetchRetailer = async () => {
      try {
        setLoading(true);
        const [retailerRes, retailerListRes] = await Promise.all([
          getRetailerDetails(id),   // single retailer
          getRetailer()             // list for dropdown if needed
        ]);

        if (retailerListRes?.status && retailerListRes.data) {
          setRetailers(retailerListRes.data);
        }

        if (retailerRes.data) {
          const retailer = retailerRes.data;

          const makeDocEntry = (fieldName, urlArray) => {
            if (!urlArray || urlArray.length === 0) return null;
            const url = urlArray[0];
            const cleanedPath = url.replace(/\\/g, '/');
            const fullUrl = `${API_BASE_URL}/${cleanedPath}`;

            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

            return {
              fieldName,
              existingUrl: fullUrl,
              preview: isImage ? fullUrl : null,
              name: url.split('/').pop(),
              isExisting: true,
              file: null
            };
          };

          const documents = [
            makeDocEntry("aadhaarCard", retailer.document?.aadhaarCard),
            makeDocEntry("panCard", retailer.document?.panCard),
            makeDocEntry("license", retailer.document?.license),
            makeDocEntry("other", retailer.document?.other),
          ].filter(Boolean);

          setFormData({
            title: retailer.title || "M/s",
            resellerName: retailer.resellerName || "",
            // password: "",               // usually not pre-filled
            houseNo: retailer.houseNo || "",
            address: retailer.address || "",
            taluka: retailer.taluka || "",
            district: retailer.district || "",
            state: retailer.state || "",
            country: retailer.country || "India",
            pincode: retailer.pincode || "",
            area: retailer.area || "",
            subArea: retailer.subArea || "",
            mobileNo: retailer.mobileNo?.toString() || "",
            phoneNo: retailer.phoneNo?.toString() || "",
            fax: retailer.fax || "",
            email: retailer.email || "",
            website: retailer.website || "",
            messengerId: retailer.messengerId || "",
            dob: retailer.dob || "",
            anniversaryDate: retailer.anniversaryDate || "",
            latitude: retailer.latitude || "",
            longitude: retailer.longitude || "",
            gstNo: retailer.gstNo || "",
            panNumber: retailer.panNumber || "",
            resellerCode: retailer.resellerCode || "",
            balance: retailer.balance || "",
            dashboard: retailer.dashboard || "Reseller",
            status: retailer.status || "active",
            contactPersonName: retailer.contactPersonName || "",
            contactPersonNumber: retailer.contactPersonNumber || "",
            supportEmail: retailer.supportEmail || "",
            whatsAppNumber: retailer.whatsAppNumber || "",
            description: retailer.description || "",

            // ── Important: use documents array ──
            documents,

            // Remove flags
            remove_aadhaarCard: false,
            remove_panCard: false,
            remove_license: false,
            remove_other: false,
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load retailer data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRetailer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // const handleFileChange = (e, field) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setFormData(prev => ({ ...prev, [field]: file }));
  //   }
  // };

  // const removeDocument = (field) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     [`existing${field.charAt(0).toUpperCase() + field.slice(1)}`]: [],
  //     [`remove_${field}`]: true,
  //     [field]: null
  //   }));
  // };

  useEffect(() => {
    return () => {
      formData?.documents?.forEach(doc => {
        if (doc.preview && !doc.isExisting) {
          URL.revokeObjectURL(doc.preview);
        }
      });
    };
  }, [formData?.documents]);

  const handleDocumentChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const preview = isImage ? URL.createObjectURL(file) : null;

    setFormData(prev => {
      const filtered = prev.documents.filter(d => d.fieldName !== fieldName);

      return {
        ...prev,
        documents: [
          ...filtered,
          {
            fieldName,
            file,
            preview,
            name: file.name,
            isExisting: false
          }
        ],
        [`remove_${fieldName}`]: false   // clear remove flag
      };
    });
  };

  const removeDocument = (fieldName) => {
    setFormData(prev => {
      const filteredDocs = prev.documents.filter(d => d.fieldName !== fieldName);

      return {
        ...prev,
        documents: filteredDocs,
        [`remove_${fieldName}`]: true
      };
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!formData) return;

  //   setLoading(true);
  //   const submitData = new FormData();

  //   Object.keys(formData).forEach(key => {
  //     if (key.startsWith("existing") || key.startsWith("remove_")) return;
  //     const value = formData[key];
  //     if (value === null || value === undefined || value === "") return;
  //     submitData.append(key, value);
  //   });

  //   if (formData.remove_aadhaarCard) submitData.append("remove_aadhaarCard", "true");
  //   if (formData.remove_panCard) submitData.append("remove_panCard", "true");
  //   if (formData.remove_license) submitData.append("remove_license", "true");
  //   if (formData.remove_other) submitData.append("remove_other", "true");

  //   try {
  //     await updateRetailer(id, submitData);
  //     navigate("/retailer/list");
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData) return;

  setLoading(true);
  const submitData = new FormData();

  // Append normal fields
  Object.keys(formData).forEach(key => {
    if (key === "documents" || key.startsWith("remove_")) return;
    const value = formData[key];
    if (value === null || value === undefined || value === "") return;
    submitData.append(key, value);
  });

  // New uploaded files
  formData.documents.forEach(doc => {
    if (doc.file) {
      submitData.append(doc.fieldName, doc.file);
    }
  });

  // Send remove flags only if really removing
  ["aadhaarCard", "panCard", "license", "other"].forEach(field => {
    if (formData[`remove_${field}`]) {
      submitData.append(`remove_${field}`, "true");
    }
  });

  try {
    await updateRetailer(id, submitData);   // ← make sure you have updateRetailer service
    toast.success("Retailer updated successfully");
    navigate(-1, { replace: true });
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to update retailer");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  if (loading) return <div className="p-10 text-center text-xl">Loading retailer details...</div>;
  if (!formData) return <div className="p-10 text-center text-red-600 text-xl">Retailer not found</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-8 text-blue-700">Update Retailer</h2>

      {/* Tabs */}
      <div className="flex border-b mb-8">
        <button
          className={`px-8 py-3 text-lg font-semibold ${activeTab === "general" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("general")}
        >
          General Information
        </button>
        <button
          className={`px-8 py-3 text-lg font-semibold ${activeTab === "document" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("document")}
        >
          Documents
        </button>
      </div>

      <form onSubmit={handleSubmit}>

        {/* GENERAL TAB - 100% SAME AS YOURS */}
        {activeTab === "general" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block font-semibold mb-1">Title</label><select name="title" value={formData.title} onChange={handleChange} className="w-full border rounded p-3"><option>Mr.</option><option>Ms</option><option>M/s</option><option>Mrs</option><option>Miss</option></select></div>
            <div><label className="block font-semibold mb-1">Reseller Name *</label><input type="text" name="resellerName" value={formData.resellerName} onChange={handleChange} required className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">Password</label><input type="password" name="plainPassword" value={formData.plainPassword} onChange={handleChange} placeholder="Leave blank to keep current" className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">Mobile No *</label><input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">Phone No</label><input type="text" name="phoneNo" value={formData.phoneNo} onChange={handleChange} className="w-full border rounded p-3" /></div>
            {/* <div><label className="block font-semibold mb-1">House No.</label><input type="text" name="houseNo" value={formData.houseNo} onChange={handleChange} className="w-full border rounded p-3" /></div> */}
            <div><label className="block font-semibold mb-1">Address</label><input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border rounded p-3" /></div>
            {/* <div><label className="block font-semibold mb-1">Taluka</label><input type="text" name="taluka" value={formData.taluka} onChange={handleChange} className="w-full border rounded p-3" /></div> */}
            <div><label className="block font-semibold mb-1">District</label><input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">State *</label>
              <select name="state" value={formData.state} onChange={handleChange} required className="w-full border rounded p-3">
                <option value="">Select State</option>
                {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><label className="block font-semibold mb-1">Pincode</label><input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">Area</label><input type="text" name="area" value={formData.area} onChange={handleChange} className="w-full border rounded p-3" /></div>
            {/* <div><label className="block font-semibold mb-1">Sub Area</label><input type="text" name="subArea" value={formData.subArea} onChange={handleChange} className="w-full border rounded p-3" /></div> */}
            <div><label className="block font-semibold mb-1">Website</label><input type="text" name="website" value={formData.website} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">GST No</label><input type="text" name="gstNo" value={formData.gstNo} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">PAN Number</label><input type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} className="w-full border rounded p-3" /></div>
            {/* <div><label className="block font-semibold mb-1">Reseller Code</label><input type="text" name="resellerCode" value={formData.resellerCode} onChange={handleChange} className="w-full border rounded p-3" /></div> */}
            <div><label className="block font-semibold mb-1">Balance</label><input type="text" name="balance" value={formData.balance} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">Contact Person Name</label><input type="text" name="contactPersonName" value={formData.contactPersonName} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">Contact Person Number</label><input type="text" name="contactPersonNumber" value={formData.contactPersonNumber} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">Support Email</label><input type="email" name="supportEmail" value={formData.supportEmail} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">WhatsApp Number</label><input type="text" name="whatsAppNumber" value={formData.whatsAppNumber} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded p-3">
                <option value="active">Active</option>
                <option value="inActive">Inactive</option>
              </select>
            </div>
            <div className="col-span-2"><label className="block font-semibold mb-1">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full border rounded p-3"></textarea></div>
          </div>
        )}

        {/* DOCUMENT TAB - SAME UI + REMOVE BUTTON ONLY */}
        {/* {activeTab === "document" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            
            <div className="bg-gray-50 p-6 rounded-lg border">
              <label className="block font-bold text-lg mb-3">Aadhaar Card</label>
              {formData.existingAadhaar.length > 0 && !formData.remove_aadhaarCard && (
                <div className="mb-4 p-3 bg-white rounded border text-sm text-gray-700 flex justify-between items-center">
                  <span>{formData.existingAadhaar[0].split('/').pop()}</span>
                  <button type="button" onClick={() => removeDocument("aadhaarCard")} className="ml-4 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">Remove</button>
                </div>
              )}
              <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, "aadhaarCard")} className="w-full p-3 border rounded" />
              <small className="text-gray-600">Upload new to replace</small>
            </div>

 
             <div className="bg-gray-50 p-6 rounded-lg border">
              <label className="block font-bold text-lg mb-3">PAN Card</label>
              {formData.existingPan.length > 0 && !formData.remove_panCard && (
                <div className="mb-4 p-3 bg-white rounded border text-sm text-gray-700 flex justify-between items-center">
                  <span>{formData.existingPan[0].split('/').pop()}</span>
                  <button type="button" onClick={() => removeDocument("panCard")} className="ml-4 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">Remove</button>
                </div>
              )}
              <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, "panCard")} className="w-full p-3 border rounded" />
            </div>

           
            <div className="bg-gray-50 p-6 rounded-lg border">
              <label className="block font-bold text-lg mb-3">License</label>
              {formData.existingLicense.length > 0 && !formData.remove_license && (
                <div className="mb-4 p-3 bg-white rounded border text-sm text-gray-700 flex justify-between items-center">
                  <span>{formData.existingLicense[0].split('/').pop()}</span>
                  <button type="button" onClick={() => removeDocument("license")} className="ml-4 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">Remove</button>
                </div>
              )}
              <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, "license")} className="w-full p-3 border rounded" />
            </div>

           
            <div className="bg-gray-50 p-6 rounded-lg border">
              <label className="block font-bold text-lg mb-3">Other Document</label>
              {formData.existingOther.length > 0 && !formData.remove_other && (
                <div className="mb-4 p-3 bg-white rounded border text-sm text-gray-700 flex justify-between items-center">
                  <span>{formData.existingOther[0].split('/').pop()}</span>
                  <button type="button" onClick={() => removeDocument("other")} className="ml-4 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">Remove</button>
                </div>
              )}
              <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, "other")} className="w-full p-3 border rounded" />
            </div>

          </div>
        )} */}
        {activeTab === "document" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Aadhaar Card", field: "aadhaarCard" },
              { label: "PAN Card", field: "panCard" },
              { label: "License", field: "license" },
              { label: "Other Document", field: "other" },
            ].map(({ label, field }) => {
              const doc = formData.documents.find(d => d.fieldName === field);

              const hasExisting = doc?.isExisting && doc.existingUrl && !formData[`remove_${field}`];
              const hasNewFile = doc && !doc.isExisting;

              return (
                <div key={field} className="border rounded-lg p-5 bg-gray-50 shadow-sm">
                  <label className="block font-bold text-lg mb-3">{label}</label>

                  {/* Preview section */}
                  {doc && (
                    <div className="mb-4">
                      {hasExisting && (
                        <div>
                          <p className="text-sm text-gray-700 mb-2">
                            Current file: <strong>{doc.name}</strong>
                          </p>
                          {doc.preview ? (
                            <img
                              src={doc.existingUrl}
                              alt={`${label} preview`}
                              className="max-w-full h-40 object-contain border rounded shadow"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <p className="text-sm text-gray-500 italic">
                              {doc.name} (non-image document)
                            </p>
                          )}
                        </div>
                      )}

                      {hasNewFile && (
                        <div>
                          <p className="text-sm text-green-700 mb-2">
                            New file selected: <strong>{doc.name}</strong>
                          </p>
                          {doc.preview ? (
                            <img
                              src={doc.preview}
                              alt="New preview"
                              className="max-w-full h-40 object-contain border rounded shadow"
                            />
                          ) : (
                            <p className="text-sm text-gray-500 italic">
                              Preview not available
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* File input */}
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleDocumentChange(e, field)}
                    className="w-full p-3 border rounded cursor-pointer bg-white"
                  />

                  {/* Remove / Clear button */}
                  {(hasExisting || hasNewFile) && (
                    <button
                      type="button"
                      onClick={() => removeDocument(field)}
                      className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Remove / Clear
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end gap-4 mt-10 pt-6 border-t">
          <button type="button" onClick={() => navigate("/retailer/list")} className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Back
          </button>
          <button type="submit" disabled={loading} className="px-10 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-60">
            {loading ? "Updating..." : "Update Retailer"}
          </button>
        </div>
      </form>
    </div>
  );
}