import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, getAllZoneList, getLcoByRetailer, getPackagesByRole } from "../../service/user";
import { getRoles } from "../../service/role";
import { getRetailer } from "../../service/retailer";
import { getAllLco } from "../../service/lco";
import { toast } from "react-toastify";
import { getStaffList } from "../../service/ticket";
// import { getAllPackageList } from "../../service/package";
import { assignPackageToUser } from "../../service/userPackage";
import DatePicker from "react-datepicker";
import { characterValidate } from "../../validations/characterValidate";
import { emailValidate } from "../../validations/emailValidate";
import { mobileValidate } from "../../validations/mobileValidate";
import { checkAlternateSameAsMobile } from "../../validations/validateAlternateMobile";
import { pincodeValidate } from "../../validations/pincodeValidate";
import { cityValidate } from "../../validations/cityValidate";
import { stateValidate } from "../../validations/stateValidate";
import { getSubzonesWithZoneId } from "../../service/apiClient";
import { getAllSubZones } from "../../service/apiClient";

import "react-datepicker/dist/react-datepicker.css";


export default function CreateUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ================== FIX 1: MISSING STATE ==================
  const [areas, setAreas] = useState([]);

  // reference data
  const [roles, setRoles] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [lcos, setLcos] = useState([]);
  const [staff, setStaff] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [subZoneList, setSubZoneList] = useState([]);

  const [selectedArea, setSelectedArea] = useState("");
  const [selectedSubZone, setSelectedSubZone] = useState("");

  const [selectedCreatedFor, setSelectedCreatedFor] = useState("Admin");
  const [selectedRetailerForLco, setSelectedRetailerForLco] = useState("");
  const [selectedLco, setSelectedLco] = useState("");
  const [lcosForSelectedRetailer, setLcosForSelectedRetailer] = useState([]);

  const [roleSpecificPackages, setRoleSpecificPackages] = useState([]);
  const [packageLoading, setPackageLoading] = useState(false);
  const [customPackagePrice, setCustomPackagePrice] = useState("");

  const [formErrors, setFormErrors] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [installerSearch, setInstallerSearch] = useState("");
  const [isDefaultInstaller, setIsDefaultInstaller] = useState(false);
  const [packageSearch, setPackageSearch] = useState("");
  const [showPackageDropdown, setShowPackageDropdown] = useState(false);

  const connectionTypes = ["ILL", "FTTH", "RF", "OTHER"];
  const filteredStaff = staff.filter((s) => {
    const name = s.staffName || s.name || "";
    return name.toLowerCase().includes(installerSearch.toLowerCase());
  });
  const paymentModes = ["Cash", "Online", "NEFT", "Cheque"];
  const networkTypes = ["PPPOE", "PPOE", "IP-Pass throw", "MAC_TAL", "ILL"];
  const ipTypes = ["Static IP", "Dynamic IP Pool"];
  const CustomeripTypes = ["static", "dynamic"];
  const serviceOpted = ["intercom", "broadband", "corporate"];

  // ================== FORM DATA ==================
  const initialForm = {
    customer: {
      title: "Mr",
      name: "",
      billingName: "",
      differentBillingName: false,
      username: "",
      UserId: "",
      password: "",
      email: "",
      mobile: "",
      alternateMobile: "",
      gender: "Male",
      aadharNo: "",
      panCard: "",
      accountId: "",
      registrationDate: new Date().toISOString().slice(0, 10),
      roleId: "",
      retailerId: "",
      lcoId: "",
      selsExecutive: "",
      installationBy: [],
      installationByName: "",
      serialNo: "",
      macId: "",
      serviceOpted: "",
      connectionType: "",
      ipAddress: "",
      ipType: "Static IP",
      dynamicIpPool: "",
      customArea: "",
      nas: [],
      stbNo: "",
      vcNo: "",
      circuitId: "",
      createdFor: { id: "", type: "Admin" },
      packageDetails: {
        packageId: "",
        packageName: "",
        packageAmount: "",
        packageStart: "",
        packageEnd: "",
      },
      packages: [],
    },
    addresses: {
      billing: { addressLine1: "", addressLine2: "", state: "", city: "", pincode: "", area: "" },
      permanent: { addressLine1: "", addressLine2: "", state: "", city: "", pincode: "", area: "" },
      installation: {
        sameAsBilling: true,
        addressLine1: "",
        addressLine2: "",
        state: "",
        city: "",
        pincode: "",
        area: "",
      },
    },
    payment: {
      paymentMode: "Online",
      invoiceNo: "",
      paymentRef: "",
      amount: "",
      paymentDate: new Date().toISOString().slice(0, 10),
      rechargeThresholdLimit: 0,
    },
    documents: [],
    additional: { dob: "", description: "", aadharPermanentAddress: "", ekYC: false, status: true },
  };

  const [formData, setFormData] = useState(initialForm);

  // ================== RESELLER → LCO FLOW ==================
  const handleRetailerForLcoChange = async (retailerId) => {
    setSelectedRetailerForLco(retailerId);
    setSelectedLco("");
    setLcosForSelectedRetailer([]);

    // update createdFor → reseller id
    setFieldValue("customer.createdFor.id", retailerId);

    if (!retailerId) return;

    try {
      const res = await getLcoByRetailer(retailerId);
      if (res?.status) {
        setLcosForSelectedRetailer(res.data || []);
      }
    } catch (err) {
      setLcosForSelectedRetailer([]);
    }
  };

  const handleLcoChange = (lcoId) => {
    setSelectedLco(lcoId);

    // update createdFor → lco id
    setFormData((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        createdFor: {
          type: "Lco",
          id: lcoId,
        },
      },
    }));
  };


  // ================== GENERIC SET FIELD VALUE (REQUIRED FIX) ==================
  const setFieldValue = (path, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let current = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  // ================== HANDLE INPUT CHANGE ==================
  const handleChange = (e, path) => {
    let value =
      e?.target?.type === "checkbox"
        ? e.target.checked
        : e?.target?.value;

    // Validation for mobile and alternateMobile: only numbers, max 10 digits
    if (path === "customer.mobile") {
      value = value.replace(/[^0-9]/g, "");
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
    }

    setFieldValue(path, value);
  };


  // ================== FETCH STATIC DATA ==================
  useEffect(() => {
    (async () => {
      try {
        const [
          rolesRes,
          retailerRes,
          lcoRes,
          staffRes,
          zoneRes,
          subZoneRes,
        ] = await Promise.allSettled([
          getRoles(),
          getRetailer(),
          getAllLco(),
          getStaffList?.(),
          getAllZoneList(),
          getAllSubZones(),
        ]);

        if (rolesRes.value?.status) setRoles(rolesRes.value.data || []);
        if (retailerRes.value?.status) setRetailers(retailerRes.value.data || []);
        if (lcoRes.value?.status) setLcos(lcoRes.value.data || []);
        if (staffRes.value?.status) setStaff(staffRes.value.data || []);
        if (zoneRes.value?.status) setZoneList(zoneRes.value.data || []);
        if (subZoneRes.value?.status) setSubZoneList(subZoneRes.value.data || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // ================== FIX 2: PACKAGE FETCH LOGIC ==================
  const fetchPackagesForRole = async () => {
    const type = formData.customer.createdFor.type || "Admin";
    const targetId = formData.customer.createdFor.id || "";

    // If Reseller / LCO but ID not selected yet
    if ((type === "Reseller" || type === "Lco") && !targetId) {
      setRoleSpecificPackages([]);
      return;
    }

    setPackageLoading(true);
    try {
      const res = await getPackagesByRole({
        targetRole: type,
        targetId,
      });

      if (res?.status) {
        // ✅ SAME RESPONSE FOR ALL ROLES
        setRoleSpecificPackages(res.data?.packages || []);
      } else {
        setRoleSpecificPackages([]);
      }
    } catch (err) {
      setRoleSpecificPackages([]);
    } finally {
      setPackageLoading(false);
    }
  };

  // ================== FIX 3: AUTO REFRESH ==================
  useEffect(() => {
    fetchPackagesForRole();
  }, [
    formData.customer.createdFor.type,
    formData.customer.createdFor.id,
  ]);

  // ================== CREATED FOR CHANGE (FIX) ==================
  const handleCreatedForChange = (type) => {
    // 1️⃣ Update UI dropdown state
    setSelectedCreatedFor(type);

    // 2️⃣ Reset dependent selections
    setSelectedRetailerForLco("");
    setSelectedLco("");

    // 3️⃣ Clear packages & price
    setRoleSpecificPackages([]);
    setCustomPackagePrice("");

    // 4️⃣ Update formData safely
    setFormData((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        createdFor: {
          type: type, // Admin | Retailer | Lco
          id: "",     // reset ID, will be set after selection
        },
        packageDetails: {
          packageId: "",
          packageName: "",
          packageAmount: "",
          packageStart: "",
          packageEnd: "",
        },
      },
    }));
  };


  // ================== PACKAGE SELECT ==================
  // ================== MULTI-PACKAGE HANDLERS ==================
  const handleAddPackage = (id, overridePrice) => {
    const pkg = roleSpecificPackages.find((p) => p._id === id);
    if (!pkg) return;

    const current = formData.customer.packages || [];
    if (current.some((p) => p.packageId === pkg._id)) {
      toast.info("Package already selected");
      setShowPackageDropdown(false);
      return;
    }

    const price =
      overridePrice !== undefined && overridePrice !== ""
        ? overridePrice
        : (pkg.price || pkg.basePrice || 0);

    const newPkg = {
      packageId: pkg._id,
      packageName: pkg.name,
      packageAmount: String(price),
      originalPrice: pkg.price || pkg.basePrice || 0,
      validity: pkg.validity,
    };

    const updated = [...current, newPkg];
    setFormData((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        packages: updated,
        packageDetails: updated[0] || {
          packageId: "",
          packageName: "",
          packageAmount: "",
        },
      },
    }));

    setFormErrors((prev) => ({
      ...prev,
      packages: undefined,
    }));
    setShowPackageDropdown(false);
    setPackageSearch("");
  };

  const handleUpdatePackagePrice = (packageId, newPrice) => {
    setFormData((prev) => {
      const updated = (prev.customer.packages || []).map((p) =>
        p.packageId === packageId ? { ...p, packageAmount: newPrice } : p
      );
      return {
        ...prev,
        customer: {
          ...prev.customer,
          packages: updated,
          packageDetails: updated[0] || prev.customer.packageDetails,
        },
      };
    });
  };

  const handleRemovePackage = (packageId) => {
    const current = formData.customer.packages || [];
    if (current.length <= 1) {
      toast.warning("At least one package is mandatory");
      return;
    }
    const updated = current.filter((p) => p.packageId !== packageId);
    setFormData((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        packages: updated,
        packageDetails: updated[0] || {
          packageId: "",
          packageName: "",
          packageAmount: "",
        },
      },
    }));
  };

  const handlePackageChange = handleAddPackage;

  // ================== SUBMIT ==================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    // 1. Name
    if (!formData.customer.name?.trim()) {
      errors["customer.name"] = "Name is required";
    }

    // 2. User ID
    if (!formData.customer.UserId?.trim()) {
      errors["customer.UserId"] = "User ID is required";
    }

    // 3. Email
    if (!formData.customer.email?.trim()) {
      errors["customer.email"] = "Email is required";
    }

    // 4. Mobile No
    if (!formData.customer.mobile?.trim()) {
      errors["customer.mobile"] = "Mobile Number is required";
    } else if (formData.customer.mobile.trim().length !== 10) {
      errors["customer.mobile"] = "Mobile Number must be 10 digits";
    }

    // 5. Password
    if (!formData.customer.password?.trim()) {
      errors["customer.password"] = "Password is required";
    }

    // 6. Date of Birth
    if (!formData.additional.dob?.trim()) {
      errors["additional.dob"] = "Date of Birth is required";
    }

    // 7. Connection Type
    if (!formData.customer.connectionType?.trim()) {
      errors["customer.connectionType"] = "Connection Type is required";
    }

    // 8. Installation By
    const hasInstaller =
      (Array.isArray(formData.customer.installationBy) && formData.customer.installationBy.length > 0) ||
      Boolean(formData.customer.installationByName?.trim()) ||
      Boolean(isDefaultInstaller);
    if (!hasInstaller) {
      errors.installationBy = "Installation By is required";
      errors["customer.installationBy"] = "Installation By is required";
    }

    // 9. Service Opted
    if (!formData.customer.serviceOpted?.trim()) {
      errors["customer.serviceOpted"] = "Service Opted is required";
    }

    // 10, 11, 12, 13. Address Line 1, City, State, Pincode
    if (!formData.addresses.billing.addressLine1?.trim()) {
      errors["addresses.billing.addressLine1"] = "Address Line 1 is required";
    }
    if (!formData.addresses.billing.city?.trim()) {
      errors["addresses.billing.city"] = "City is required";
    }
    if (!formData.addresses.billing.state?.trim()) {
      errors["addresses.billing.state"] = "State is required";
    }
    if (!formData.addresses.billing.pincode?.trim()) {
      errors["addresses.billing.pincode"] = "Pincode is required";
    }

    // 14. Area
    if (!selectedArea) {
      errors["area"] = "Area is required";
      errors["zone"] = "Area is required";
    }

    // 15. Zone
    if (!selectedSubZone) {
      errors["subZone"] = "Zone is required";
      errors["customer.subZoneId"] = "Zone is required";
    }

    // 16. Select Package
    if (!formData.customer.packages || formData.customer.packages.length === 0) {
      errors["packages"] = "At least one package is mandatory";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return;
    }
    setFormErrors({});
    try {
      const payload = new FormData();
      payload.append("customer", JSON.stringify(formData.customer));
      payload.append("addresses", JSON.stringify(formData.addresses));
      payload.append("payment", JSON.stringify(formData.payment));
      payload.append("additional", JSON.stringify(formData.additional));
      payload.append("area", selectedArea);
      payload.append("subZone", selectedSubZone);

      formData.documents.forEach((doc) => {
        if (doc.file && doc.type) {
          payload.append("documents", doc.file);
          payload.append("documentTypes[]", doc.type);
        }
      });

      await createUser(payload);
      toast.success("Customer created successfully");
      navigate("/user/list");
    } catch (err) {
      toast.error("Failed to create customer");
    }
  };


  const documentTypes = [
    "Address Proof",
    "Profile Photo",
    "Addhar Card",
    "Passport",
    "Signature",
    "Pan Card",
    "Driving Licence",
    "GST",
    "Caf Form",
    "Other",
  ];

  const handleClear = () => {
    setFormData({
      ...initialForm,
      customer: {
        ...initialForm.customer,
        createdFor: {
          type: "Admin",
          id: adminId,
        },
      },
    });

    setFormErrors({});
    setInstallerSearch("");
    setIsDefaultInstaller(false);
    setSelectedCreatedFor("Admin");
    setSelectedRetailerForLco("");
    setSelectedLco("");
    setSelectedArea("");
    setSelectedSubZone("");
    setCustomPackagePrice("");
  };


  // const handleClear = () => {
  //   setFormData(initialForm);
  //   setFormErrors({});
  //   setSelectedArea("");
  //   setCustomPackagePrice("");
  // };

  const addDocumentRow = () =>
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, { type: "", file: null, preview: "" }], // ← add preview: ""
    }));

  const updateDocumentType = (i, v) =>
    setFormData((prev) => {
      const d = [...prev.documents];
      d[i].type = v;
      return { ...prev, documents: d };
    });
  const updateDocumentFile = (i, f) => {
    if (!f) return;

    // Create preview only for images
    const isImage = f.type.startsWith("image/");
    const preview = isImage ? URL.createObjectURL(f) : "";

    setFormData((prev) => {
      const d = [...prev.documents];
      d[i] = {
        ...d[i],
        file: f,
        preview: preview,
      };
      return { ...prev, documents: d };
    });
  };

  const removeDocumentRow = (i) =>
    setFormData((prev) => {
      const d = [...prev.documents];

      // Clean up old preview URL to prevent memory leak
      if (d[i]?.preview) {
        URL.revokeObjectURL(d[i].preview);
      }

      return {
        ...prev,
        documents: d.filter((_, idx) => idx !== i),
      };
    });

  // ================== FILTERED PACKAGES (SEARCH) ==================
  const filteredPackages = roleSpecificPackages.filter((pkg) =>
    pkg?.name?.toLowerCase().includes(packageSearch.toLowerCase())
  );

  useEffect(() => {
    setPackageSearch("");
  }, [
    formData.customer.createdFor.type,
    formData.customer.createdFor.id,
  ]);

  // ================== UI (UNCHANGED) ==================
  return (
    <div className="max-w-[1400px] mx-auto p-4 bg-white shadow rounded">
      <h1 className="text-xl font-semibold mb-4">Create Customer</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ---------------- Customer Details (top area) ---------------- */}
        <section className="border rounded">
          <div className="bg-blue-800 text-white px-4 py-2 font-semibold">
            Customer Details
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* column layout inspired by screenshot: 4 columns */}
            <div>
              <label className="block text-sm font-medium">Title</label>
              <select
                value={formData.customer.title}
                onChange={(e) => handleChange(e, "customer.title")}
                className="mt-1 p-2 border rounded w-full"
              >
                <option>Mr</option>
                <option>Mrs</option>
                <option>Ms</option>
                <option>M/s</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Name <span className="text-red-500">*</span></label>
              <input
                value={formData.customer.name}
                onChange={(e) => handleChange(e, "customer.name")}
                className={`mt-1 p-2 border rounded w-full ${formErrors["customer.name"] ? "border-red-500" : ""
                  }`}
                placeholder="Name"
              />
              {formErrors["customer.name"] && (
                <p className="text-red-500 text-sm">
                  {formErrors["customer.name"]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Billing Name</label>
              <input
                value={formData.customer.billingName}
                onChange={(e) => handleChange(e, "customer.billingName")}
                className="mt-1 p-2 border rounded w-full bg-gray-50"
                placeholder="Billing Name"
              />
              <label className="inline-flex items-center mt-1 text-sm">
                <input
                  type="checkbox"
                  checked={formData.customer.differentBillingName}
                  onChange={(e) =>
                    handleChange(e, "customer.differentBillingName")
                  }
                  className="mr-2"
                />
                Different From Name
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={formData.customer.email}
                onChange={(e) => handleChange(e, "customer.email")}
                className={`mt-1 p-2 border rounded w-full ${formErrors["customer.email"] ? "border-red-500" : ""
                  }`}
                placeholder="Email"
              />
              {formErrors["customer.email"] && (
                <p className="text-red-500 text-sm">
                  {formErrors["customer.email"]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">User ID <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.customer.UserId}
                onChange={(e) => handleChange(e, "customer.UserId")}
                className={`mt-1 p-2 border rounded w-full ${formErrors["customer.UserId"] ? "border-red-500" : ""
                  }`}
                placeholder="User ID"
              />
              {formErrors["customer.UserId"] && (
                <p className="text-red-500 text-sm">
                  {formErrors["customer.UserId"]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Password <span className="text-red-500">*</span></label>
              <input
                type="password"
                value={formData.customer.password}
                onChange={(e) => handleChange(e, "customer.password")}
                className={`mt-1 p-2 border rounded w-full ${formErrors["customer.password"] ? "border-red-500" : ""
                  }`}
                placeholder="Password"
              />
              {formErrors["customer.password"] && (
                <p className="text-red-500 text-sm">
                  {formErrors["customer.password"]}
                </p>
              )}
            </div>


            <div>
              <label className="block text-sm font-medium">Gender</label>
              <select
                value={formData.customer.gender || "Male"}
                onChange={(e) => handleChange(e, "customer.gender")}
                className="mt-1 p-2 border rounded w-full"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* dob */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DatePicker
                  selected={
                    formData.additional.dob
                      ? new Date(formData.additional.dob)
                      : null
                  }
                  onChange={(date) => {
                    const formatted = date
                      ? date.toISOString().split("T")[0]
                      : "";
                    setFieldValue("additional.dob", formatted);
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="dd/mm/yyyy"
                  className="mt-1 p-3 pr-12 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition cursor-pointer text-base"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  maxDate={new Date()}
                  yearDropdownItemNumber={80}
                  scrollableYearDropdown
                  popperPlacement="bottom-start"
                  // This allows clicking the icon to open calendar
                  onClickOutside={() => { }}
                  // Ensures calendar opens on icon click
                  showPopperArrow={false}
                />
                {formErrors["additional.dob"] && (
                  <p className="text-red-500 text-sm mt-1">{formErrors["additional.dob"]}</p>
                )}

                {/* Calendar Icon Inside Input - Clickable */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Trigger the DatePicker to open
                      document
                        .querySelector(
                          ".react-datepicker__input-container input"
                        )
                        ?.focus();
                    }}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Mobile No <span className="text-red-500">*</span></label>
              <input
                value={formData.customer.mobile}
                onChange={(e) => handleChange(e, "customer.mobile")}
                className={`mt-1 p-2 border rounded w-full ${formErrors["customer.mobile"] ? "border-red-500" : ""
                  }`}
                placeholder="Mobile Number"
              />
              {formErrors["customer.mobile"] && (
                <p className="text-red-500 text-sm">
                  {formErrors["customer.mobile"]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Alternate Number
              </label>
              <input
                value={formData.customer.alternateMobile}
                onChange={(e) => handleChange(e, "customer.alternateMobile")}
                className={`mt-1 p-2 border rounded w-full ${formErrors["customer.alternateMobile"] ? "border-red-500" : ""
                  }`}
                placeholder="Alternate Mobile"
              />
              {formErrors["customer.alternateMobile"] && (
                <p className="text-red-500 text-sm">
                  {formErrors["customer.alternateMobile"]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                {/* Account Id (IPACCT Id) */}
                IPACCT ID/H8
              </label>
              <input
                value={formData.customer.accountId}
                onChange={(e) => handleChange(e, "customer.accountId")}
                className="mt-1 p-2 border rounded w-full"
                placeholder="Account Id / IPACCT"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Connection Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.customer.connectionType}
                onChange={(e) => {
                  handleChange(e, "customer.connectionType");
                  if (e.target.value) {
                    setFormErrors((prev) => ({
                      ...prev,
                      "customer.connectionType": undefined,
                    }));
                  }
                }}
                required
                className={`mt-1 p-2 border rounded w-full ${formErrors["customer.connectionType"] ? "border-red-500" : ""
                  }`}
              >
                <option value="">Select Connection Type</option>
                {connectionTypes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {formErrors["customer.connectionType"] && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors["customer.connectionType"]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Sales Executive
              </label>
              <select
                value={formData.customer.selsExecutive}
                onChange={(e) => handleChange(e, "customer.selsExecutive")}
                className="mt-1 p-2 border rounded w-full"
              >
                <option value="">Select Staff</option>
                {staff.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.staffName}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Installation By <span className="text-red-500">*</span>
              </label>

              {/* CLEAN & MINIMAL MULTI-SELECT DROPDOWN */}
              <div className="relative">
                <div
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="w-full p-3 border rounded-lg cursor-pointer bg-white hover:border-blue-500 transition flex justify-between items-center min-h-[42px]"
                >
                  <div className="flex flex-wrap gap-2">
                    {(isDefaultInstaller || formData.customer.installationByName) && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md">
                        Default {formData.customer.installationByName ? `(${formData.customer.installationByName})` : ""}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDefaultInstaller(false);
                            setFieldValue("customer.installationByName", "");
                          }}
                          className="ml-1 hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {formData.customer.installationBy?.length > 0 &&
                      formData.customer.installationBy.map((id) => {
                        const person = staff.find((s) => s._id === id);
                        return person ? (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md"
                          >
                            {person.staffName || person.name}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated =
                                  formData.customer.installationBy.filter(
                                    (x) => x !== id
                                  );
                                setFieldValue(
                                  "customer.installationBy",
                                  updated
                                );
                              }}
                              className="ml-1 hover:text-blue-900"
                            >
                              ×
                            </button>
                          </span>
                        ) : null;
                      })}
                    {!isDefaultInstaller &&
                      !formData.customer.installationByName &&
                      (!formData.customer.installationBy || formData.customer.installationBy.length === 0) && (
                        <span className="text-gray-500 text-sm">
                          Select installer(s)
                        </span>
                      )}
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${showDropdown ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {/* Dropdown Options */}
                {showDropdown && (
                  <>
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {/* Search box inside dropdown */}
                      <div className="p-2 border-b bg-gray-50 sticky top-0 z-10">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search staff by name..."
                            value={installerSearch}
                            onChange={(e) => setInstallerSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                          <svg
                            className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                          {installerSearch && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setInstallerSearch("");
                              }}
                              className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 text-xs"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Default option */}
                      {(!installerSearch || "default".includes(installerSearch.toLowerCase())) && (
                        <label
                          className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition border-b border-gray-100 bg-gray-50/50"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <input
                            type="checkbox"
                            checked={isDefaultInstaller || Boolean(formData.customer.installationByName)}
                            onChange={() => {
                              const nextState = !(isDefaultInstaller || Boolean(formData.customer.installationByName));
                              setIsDefaultInstaller(nextState);
                              if (nextState) {
                                setFieldValue("customer.installationBy", []);
                              } else {
                                setFieldValue("customer.installationByName", "");
                              }
                            }}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="font-semibold text-sm text-gray-800">
                            Default
                          </span>
                        </label>
                      )}

                      {/* Staff options */}
                      {filteredStaff.length > 0 ? (
                        filteredStaff.map((s) => {
                          const isChecked =
                            formData.customer.installationBy?.includes(s._id);
                          return (
                            <label
                              key={s._id}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition"
                              onMouseDown={(e) => e.preventDefault()}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked || false}
                                onChange={() => {
                                  let updated = [
                                    ...(formData.customer.installationBy || []),
                                  ];
                                  if (isChecked) {
                                    updated = updated.filter(
                                      (id) => id !== s._id
                                    );
                                  } else {
                                    updated.push(s._id);
                                    setIsDefaultInstaller(false);
                                    setFieldValue(
                                      "customer.installationByName",
                                      ""
                                    ); // Clear manual
                                  }
                                  setFieldValue(
                                    "customer.installationBy",
                                    updated
                                  );
                                }}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="font-medium text-sm">
                                {s.staffName || s.name}
                              </span>
                            </label>
                          );
                        })
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          {installerSearch ? "No staff found" : "No staff available"}
                        </div>
                      )}
                    </div>

                    {/* Click outside to close */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowDropdown(false)}
                    />
                  </>
                )}
              </div>

              {/* Manual Input - Shown when Default is selected or installationByName has value */}
              {(isDefaultInstaller || Boolean(formData.customer.installationByName)) && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Or Enter Manual Installer Name
                  </label>
                  <input
                    type="text"
                    value={formData.customer.installationByName || ""}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFieldValue("customer.installationByName", name);
                      if (name.trim()) {
                        setFieldValue("customer.installationBy", []);
                      }
                    }}
                    placeholder="e.g. Ramu Kaka, Local Technician"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              )}

              {/* Show Manual Name */}
              {formData.customer.installationByName && (
                <p className="mt-2 text-sm font-medium text-green-700">
                  Manual Installer: {formData.customer.installationByName}
                </p>
              )}

              {/* Error */}
              {formErrors.installationBy && (
                <p className="mt-2 text-red-600 text-sm">
                  {formErrors.installationBy}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">IP Address</label>
              <input
                value={formData.customer.ipAddress}
                onChange={(e) => handleChange(e, "customer.ipAddress")}
                className="mt-1 p-2 border rounded w-full"
                placeholder="IP Address"
              />
            </div>

            {formData.customer.ipType === "Dynamic IP Pool" && (
              <div>
                <label className="block text-sm font-medium">
                  Dynamic IP Pool
                </label>
                <input
                  value={formData.customer.dynamicIpPool}
                  onChange={(e) => handleChange(e, "customer.dynamicIpPool")}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium">ONT/ONU MAC ID</label>
              <input
                value={formData.customer.serialNo}
                onChange={(e) => handleChange(e, "customer.serialNo")}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium"> Wi-Fi Router MAC ID</label>
              <input
                value={formData.customer.macId}
                onChange={(e) => handleChange(e, "customer.macId")}
                className="mt-1 p-2 border rounded w-full"
                placeholder="Wi-Fi Router MAC ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Service Opted <span className="text-red-500">*</span></label>
              <select
                value={formData.customer.serviceOpted || ""}
                onChange={(e) => handleChange(e, "customer.serviceOpted")}
                className="mt-1 p-2 border rounded w-full"
              >
                <option value="">-- Select Service --</option>
                {serviceOpted.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
              {formErrors["customer.serviceOpted"] && (
                <p className="text-red-500 text-sm mt-1">{formErrors["customer.serviceOpted"]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Android Box No.</label>
              <input
                value={formData.customer.stbNo}
                onChange={(e) => handleChange(e, "customer.stbNo")}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">RF MAC ID</label>
              <input
                value={formData.customer.vcNo}
                onChange={(e) => handleChange(e, "customer.vcNo")}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Circuit ID</label>
              <input
                value={formData.customer.circuitId}
                onChange={(e) => handleChange(e, "customer.circuitId")}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Created For</label>
              <select
                name="createdFor"
                className="mt-1 p-2 border rounded w-full"
                value={selectedCreatedFor}
                onChange={(e) => handleCreatedForChange(e.target.value)}
              >
                <option value="" disabled selected>
                  Select Created For
                </option>
                <option value="Admin">Admin</option>
                <option value="Reseller">Reseller</option>
                <option value="Lco">Lco</option>
              </select>
            </div>
            {/* Reseller Dropdown - Show if Created For is Reseller OR Lco */}
            {(selectedCreatedFor === "Reseller" ||
              selectedCreatedFor === "Lco") && (
                <div>
                  <label className="block text-sm font-medium">Reseller</label>
                  <select
                    name="reseller"
                    className="mt-1 p-2 border rounded w-full"
                    value={
                      selectedCreatedFor === "Lco"
                        ? selectedRetailerForLco
                        : formData.customer.createdFor.id
                    }
                    onChange={(e) => {
                      if (selectedCreatedFor === "Lco") {
                        handleRetailerForLcoChange(e.target.value);
                      } else {
                        // if just reseller, set ID directly
                        setFieldValue("customer.createdFor.id", e.target.value);
                      }
                    }}
                  >
                    <option value="" disabled>
                      Select Reseller
                    </option>
                    {retailers
                      .filter((r) => r.resellerName)
                      .map((r) => (
                        <option key={r._id} value={r._id}>
                          {r.resellerName}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            {/* LCO Dropdown - Show only if Created For is Lco */}
            {selectedCreatedFor === "Lco" && (
              <div>
                <label className="block text-sm font-medium">Lco</label>
                <select
                  className="mt-1 p-2 border rounded w-full"
                  value={selectedLco} // or formData.customer.createdFor.id
                  onChange={(e) => handleLcoChange(e.target.value)}
                  disabled={!selectedRetailerForLco} // disable if no reseller selected
                >
                  <option value="">Select LCO</option>
                  {lcosForSelectedRetailer.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.lcoName || l.lcoName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </section>

        {/* ---------------- Address Details ---------------- */}
        <section className="border rounded">
          <div className="bg-blue-800 text-white px-4 py-2 font-semibold">
            Address Details
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Billing Address */}
            <div className="border rounded p-3">
              <h3 className="font-semibold mb-2">Installation Address</h3>
              <label className="text-sm">Address Line 1 *</label>
              <input
                value={formData.addresses.billing.addressLine1}
                onChange={(e) =>
                  handleChange(e, "addresses.billing.addressLine1")
                }
                className={`mt-1 p-2 border rounded w-full ${formErrors["addresses.billing.addressLine1"]
                  ? "border-red-500"
                  : ""
                  }`}
                placeholder="Address Line 1 (Required)"
              />

              {formErrors["addresses.billing.addressLine1"] && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors["addresses.billing.addressLine1"]}
                </p>
              )}
              <label className="text-sm mt-2">Address Line 2</label>
              <input
                value={formData.addresses.billing.addressLine2}
                onChange={(e) =>
                  handleChange(e, "addresses.billing.addressLine2")
                }
                className="mt-1 p-2 border rounded w-full"
              />
              <div className="flex gap-2 mt-2">
                <input
                  value={formData.addresses.billing.city}
                  onChange={(e) => handleChange(e, "addresses.billing.city")}
                  placeholder="City *"
                  className={`p-2 border rounded w-1/2 ${formErrors["addresses.billing.city"] ? "border-red-500" : ""
                    }`}
                />
                {formErrors["addresses.billing.city"] && (
                  <p className="text-red-500 text-sm mt-1">{formErrors["addresses.billing.city"]}</p>
                )}

                <input
                  value={formData.addresses.billing.state}
                  onChange={(e) => handleChange(e, "addresses.billing.state")}
                  placeholder="State *"
                  className={`p-2 border rounded w-1/2 ${formErrors["addresses.billing.state"]
                    ? "border-red-500"
                    : ""
                    }`}
                />
                {formErrors["addresses.billing.state"] && (
                  <p className="text-red-500 text-sm mt-1">{formErrors["addresses.billing.state"]}</p>
                )}

              </div>
              <div className="flex gap-2 mt-2">
                <input
                  value={formData.addresses.billing.pincode}
                  onChange={(e) => handleChange(e, "addresses.billing.pincode")}
                  placeholder="Pincode *"
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault(); // Blocks any non-digit key
                    }
                  }}
                  className={`p-2 border rounded w-1/2 ${formErrors["addresses.billing.pincode"]
                    ? "border-red-500"
                    : ""
                    }`}
                />
                {formErrors["addresses.billing.pincode"] && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors["addresses.billing.pincode"]}
                  </p>
                )}
              </div>
            </div>

            <div className="border rounded p-3">
              <h3 className="font-semibold mb-2">Permanent Address (Aadhar)</h3>
              <label className="text-sm">Address Line 1 *</label>
              <input
                value={formData.addresses.permanent.addressLine1}
                onChange={(e) =>
                  handleChange(e, "addresses.permanent.addressLine1")
                }
                className={`mt-1 p-2 border rounded w-full ${formErrors["addresses.permanent.addressLine1"]
                  ? "border-red-500"
                  : ""
                  }`}
                placeholder="Address Line 1 (Required)"
              />

              {formErrors["addresses.permanent.addressLine1"] && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors["addresses.permanent.addressLine1"]}
                </p>
              )}
              <label className="text-sm mt-2">Address Line 2</label>
              <input
                value={formData.addresses.permanent.addressLine2}
                onChange={(e) =>
                  handleChange(e, "addresses.permanent.addressLine2")
                }
                className="mt-1 p-2 border rounded w-full"
              />
              <div className="flex gap-2 mt-2">
                <input
                  value={formData.addresses.permanent.city}
                  onChange={(e) => handleChange(e, "addresses.permanent.city")}
                  placeholder="City *"
                  className={`p-2 border rounded w-1/2 ${formErrors["addresses.permanent.city"]
                    ? "border-red-500"
                    : ""
                    }`}
                />

                <input
                  value={formData.addresses.permanent.state}
                  onChange={(e) => handleChange(e, "addresses.permanent.state")}
                  placeholder="State *"
                  className={`p-2 border rounded w-1/2 ${formErrors["addresses.permanent.state"]
                    ? "border-red-500"
                    : ""
                    }`}
                />

              </div>
              <div className="flex gap-2 mt-2">
                <input
                  value={formData.addresses.permanent.pincode}
                  onChange={(e) =>
                    handleChange(e, "addresses.permanent.pincode")
                  }
                  placeholder="Pincode *"
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault(); // Blocks any non-digit key
                    }
                  }}
                  className={`p-2 border rounded w-1/2 ${formErrors["addresses.permanent.pincode"]
                    ? "border-red-500"
                    : ""
                    }`}
                />
                {formErrors["addresses.permanent.pincode"] && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors["addresses.permanent.pincode"]}
                  </p>
                )}
              </div>
            </div>

            {/* Installation Address */}
            <div className="border rounded p-3">
              <h3 className="font-semibold mb-2">Billing Address</h3>
              <label className="inline-flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={formData.addresses.installation.sameAsBilling}
                  onChange={(e) =>
                    handleChange(e, "addresses.installation.sameAsBilling")
                  }
                  className="mr-2"
                />
                Different as Installation address
              </label>

              {!formData.addresses.installation.sameAsBilling && (
                <>
                  <input
                    value={formData.addresses.installation.addressLine1}
                    onChange={(e) =>
                      handleChange(e, "addresses.installation.addressLine1")
                    }
                    className="mt-2 p-2 border rounded w-full"
                    placeholder="Address Line 1"
                  />
                  <input
                    value={formData.addresses.installation.addressLine2}
                    onChange={(e) =>
                      handleChange(e, "addresses.installation.addressLine2")
                    }
                    className="mt-2 p-2 border rounded w-full"
                    placeholder="Address Line 2"
                  />
                  <div className="flex gap-2 mt-2">
                    <input
                      value={formData.addresses.installation.city}
                      onChange={(e) =>
                        handleChange(e, "addresses.installation.city")
                      }
                      placeholder="City"
                      className="p-2 border rounded w-1/2"
                    />
                    <input
                      value={formData.addresses.installation.state}
                      onChange={(e) =>
                        handleChange(e, "addresses.installation.state")
                      }
                      placeholder="State"
                      className="p-2 border rounded w-1/2"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input
                      value={formData.addresses.installation.pincode}
                      onChange={(e) =>
                        handleChange(e, "addresses.installation.pincode")
                      }
                      placeholder="Pincode"
                      className="p-2 border rounded w-1/2"
                    />
                  </div>
                </>
              )}
            </div>

            {/* ZONE + CUSTOM AREA - SIMPLE & CLEAN (Same as other inputs) */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Left: Zone Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedArea(value);

                    // Reset subzone when zone changes
                    setSelectedSubZone("");
                    setFieldValue("customer.subZoneId", "");

                    // Clear related errors
                    setFormErrors((prev) => ({
                      ...prev,
                      ["customer.subZoneId"]: undefined,
                      zone: undefined,
                    }));
                  }}
                  className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="">-- Select Area --</option>
                  {zoneList.map((zone) => (
                    <option key={zone._id} value={zone._id}>
                      {zone.zoneName}
                    </option>
                  ))}
                </select>

                {(formErrors["zone"] || formErrors["area"]) && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors["area"] || formErrors["zone"]}
                  </p>
                )}
              </div>

              {/* Right: Custom Area Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zone <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedSubZone}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedSubZone(value);
                    setFieldValue("customer.subZoneId", value);
                  }}
                  className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                // required
                >
                  <option value="">
                    {subZoneList.length === 0 ? "-- Loading sub zones..." : "-- Select Zone --"}
                  </option>
                  {subZoneList.map((sz) => (
                    <option key={sz._id} value={sz._id}>
                      {sz.subZoneName || sz.name || sz.zoneName || "Unnamed"}
                    </option>
                  ))}
                </select>
                {(formErrors["customer.subZoneId"] || formErrors["subZone"]) && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors["subZone"] || formErrors["customer.subZoneId"]}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* ====== NETWORK & PACKAGE - YE SECTION REPLACE KIYA ====== */}
        <section className="border rounded">
          <div className="bg-blue-800 text-white px-4 py-2 font-semibold">
            Package Details
          </div>
          <div className="p-5 space-y-6">
            {/* Select & Add Package */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-2xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select & Add Package <span className="text-red-500">* (At least 1 required)</span>
              </label>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                {/* Select Package Dropdown */}
                <div className="flex-1">
                  <select
                    value={packageSearch}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      setPackageSearch(selectedId);
                      const found = roleSpecificPackages.find((p) => p._id === selectedId);
                      if (found) {
                        setCustomPackagePrice(String(found.price || found.basePrice || 0));
                      } else {
                        setCustomPackagePrice("");
                      }
                    }}
                    disabled={packageLoading}
                    className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium text-gray-800"
                  >
                    <option value="">
                      {packageLoading
                        ? "-- Loading packages... --"
                        : roleSpecificPackages.length === 0
                        ? "-- No packages available --"
                        : "-- Select a Package to Add --"}
                    </option>
                    {roleSpecificPackages.map((pkg) => {
                      const isAdded = (formData.customer.packages || []).some(
                        (p) => p.packageId === pkg._id
                      );
                      return (
                        <option key={pkg._id} value={pkg._id} disabled={isAdded}>
                          {pkg.name} — ₹{pkg.price || pkg.basePrice || 0} {isAdded ? "(Already Added)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Price input before adding */}
                <div className="w-full sm:w-36">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm font-semibold">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Price"
                      value={customPackagePrice}
                      onChange={(e) => setCustomPackagePrice(e.target.value)}
                      disabled={!packageSearch}
                      className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-green-700 focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>
                </div>

                {/* Add Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!packageSearch) {
                        toast.warning("Please select a package first");
                        return;
                      }
                      handleAddPackage(packageSearch, customPackagePrice);
                      setPackageSearch("");
                      setCustomPackagePrice("");
                    }}
                    disabled={!packageSearch || packageLoading}
                    className={`w-full sm:w-auto px-5 py-2.5 font-semibold rounded-lg text-sm transition flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm ${
                      !packageSearch || packageLoading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow hover:shadow-md cursor-pointer"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add
                  </button>
                </div>
              </div>
            </div>

            {formErrors["packages"] && (
              <p className="text-red-500 text-sm font-medium">
                {formErrors["packages"]}
              </p>
            )}

            {/* Selected Packages List */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span>Selected Packages ({formData.customer.packages?.length || 0})</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Minimum 1 Mandatory
                </span>
              </h4>

              {(!formData.customer.packages || formData.customer.packages.length === 0) ? (
                <div className="p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50/50 text-red-600 text-sm">
                  No packages selected yet. Please select at least one package above.
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.customer.packages.map((pkg, idx) => (
                    <div
                      key={pkg.packageId || idx}
                      className="p-4 border rounded-lg bg-gray-50 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="min-w-[200px]">
                        <span className="text-xs font-semibold uppercase text-blue-700">
                          Package #{idx + 1}
                        </span>
                        <h5 className="font-bold text-gray-800 text-base">
                          {pkg.packageName}
                        </h5>
                        <p className="text-xs text-gray-500">
                          Base Price: ₹{pkg.originalPrice ?? pkg.packageAmount}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                          Custom Price (₹):
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={pkg.packageAmount}
                          onChange={(e) =>
                            handleUpdatePackagePrice(pkg.packageId, e.target.value)
                          }
                          className="w-32 p-2 border rounded-md font-semibold text-green-700 focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Price"
                        />
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => handleRemovePackage(pkg.packageId)}
                          disabled={formData.customer.packages.length <= 1}
                          title={
                            formData.customer.packages.length <= 1
                              ? "At least one package is mandatory"
                              : "Remove package"
                          }
                          className={`px-3 py-1.5 text-xs font-medium rounded transition ${formData.customer.packages.length <= 1
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Summary */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center text-sm font-semibold text-blue-900">
                    <span>Total Packages: {formData.customer.packages.length}</span>
                    <span>
                      Total Amount: ₹
                      {formData.customer.packages.reduce(
                        (sum, p) => sum + Number(p.packageAmount || 0),
                        0
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="border rounded">
          <div className="bg-blue-800 text-white px-4 py-2 font-semibold">
            Documents
          </div>

          <div className="p-4">
            <label className="block text-sm font-medium mb-2">
              Upload Documents
            </label>

            {/* Document Rows */}
            {formData.documents.map((doc, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 p-3 border rounded"
              >
                {/* Document Type */}
                <div>
                  <label className="text-sm">Document Type</label>
                  <select
                    value={doc.type}
                    onChange={(e) => updateDocumentType(index, e.target.value)}
                    className="mt-1 p-2 border rounded w-full"
                  >
                    <option value="">Select Type</option>
                    {documentTypes.map((dt) => (
                      <option
                        key={dt}
                        value={dt}
                        disabled={
                          dt !== "Other" &&
                          formData.documents.some((d, i) => d.type === dt && i !== index)
                        }
                      >
                        {dt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload */}
                {/* File Upload + Preview */}
                <div className="md:col-span-2">
                  <label className="text-sm">Upload File</label>
                  <input
                    type="file"
                    onChange={(e) =>
                      updateDocumentFile(index, e.target.files[0])
                    }
                    className="mt-1 p-2 border rounded w-full"
                    disabled={!doc.type}
                  />

                  {/* Show filename always */}
                  {doc.file && (
                    <p className="text-sm mt-2 text-gray-700">
                      Selected: <span className="font-medium">{doc.file.name}</span>
                    </p>
                  )}

                  {/* Show image preview only if it's an image */}
                  {doc.preview && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-blue-700 mb-2">Preview:</p>
                      <img
                        src={doc.preview}
                        alt="Document preview"
                        className="w-16 h-16 object-cover border rounded-md shadow-sm"
                      />
                    </div>
                  )}

                  {/* Show message for non-image files */}
                  {doc.file && !doc.preview && (
                    <p className="text-sm text-gray-500 mt-3 italic">
                      (Preview not available for non-image files like PDF)
                    </p>
                  )}
                </div>

                {/* Remove Button */}
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeDocumentRow(index)}
                    className="px-3 py-2 bg-red-600 text-white text-sm rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Add More Button */}
            <button
              type="button"
              onClick={addDocumentRow}
              className="mt-3 px-4 py-2 bg-blue-700 text-white rounded"
              
            >
              + Add Document
            </button>

            {/* No Docs */}
            {formData.documents.length === 0 && (
              <p className="text-sm mt-2 text-gray-500">
                No documents added yet
              </p>
            )}
          </div>
        </section>

        {/* ---------------- Additional & Actions ---------------- */}
        <section className="border rounded">
          <div className="bg-blue-800 text-white px-4 py-2 font-semibold">
            Additional
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm">eKYC (Aadhar Verified)</label>
              <div className="mt-1 flex items-center gap-3">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="ekyc"
                    checked={formData.additional.ekYC === true}
                    onChange={() => setFieldValue("additional.ekYC", true)}
                    className="mr-2"
                  />
                  Yes
                </label>

                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="ekyc"
                    checked={formData.additional.ekYC === false}
                    onChange={() => setFieldValue("additional.ekYC", false)}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm">Status</label>
              <select
                value={formData.additional.status ? "Active" : "Inactive"}
                onChange={(e) =>
                  setFieldValue(
                    "additional.status",
                    e.target.value === "Active"
                  )
                }
                className="mt-1 p-2 border rounded w-full"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm">Description</label>
              <textarea
                value={formData.additional.description}
                onChange={(e) => handleChange(e, "additional.description")}
                className="mt-1 p-2 border rounded w-full h-24"
              />
            </div>
          </div>

          <div className="p-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/user/list")}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
            >
              {loading ? "Saving..." : "Submit"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Clear
            </button>
          </div>
        </section>
      </form>
    </div>
  );

}
