
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, getAllZoneList } from "../../service/user";
import { getRoles } from "../../service/role";
import { getRetailer } from "../../service/retailer";
import { getAllLco } from "../../service/lco";
import { toast } from "react-toastify";
import { getStaffList } from "../../service/ticket";
import { getAllPackageList } from "../../service/package"; // ← YE ADD KIYA (PACKAGE API)

export default function CreateUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // reference data
  const [roles, setRoles] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [lcos, setLcos] = useState([]);
  const [staff, setStaff] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [packageList, setPackageList] = useState([]); // ← PACKAGE LIST STATE

  const [formErrors, setFormErrors] = useState({});
  // const [areas, setAreas] = useState(["Main Area"]);
  const [areas, setAreas] = useState([""]);

  const connectionTypes = ["IIL", "FTTH", "Wireless", "Other"];
  const paymentModes = ["Cash", "Online", "NEFT", "Cheque"];
  const networkTypes = ["PPPOE", "PPOE", "IP-Pass throw", "MAC_TAL", "ILL"];
  const ipTypes = ["Static IP", "Dynamic IP Pool"];
  const CustomeripTypes = ["static", "dynamic"];

  const initialForm = {
    customer: {
      title: "Mr",
      name: "",
      billingName: "",
      differentBillingName: false,
      username: "",
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
      salesExecutiveId: "",
      installationBy: [],
      installationByManual: "",
      serialNo: "",
      macId: "",
      serviceOpted: "",
      connectionType: "ILL",
      ipAddress: "",
      ipType: "Static IP",
      dynamicIpPool: "",
      nas: [],
      stbNo: "",
      vcNo: "",
      circuitId: "",
      packageDetails: {
        packageName: "",
        packageAmount: "",
        packageStart: "",
        packageEnd: "",
      },
    },
    addresses: {
      billing: {
        addressLine1: "",
        addressLine2: "",
        state: "",
        city: "",
        pincode: "",
        area: "",
      },
      permanent: {
        addressLine1: "",
        addressLine2: "",
        state: "",
        city: "",
        pincode: "",
        area: "",
      },
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
    additional: {
      dob: "",
      description: "",
      aadharPermanentAddress: "",
      ekYC: false,
      status: true,
    },
  };

  const [formData, setFormData] = useState(initialForm);

  // FETCH ALL DATA + PACKAGES
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [rRes, resellerRes, lcoRes, staffRes, zoneRes, pkgRes] =
          await Promise.allSettled([
            getRoles(),
            getRetailer(),
            getAllLco(),
            getStaffList?.(),
            getAllZoneList(),
            getAllPackageList(),
          ]);

        if (rRes.status === "fulfilled" && rRes.value?.status)
          setRoles(rRes.value.data);
        if (resellerRes.status === "fulfilled" && resellerRes.value?.status)
          setRetailers(resellerRes.value.data);
        if (lcoRes.status === "fulfilled" && lcoRes.value?.status)
          setLcos(lcoRes.value.data);
        if (staffRes?.status === "fulfilled" && staffRes.value?.status)
          setStaff(staffRes.value.data);
        if (zoneRes.status === "fulfilled" && zoneRes.value?.status)
          setZoneList(zoneRes.value.data || []);
        if (pkgRes.status === "fulfilled" && pkgRes.value?.status)
          setPackageList(pkgRes.value.data || []); // ← PACKAGE DATA
      } catch (err) {
        console.error("fetch error", err);
      }
    };
    fetchAll();
  }, []);

  // AUTO COPY BILLING → INSTALLATION
  useEffect(() => {
    if (formData.addresses.installation.sameAsBilling) {
      setFormData((prev) => ({
        ...prev,
        addresses: {
          ...prev.addresses,
          installation: {
            sameAsBilling: true,
            addressLine1: prev.addresses.billing.addressLine1,
            addressLine2: prev.addresses.billing.addressLine2,
            state: prev.addresses.billing.state,
            city: prev.addresses.billing.city,
            pincode: prev.addresses.billing.pincode,
            area: prev.addresses.billing.area,
          },
        },
      }));
    }
  }, [
    formData.addresses.billing,
    formData.addresses.installation.sameAsBilling,
  ]);

  const setFieldValue = (path, value) => {
    const keys = path.split(".");
    setFormData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return next;
    });
    setFormErrors((prev) => {
      const c = { ...prev };
      delete c[path];
      return c;
    });
  };

  // Areas dynamic add/remove
  const addArea = () => {
    setAreas((prev) => [...prev, ""]);
  };
  const updateArea = (index, value) => {
    setAreas((prev) => prev.map((a, i) => (i === index ? value : a)));
  };
  const removeArea = (index) => {
    setAreas((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e, path) => {
    const { value, type, checked, files } = e.target;
    if (type === "checkbox") setFieldValue(path, checked);
    else if (type === "file") {
      if (path === "documents") {
        const arr = Array.from(files);
        setFormData((prev) => ({
          ...prev,
          documents: [...prev.documents, ...arr],
        }));
      } else setFieldValue(path, files[0]);
    } else setFieldValue(path, value);
  };

  // PACKAGE SELECT → AUTO FILL NAME & PRICE
  const handlePackageChange = (packageId) => {
    const selected = packageList.find((p) => p._id === packageId);
    if (selected) {
      setFieldValue(
        "customer.packageDetails.packageId",
        selected.packageId || ""
      );
      setFieldValue(
        "customer.packageDetails.packageName",
        selected.packageName || selected.name || ""
      );
      setFieldValue(
        "customer.packageDetails.packageAmount",
        selected.basePrice || selected.price || selected.amount || ""
      );
    } else {
      setFieldValue("customer.packageDetails.packageName", "");
      setFieldValue("customer.packageDetails.packageAmount", "");
    }
  };

  // VALIDATION & SUBMIT (same as before)

  // validation: focus on required payment fields & some basics
  const validateForm = () => {
    const errors = {};
    const c = formData.customer;
    const p = formData.payment;

    // email
    const email = (c.email || "").trim();
    if (!email) errors["customer.email"] = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      errors["customer.email"] = "Invalid email";

    // mobile
    const mobile = (c.mobile || "").trim();
    if (!mobile) errors["customer.mobile"] = "Mobile is required";
    else if (!/^\d{10,}$/.test(mobile))
      errors["customer.mobile"] = "Enter valid mobile (10+ digits)";

    // alternate mobile optional but if filled validate
    const alt = (c.alternateMobile || "").trim();
    if (alt && !/^\d{10,}$/.test(alt))
      errors["customer.alternateMobile"] = "Enter valid mobile";

    // aadhar basic check (12 digits)
    const aadhar = (c.aadharNo || "").trim();
    if (aadhar && !/^\d{12}$/.test(aadhar))
      errors["customer.aadharNo"] = "Aadhar must be 12 digits";

    // Payment - all required
    if (!p.paymentMode) errors["payment.paymentMode"] = "Payment mode required";
    // if (!p.invoiceNo) errors["payment.invoiceNo"] = "Invoice No required";
    // if (!p.paymentRef) errors["payment.paymentRef"] = "Payment reference required";
    // if (!p.amount || Number(p.amount) <= 0) errors["payment.amount"] = "Valid amount required";

    // addresses: billing must have pincode & state & city & area
    const bill = formData.addresses.billing;
    // if (!bill.addressLine1) errors["addresses.billing.addressLine1"] = "Billing address required";
    if (!bill.state)
      errors["addresses.billing.state"] = "Billing state required";
    if (!bill.city) errors["addresses.billing.city"] = "Billing city required";
    if (!bill.pincode)
      errors["addresses.billing.pincode"] = "Billing pincode required";
    // if (!bill.area) errors["addresses.billing.area"] = "Billing area required";

    return errors;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const errors = validateForm();
  //   if (Object.keys(errors).length) {
  //     setFormErrors(errors);
  //     console.log("errors", errors);
  //     toast.error("Please fix form errors");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     // Build payload appropriate for your backend; here we create a FormData if documents exist
  //     const payload = new FormData();
  //     // simple flattening - adjust as backend expects
  //     payload.append("customer", JSON.stringify(formData.customer));
  //     payload.append("addresses", JSON.stringify(formData.addresses));
  //     payload.append("payment", JSON.stringify(formData.payment));
  //     payload.append("additional", JSON.stringify(formData.additional));
  //     payload.append("areas", JSON.stringify(areas));
  //     formData.documents.forEach((doc) => {
  //       if (doc.file) {
  //         payload.append("documents", doc.file);
  //       }
  //       if (doc.type) {
  //         payload.append("documentTypes", doc.type);
  //       }
  //     });

  //     // call API that accepts formdata
  //     await createUser(payload);
  //     toast.success("User created successfully");
  //     navigate("/user/list");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error(err?.message || "Failed to create user");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const errors = validateForm();
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      toast.error("Please fix form errors");
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();

      payload.append("customer", JSON.stringify(formData.customer));
      payload.append("addresses", JSON.stringify(formData.addresses));
      payload.append("payment", JSON.stringify(formData.payment));
      payload.append("additional", JSON.stringify(formData.additional));
      payload.append("areas", JSON.stringify(areas));

      // FIXED — Only append type when file exists, and use documentTypes[]
      formData.documents.forEach((doc) => {
        if (doc.file && doc.type) {
          payload.append("documents", doc.file);
          payload.append("documentTypes[]", doc.type);
        }
      });

      await createUser(payload);
      toast.success("User created successfully");
      navigate("/user/list");

    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };


  const handleClear = () => {
    setFormData(initialForm);
    setFormErrors({});
    setAreas(["Main Area"]);
  };

  const documentTypes = [
    "Aadhar Card",
    "Pan Card",
    "Address Proof",
    "Passport",
    "Photo",
    "Other",
  ];
  const addDocumentRow = () =>
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, { type: "", file: null }],
    }));
  const updateDocumentType = (i, v) =>
    setFormData((prev) => {
      const d = [...prev.documents];
      d[i].type = v;
      return { ...prev, documents: d };
    });
  const updateDocumentFile = (i, f) =>
    setFormData((prev) => {
      const d = [...prev.documents];
      d[i].file = f;
      return { ...prev, documents: d };
    });
  const removeDocumentRow = (i) =>
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, idx) => idx !== i),
    }));

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
              <label className="block text-sm font-medium">Name *</label>
              <input
                value={formData.customer.name}
                onChange={(e) => handleChange(e, "customer.name")}
                className={`mt-1 p-2 border rounded w-full ${
                  formErrors["customer.name"] ? "border-red-500" : ""
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
              <label className="block text-sm font-medium">Email *</label>
              <input
                type="email"
                value={formData.customer.email}
                onChange={(e) => handleChange(e, "customer.email")}
                className={`mt-1 p-2 border rounded w-full ${
                  formErrors["customer.email"] ? "border-red-500" : ""
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
              <label className="block text-sm font-medium">Mobile *</label>
              <input
                value={formData.customer.mobile}
                onChange={(e) => handleChange(e, "customer.mobile")}
                className={`mt-1 p-2 border rounded w-full ${
                  formErrors["customer.mobile"] ? "border-red-500" : ""
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
                Alternate Mobile
              </label>
              <input
                value={formData.customer.alternateMobile}
                onChange={(e) => handleChange(e, "customer.alternateMobile")}
                className={`mt-1 p-2 border rounded w-full ${
                  formErrors["customer.alternateMobile"] ? "border-red-500" : ""
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
                Account Id (IPACCT Id)
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
                Connection Type
              </label>
              <select
                value={formData.customer.connectionType}
                onChange={(e) => handleChange(e, "customer.connectionType")}
                className="mt-1 p-2 border rounded w-full"
              >
                {connectionTypes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">
                Sales Executive
              </label>
              <select
                value={formData.customer.salesExecutiveId}
                onChange={(e) => handleChange(e, "customer.salesExecutiveId")}
                className="mt-1 p-2 border rounded w-full"
              >
                <option value="">Select Staff</option>
                {staff.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.roleName}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium">
                Installation By
              </label>
              {/* multi select */}
              <select
                value={formData.customer.salesExecutiveId}
                onChange={(e) => handleChange(e, "customer.installationBy")}
                className="mt-1 p-2 border rounded w-full"
              >
                <option value="">Select Staff</option>
                {staff.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.roleName}
                  </option>
                ))}
              </select>

              <div className="mt-2">
                <label className="block text-sm font-medium">
                  Or Enter Manual Installer
                </label>
                <input
                  value={formData.customer.installationByManual}
                  onChange={(e) =>
                    handleChange(e, "customer.installationByManual")
                  }
                  className="mt-1 p-2 border rounded w-full"
                  placeholder="Enter installer name manually"
                />
              </div>
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

            <div>
              <label className="block text-sm font-medium">IP Type</label>
              <select
                value={formData.customer.ipType}
                onChange={(e) => handleChange(e, "customer.ipType")}
                className="mt-1 p-2 border rounded w-full"
              >
                {CustomeripTypes.map((it) => (
                  <option key={it} value={it}>
                    {it}
                  </option>
                ))}
              </select>
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
              <label className="block text-sm font-medium">Serial No</label>
              <input
                value={formData.customer.serialNo}
                onChange={(e) => handleChange(e, "customer.serialNo")}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">MAC ID</label>
              <input
                value={formData.customer.macId}
                onChange={(e) => handleChange(e, "customer.macId")}
                className="mt-1 p-2 border rounded w-full"
                placeholder="MAC ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Service Opted</label>
              <input
                value={formData.customer.serviceOpted}
                onChange={(e) => handleChange(e, "customer.serviceOpted")}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">STB No.</label>
              <input
                value={formData.customer.stbNo}
                onChange={(e) => handleChange(e, "customer.stbNo")}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">VC No.</label>
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
              <h3 className="font-semibold mb-2">Billing Address</h3>
              <label className="text-sm">Address Line 1 *</label>
              <input
                value={formData.addresses.billing.addressLine1}
                onChange={(e) =>
                  handleChange(e, "addresses.billing.addressLine1")
                }
                className={`mt-1 p-2 border rounded w-full ${
                  formErrors["addresses.billing.addressLine1"]
                    ? "border-red-500"
                    : ""
                }`}
              />
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
                  className={`p-2 border rounded w-1/2 ${
                    formErrors["addresses.billing.city"] ? "border-red-500" : ""
                  }`}
                />
                <input
                  value={formData.addresses.billing.state}
                  onChange={(e) => handleChange(e, "addresses.billing.state")}
                  placeholder="State *"
                  className={`p-2 border rounded w-1/2 ${
                    formErrors["addresses.billing.state"]
                      ? "border-red-500"
                      : ""
                  }`}
                />
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  value={formData.addresses.billing.pincode}
                  onChange={(e) => handleChange(e, "addresses.billing.pincode")}
                  placeholder="Pincode *"
                  className={`p-2 border rounded w-1/2 ${
                    formErrors["addresses.billing.pincode"]
                      ? "border-red-500"
                      : ""
                  }`}
                />
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
                className={`mt-1 p-2 border rounded w-full ${
                  formErrors["addresses.billing.addressLine1"]
                    ? "border-red-500"
                    : ""
                }`}
              />
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
                  className={`p-2 border rounded w-1/2 ${
                    formErrors["addresses.permanent.city"] ? "border-red-500" : ""
                  }`}
                />
                <input
                  value={formData.addresses.permanent.state}
                  onChange={(e) => handleChange(e, "addresses.permanent.state")}
                  placeholder="State *"
                  className={`p-2 border rounded w-1/2 ${
                    formErrors["addresses.permanent.state"]
                      ? "border-red-500"
                      : ""
                  }`}
                />
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  value={formData.addresses.permanent.pincode}
                  onChange={(e) => handleChange(e, "addresses.permanent.pincode")}
                  placeholder="Pincode *"
                  className={`p-2 border rounded w-1/2 ${
                    formErrors["addresses.permanent.pincode"]
                      ? "border-red-500"
                      : ""
                  }`}
                />
              </div>
            </div>

            {/* Installation Address */}
            <div className="border rounded p-3">
              <h3 className="font-semibold mb-2">Installation Address</h3>
              <label className="inline-flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={formData.addresses.installation.sameAsBilling}
                  onChange={(e) =>
                    handleChange(e, "addresses.installation.sameAsBilling")
                  }
                  className="mr-2"
                />
                Different as Billing address
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

            {/* dynamic area editor (bottom row across grid) */}

            <div className="md:col-span-3 mt-2 border rounded p-3">
              <h4 className="font-medium">Areas (Dynamic)</h4>
              <div className="space-y-2 mt-2">
                {areas.map((a, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <select
                      value={formData.addresses.area}
                      onChange={(e) => updateArea(i, e.target.value)}
                      className="p-2 border rounded w-full"
                    >
                      <option value="">Select Area</option>
                      {zoneList.map((zone) => (
                        <option key={zone._id} value={zone._id}>
                          {zone.zoneName}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* ====== NETWORK & PACKAGE - YE SECTION REPLACE KIYA ====== */}
        <section className="border rounded">
          <div className="bg-blue-800 text-white px-4 py-2 font-semibold">
            Network & Package
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PACKAGE DROPDOWN + AUTO PRICE */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Select Package *
              </label>
              <select
                onChange={(e) => handlePackageChange(e.target.value)}
                className="w-full p-2 border rounded"
                defaultValue=""
              >
                <option value="" disabled>
                  -- Select Package --
                </option>
                {packageList.map((pkg) => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.packageName || pkg.name}{" "}
                    {pkg.basePrice ? `₹${pkg.basePrice}` : ""}
                  </option>
                ))}
              </select>

              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Package Price (Auto-filled)
                </label>
                <input
                  value={formData.customer.packageDetails.packageAmount}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100 font-bold text-green-700"
                  placeholder="Price appears here"
                />
              </div>
            </div>

            {/* NETWORK TYPE */}
            <div>
              <label className="block text-sm font-medium">Network Type</label>
              <select
                value={formData.customer.networkType || ""}
                onChange={(e) =>
                  setFieldValue("customer.networkType", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
              >
                <option value="">Select Network Type</option>
                {networkTypes.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
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
                        disabled={formData.documents.some(
                          (d, i) => d.type === dt && i !== index
                        )} // prevent duplicates
                      >
                        {dt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload */}
                <div className="md:col-span-1">
                  <label className="text-sm">Upload File</label>
                  <input
                    type="file"
                    onChange={(e) =>
                      updateDocumentFile(index, e.target.files[0])
                    }
                    className="mt-1 p-2 border rounded w-full"
                    disabled={!doc.type}
                  />
                  {doc.file && (
                    <p className="text-sm mt-1 text-gray-700">
                      {doc.file.name}
                    </p>
                  )}
                </div>

                {/* Remove Button */}
                <div className="flex items-end justify-end">
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
              disabled={formData.documents.length >= documentTypes.length} // can't exceed available types
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
              <label className="block text-sm">DOB</label>
              <input
                type="date"
                value={formData.additional.dob}
                onChange={(e) => handleChange(e, "additional.dob")}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>

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
