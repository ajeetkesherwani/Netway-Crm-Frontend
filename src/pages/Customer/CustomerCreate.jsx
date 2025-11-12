import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../service/user";
import { getRoles } from "../../service/role";
import { getRetailer } from "../../service/retailer";
import { getAllLco } from "../../service/lco";
import { toast } from "react-toastify";

export default function CreateUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [lcos, setLcos] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const nasOptions = [
    "Netway-103.255.235.3",
    "Netway-Tyagjibroadband",
    "Netway-Shivamnet",
    "Netway-Netwayinternet",
  ];

  const categoryOptions = ["Category1", "Category2", "Category3"];
  const initialFormData = {
    generalInformation: {
      title: "Mr",
      name: "",
      username: "",
      password: "",
      email: "",
      phone: "",
      roleId: "",
      telephone: "",
      cafNo: "",
      gst: "",
      adharNo: "",
      address: "",
      pincode: "",
      state: "",
      country: "India",
      district: "",
      retailerId: "",
      lcoId: "",
      paymentMethod: "Online",
    },
    networkInformation: {
      networkType: "PPPOE",
      ipType: "Static IP",
      statisIp: { nas: [], category: "" },
      dynamicIpPool: "",
    },
    additionalInformation: {
      dob: "",
      description: "",
      notification: false,
      addPlan: false,
      addCharges: true,
    },
    document: {
      documentType: "Other",
      documentDetails: "Pancard",
      documentImage: "",
    },
    status: false,
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getRoles();
        if (res.status && res.data) setRoles(res.data);
      } catch (err) {
        console.error("Failed to load roles:", err);
      }
    };
    const fetchRetailers = async () => {
      try {
        const res = await getRetailer();
        if (res.status && res.data) setRetailers(res.data);
      } catch (err) {
        console.error("Failed to load retailers:", err);
      }
    };
    const fetchLcos = async () => {
      try {
        const res = await getAllLco();
        if (res.status && res.data) setLcos(res.data);
      } catch (err) {
        console.error("Failed to load LCOs:", err);
      }
    };
    fetchRoles();
    fetchRetailers();
    fetchLcos();
  }, []);

  const handleChange = (e, section, key, nestedKey) => {
    const { value, type, checked, files } = e.target;
    if (nestedKey) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: {
            ...prev[section][key],
            [nestedKey]:
              type === "checkbox"
                ? checked
                : type === "file"
                ? files[0]
                : value,
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]:
            type === "checkbox" ? checked : type === "file" ? files[0] : value,
        },
      }));
    }

    // clear specific field error when user edits it
    setFormErrors((prev) => {
      if (!prev || !prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };
  const handleNasChange = (nasValue) => {
    setFormData((prev) => {
      let updatedNAS = [...prev.networkInformation.statisIp.nas];
      if (updatedNAS.includes(nasValue)) {
        updatedNAS = updatedNAS.filter((n) => n !== nasValue);
      } else {
        updatedNAS.push(nasValue);
      }
      return {
        ...prev,
        networkInformation: {
          ...prev.networkInformation,
          statisIp: { ...prev.networkInformation.statisIp, nas: updatedNAS },
        },
      };
    });
  };

  const validateForm = () => {
    const errors = {};
    const email = formData.generalInformation.email?.trim();
    const phone = formData.generalInformation.phone?.trim();

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Enter a valid email";
    }

    if (!phone) {
      errors.phone = "Mobile number is required";
    } else if (!/^\d{10,}$/.test(phone)) {
      errors.phone = "Enter a valid mobile number (min 10 digits)";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please correct the highlighted errors");
      setLoading(false);
      return;
    }

    try {
      await createUser(formData);
      toast.success("User created successfully ✅");
      navigate("/user/list");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create user ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setFormErrors({});
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Create User</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* General Information */}
        {[
          {
            label: "Title",
            key: "Title",
            type: "select",
            options: ["M/s", "Mr", "Ms", "Mrs", "Miss"],
          },
          { label: "Name", key: "name" },
          { label: "Username", key: "username" },
          { label: "Password", key: "password", type: "password" },
          { label: "Email *", key: "email", type: "email" },
          { label: "Phone *", key: "phone", type: "tel" },
          { label: "Telephone", key: "telephone" },
          { label: "CAF No", key: "cafNo" },
          { label: "GST", key: "gst" },
          { label: "Adhar No", key: "adharNo" },
          { label: "Address", key: "address" },
          { label: "Pincode", key: "pincode" },
          {
            label: "State",
            key: "state",
            type: "select",
            options: ["Maharashtra", "Delhi", "Haryana", "Uttar Pradesh"],
          },
          { label: "Country", key: "country" },
          { label: "District", key: "district" },
          {
            label: "Payment Method",
            key: "paymentMethod",
            type: "select",
            options: ["Cash", "Online"],
          },
          // { label: "Role", key: "roleId", type: "select", options: roles.map(r => ({ id: r._id, name: r.roleName })) },
          {
            label: "Reseller",
            key: "retailerId",
            type: "select",
            options: retailers.map((r) => ({
              id: r._id,
              name: r.resellerName,
            })),
          },
          {
            label: "LCO",
            key: "lcoId",
            type: "select",
            options: lcos.map((l) => ({ id: l._id, name: l.lcoName })),
          },
        ].map((field) => (
          <div key={field.key}>
            <label className="block font-medium">{field.label}</label>
            {field.type === "select" ? (
              <select
                value={formData.generalInformation[field.key] || ""}
                onChange={(e) =>
                  handleChange(e, "generalInformation", field.key)
                }
                className="border p-2 w-full rounded"
                required={field.key === "email" || field.key === "phone"}
              >
                <option value="">Select {field.label}</option>
                {field.options.map((opt, idx) =>
                  typeof opt === "object" ? (
                    <option key={idx} value={opt.id}>
                      {opt.name}
                    </option>
                  ) : (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  )
                )}
              </select>
            ) : (
              <>
                <input
                  type={field.type || "text"}
                  value={formData.generalInformation[field.key] || ""}
                  onChange={(e) =>
                    handleChange(e, "generalInformation", field.key)
                  }
                  className={`border p-2 w-full rounded ${
                    formErrors[field.key] ? "border-red-500" : ""
                  }`}
                  required={field.key === "email" || field.key === "phone"}
                />
                {formErrors[field.key] && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors[field.key]}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
        {/* Network Information */}
        {/* <div>
          <label className="block font-medium">Network Type</label>
          <select
            value={formData.networkInformation.networkType}
            onChange={(e) => handleChange(e, "networkInformation", "networkType")}
            className="border p-2 w-full rounded"
          >
            <option>PPPOE</option>
            <option>PPOE</option>
            <option>IP-Pass throw</option>
            <option>MAC_TAL</option>
          </select>
        </div> */}
        {/* 
        <div>
          <label className="block font-medium">IP Type</label>
          <select
            value={formData.networkInformation.ipType}
            onChange={(e) => handleChange(e, "networkInformation", "ipType")}
            className="border p-2 w-full rounded"
          >
            <option>Static IP</option>
            <option>Dynamic IP Pool</option>
          </select>
        </div>

        {formData.networkInformation.ipType === "Static IP" && (
          <div className="col-span-2">
            <label className="block font-medium mb-2">
              NAS (Multiple Select)
            </label>
            <div className="flex flex-col  gap-2 border rounded p-2 border-black">
              {nasOptions.map((nas) => (
                <label key={nas} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.networkInformation.statisIp.nas.includes(
                      nas
                    )}
                    onChange={() => handleNasChange(nas)}
                    className="h-4 w-4"
                  />
                  {nas}
                </label>
              ))}
            </div>
          </div>
        )}

        {formData.networkInformation.ipType === "Static IP" && (
          <div>
            <label className="block font-medium">Category</label>
            <select
              value={formData.networkInformation.statisIp.category}
              onChange={(e) =>
                handleChange(e, "networkInformation", "statisIp", "category")
              }
              className="border p-2 w-full rounded"
            >
              <option value="">Select Category</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}
        {formData.networkInformation.ipType === "Dynamic IP Pool" && (
          <div>
            <label className="block font-medium">Dynamic IP Pool</label>
            <input
              type="text"
              value={formData.networkInformation.dynamicIpPool}
              onChange={(e) =>
                handleChange(e, "networkInformation", "dynamicIpPool")
              }
              className="border p-2 w-full rounded"
            />
          </div>
        )} */}

        {/* Additional Information */}
        <div>
          <label className="block font-medium">DOB</label>
          <input
            type="datetime-local"
            value={formData.additionalInformation.dob}
            onChange={(e) => handleChange(e, "additionalInformation", "dob")}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <input
            type="text"
            value={formData.additionalInformation.description}
            onChange={(e) =>
              handleChange(e, "additionalInformation", "description")
            }
            className="border p-2 w-full rounded"
          />
        </div>

        {["notification", "addPlan", "addCharges"].map((key) => (
          <div key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.additionalInformation[key]}
              onChange={(e) => handleChange(e, "additionalInformation", key)}
            />
            <label>{key}</label>
          </div>
        ))}

        {/* Document */}
        {[
          {
            label: "Document Type",
            key: "documentType",
            options: [
              "ID proof",
              "Profile Id",
              "Adhar Card",
              "Insurence Paper",
              "Signature",
              "Other",
            ],
          },
          {
            label: "Document Details",
            key: "documentDetails",
            options: ["Licence", "Pancard", "Gst", "Address Proof", "Passport"],
          },
        ].map((field) => (
          <div key={field.key}>
            <label className="block font-medium">{field.label}</label>
            <select
              value={formData.document[field.key]}
              onChange={(e) => handleChange(e, "document", field.key)}
              className="border p-2 w-full rounded"
            >
              {field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div>
          <label className="block font-medium">Document Image</label>
          <input
            type="file"
            onChange={(e) => handleChange(e, "document", "documentImage")}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium">Status</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value === "true",
              }))
            }
            className="border p-2 w-full rounded"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate("/user/list")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
