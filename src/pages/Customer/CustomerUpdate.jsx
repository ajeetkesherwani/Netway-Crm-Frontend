import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getUserDetails,
  updateUser,
  getAllZoneList,
  getLcoByRetailer,
} from "../../service/user";
import { getRetailer } from "../../service/retailer";
import { getAllPackageList } from "../../service/package";
import { getStaffList } from "../../service/ticket";
import { toast } from "react-toastify";
import { getSubzonesWithZoneId } from "../../service/apiClient";

export default function CustomerUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Reference Data
  const [staff, setStaff] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [packageList, setPackageList] = useState([]);
  const [retailers, setRetailers] = useState([]);

  // Zone + Custom Area
  const [selectedArea, setSelectedArea] = useState("");
  const [customArea, setCustomArea] = useState("");

  const [subZoneList, setSubZoneList] = useState([]);
  const [selectedSubZone, setSelectedSubZone] = useState("");

  // Created For States
  const [selectedCreatedFor, setSelectedCreatedFor] = useState("Self");
  const [selectedRetailerForLco, setSelectedRetailerForLco] = useState("");
  const [lcosForSelectedRetailer, setLcosForSelectedRetailer] = useState([]);
  const [selectedLco, setSelectedLco] = useState("");

  const connectionTypes = ["IIL", "FTTH", "RF", "OTHER"];
  const networkTypes = ["PPPOE", "PPOE", "IP-Pass throw", "MAC_TAL", "ILL"];
  const ipTypes = ["Static IP", "Dynamic IP Pool"];
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

  const prevBillingRef = useRef();

  const [formData, setFormData] = useState({
    customer: {
      title: "Mr",
      name: "",
      billingName: "",
      username: "",
      password: "",
      email: "",
      mobile: "",
      alternateMobile: "",
      accountId: "",
      connectionType: "ILL",
      selsExecutive: "",
      installationBy: [],
      installationByName: "",
      ipAddress: "",
      ipType: "Static IP",
      dynamicIpPool: "",
      serialNo: "",
      macId: "",
      serviceOpted: "",
      stbNo: "",
      vcNo: "",
      circuitId: "",
      networkType: "",
      createdFor: { id: null, type: "Self" }, // ← null by default
      customArea: "",
      packageDetails: { packageId: "", packageName: "", packageAmount: "" },
    },
    addresses: {
      billing: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        area: "",
      },
      permanent: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        area: "",
      },
      installation: {
        sameAsBilling: true,
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        area: "",
      },
    },
    additional: { dob: "", description: "", ekYC: false, status: true },
    documents: [],
  });

  const setFieldValue = (path, value) => {
    setFormData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  // Load Customer + Reference Data
  useEffect(() => {
    const load = async () => {
      try {
        const [userRes, staffRes, zoneRes, pkgRes, retailerRes] =
          await Promise.all([
            getUserDetails(id),
            getStaffList(),
            getAllZoneList(),
            getAllPackageList(),
            getRetailer(),
          ]);

        setStaff(staffRes?.data || []);
        setZoneList(zoneRes?.data || []);
        setPackageList(pkgRes?.data || []);
        if (retailerRes?.status) setRetailers(retailerRes.data);

        const u = userRes.data.user;

        const getId = (obj) =>
          (obj && typeof obj === "object" ? obj._id : obj) || null;
        const getIds = (arr) => (Array.isArray(arr) ? arr.map(getId) : []);

        const createdForType = u.createdFor?.type || "Self";
        setSelectedCreatedFor(createdForType);

        if (createdForType === "lco") {
          const rId = getId(u.retailerId || u.createdFor?.retailerId);
          if (rId) {
            setSelectedRetailerForLco(rId);
            try {
              const lcoRes = await getLcoByRetailer(rId);
              setLcosForSelectedRetailer(lcoRes.data || []);
            } catch (e) {
              console.error(e);
            }
          }
          setSelectedLco(getId(u.createdFor?.id));
        }

        const loadedData = {
          customer: {
            title: u.generalInformation?.title || "Mr",
            name: u.generalInformation?.name || "",
            billingName: u.generalInformation?.billingName || "",
            username: u.generalInformation?.username || "",
            email: u.generalInformation?.email || "",
            mobile: u.generalInformation?.phone || "",
            alternateMobile: u.generalInformation?.alternatePhone || "",
            accountId: u.generalInformation?.ipactId || "",
            connectionType: u.generalInformation?.connectionType || "ILL",
            selsExecutive: getId(u.generalInformation?.selsExecutive),
            installationBy: getIds(u.generalInformation?.installationBy),
            installationByName: u.generalInformation?.installationByName || "",
            ipAddress: u.generalInformation?.ipAdress || "",
            ipType: u.generalInformation?.ipType || "Static IP",
            dynamicIpPool: u.networkInformation?.dynamicIpPool || "",
            serialNo: u.generalInformation?.serialNo || "",
            macId: u.generalInformation?.macId || "",
            serviceOpted: u.generalInformation?.serviceOpted || "",
            stbNo: u.generalInformation?.stbNo || "",
            vcNo: u.generalInformation?.vcNo || "",
            circuitId: u.generalInformation?.circuitId || "",
            networkType: u.networkInformation?.networkType || "",
            createdFor: {
              type: createdForType,
              id: getId(u.createdFor?.id),
            },
            packageDetails: {
              packageId: getId(u.packageInfomation?.packageId),
              packageName: u.packageInfomation?.name || "",
              packageAmount: u.packageInfomation?.price || "",
            },
            customArea: u.generalInformation?.customArea || "",
          },
          addresses: {
            billing: {
              addressLine1: u.addressDetails?.billingAddress?.addressine1 || "",
              addressLine2: u.addressDetails?.billingAddress?.addressine2 || "",
              city: u.addressDetails?.billingAddress?.city || "",
              state: u.addressDetails?.billingAddress?.state || "",
              pincode: u.addressDetails?.billingAddress?.pincode || "",
            },
            permanent: {
              addressLine1:
                u.addressDetails?.permanentAddress?.addressine1 || "",
              addressLine2:
                u.addressDetails?.permanentAddress?.addressine2 || "",
              city: u.addressDetails?.permanentAddress?.city || "",
              state: u.addressDetails?.permanentAddress?.state || "",
              pincode: u.addressDetails?.permanentAddress?.pincode || "",
            },
            installation: {
              sameAsBilling: true,
              addressLine1:
                u.addressDetails?.installationAddress?.addressine1 || "",
              addressLine2:
                u.addressDetails?.installationAddress?.addressine2 || "",
              city: u.addressDetails?.installationAddress?.city || "",
              state: u.addressDetails?.installationAddress?.state || "",
              pincode: u.addressDetails?.installationAddress?.pincode || "",
            },
          },
          additional: {
            dob: u.additionalInformation?.dob || "",
            description: u.additionalInformation?.description || "",
            ekYC: u.additionalInformation?.ekyc === "yes",
            status: u.status === "active",
          },
          documents: (() => {
            const docs = [];
            (u.document || []).forEach((doc) => {
              const type = doc.documentType;
              const images = Array.isArray(doc.documentImage)
                ? doc.documentImage
                : doc.documentImage
                  ? [doc.documentImage]
                  : [];

              if (images.length === 0) return;

              images.forEach((img, index) => {
                docs.push({
                  type: type,
                  displayLabel: type === "Other" && images.length > 1
                    ? `${type} (${index + 1})`
                    : type,
                  existingImage: img,
                  existingUrl: img ? '/' + img.replace(/\\/g, '/') : null, 
                  preview: null,
                  file: null,
                });
                // docs.push({
                //   type: type,
                //   // For multiple "Other" images, show index in label if needed (optional)
                //   displayLabel: type === "Other" && images.length > 1
                //     ? `${type} (${index + 1})`
                //     : type,
                //   existingImage: img,
                //   // existingUrl: img ? `/uploads/${img}` : null,
                //   existingUrl: img ? '/' + img.replace(/\\/g, '/') : null,
                //   file: null,
                // });
              });
            });
            return docs;
          })(),
          // documents: (u.document || []).map((doc) => ({
          //   type: doc.documentType,
          //   existingImage: doc.documentImage,
          //   existingUrl: doc.documentImage
          //     ? `/uploads/${doc.documentImage}`
          //     : null,
          //   file: null,
          // })),
        };

        setFormData(loadedData);

        // Pre-fill Zone & Custom Area
        setSelectedArea(getId(u.addressDetails?.area) || "");
        setSelectedSubZone(getId(u.addressDetails?.subZone) || "");
        setCustomArea(u.generalInformation?.customArea || "");
        setFieldValue(
          "customer.customArea",
          u.generalInformation?.customArea || ""
        );

        prevBillingRef.current = loadedData.addresses.billing;
      } catch (err) {
        toast.error("Failed to load customer data");
        console.error(err);
      }
    };
    load();
  }, [id]);

  // Fetch subzones when zone changes
  useEffect(() => {
    const fetchSubzones = async () => {
      if (!selectedArea) {
        setSubZoneList([]);
        setSelectedSubZone("");
        return;
      }

      try {
        const response = await getSubzonesWithZoneId(selectedArea);
        if (response?.status && Array.isArray(response.data)) {
          setSubZoneList(response.data);
        } else {
          setSubZoneList([]);
          toast.error("No sub areas found for this zone");
        }
      } catch (err) {
        console.error("Error fetching subzones:", err);
        setSubZoneList([]);
        toast.error("Failed to load sub areas");
      }
    };

    fetchSubzones();
  }, [selectedArea]);

  // Auto-sync billing → installation
  useEffect(() => {
    if (
      formData.addresses.installation.sameAsBilling &&
      prevBillingRef.current &&
      JSON.stringify(formData.addresses.billing) !==
      JSON.stringify(prevBillingRef.current)
    ) {
      setFieldValue(
        "addresses.installation.addressLine1",
        formData.addresses.billing.addressLine1
      );
      setFieldValue(
        "addresses.installation.addressLine2",
        formData.addresses.billing.addressLine2
      );
      setFieldValue(
        "addresses.installation.city",
        formData.addresses.billing.city
      );
      setFieldValue(
        "addresses.installation.state",
        formData.addresses.billing.state
      );
      setFieldValue(
        "addresses.installation.pincode",
        formData.addresses.billing.pincode
      );
      prevBillingRef.current = { ...formData.addresses.billing };
    }
  }, [
    formData.addresses.billing,
    formData.addresses.installation.sameAsBilling,
  ]);

  // Handle Package Change
  const handlePackageChange = (pkgId) => {
    const pkg = packageList.find((p) => p._id === pkgId);
    if (pkg) {
      setFieldValue("customer.packageDetails.packageId", pkgId);
      setFieldValue(
        "customer.packageDetails.packageName",
        pkg.packageName || pkg.name || ""
      );
      setFieldValue(
        "customer.packageDetails.packageAmount",
        pkg.basePrice || pkg.price || ""
      );
    }
  };

  // Document Functions
  const addDocumentRow = () =>
    setFormData((prev) => ({
      ...prev,
      documents: [
        ...prev.documents,
        { type: "", file: null, existingUrl: null },
      ],
    }));

  const updateDocumentType = (i, v) => {
    const d = [...formData.documents];
    d[i].type = v;
    setFormData((prev) => ({ ...prev, documents: d }));
  };

  const updateDocumentFile = (i, f) => {
    if (!f) return;

    const d = [...formData.documents];

    // Create preview only for image files
    const isImage = f.type.startsWith("image/");
    const preview = isImage ? URL.createObjectURL(f) : "";

    d[i] = {
      ...d[i],
      file: f,
      preview: preview,
    };

    setFormData((prev) => ({ ...prev, documents: d }));
  };
  // const updateDocumentFile = (i, f) => {
  //   const d = [...formData.documents];
  //   d[i].file = f;
  //   setFormData((prev) => ({ ...prev, documents: d }));
  // };

  const removeDocumentRow = (i) =>
    setFormData((prev) => {
      const d = [...prev.documents];

      // Clean up preview URL if it exists (for new files)
      if (d[i]?.preview) {
        URL.revokeObjectURL(d[i].preview);
      }

      return {
        ...prev,
        documents: d.filter((_, idx) => idx !== i),
      };
    });
  // const removeDocumentRow = (i) =>
  //   setFormData((prev) => ({
  //     ...prev,
  //     documents: prev.documents.filter((_, idx) => idx !== i),
  //   }));

  // Handle Created For change - NEVER send empty string
  const handleCreatedForChange = (type) => {
    setSelectedCreatedFor(type);
    setFieldValue("customer.createdFor.type", type);
    setFieldValue("customer.createdFor.id", null); // ← Always null when changing
    setSelectedRetailerForLco("");
    setSelectedLco("");
    setLcosForSelectedRetailer([]);
  };

  const handleRetailerForLcoChange = async (retailerId) => {
    if (selectedRetailerForLco === retailerId) {
      setSelectedRetailerForLco("");
      setLcosForSelectedRetailer([]);
      setSelectedLco("");
      setFieldValue("customer.createdFor.id", null);
      return;
    }
    setSelectedRetailerForLco(retailerId);
    try {
      const res = await getLcoByRetailer(retailerId);
      setLcosForSelectedRetailer(res.data || []);
    } catch (err) {
      console.error("Error fetching LCOs:", err);
      setLcosForSelectedRetailer([]);
    }
  };

  const handleLcoChange = (lcoId) => {
    setSelectedLco(lcoId);
    setFieldValue("customer.createdFor.id", lcoId || null);
  };

  // Submit
  // Submit Handler - Inside handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const payload = new FormData();

    // Customer, addresses, additional
    const cleanCustomer = {
      ...formData.customer,
      createdFor: {
        type: formData.customer.createdFor.type,
        id: formData.customer.createdFor.id || null,
      },
      customArea: customArea || "",
    };

    payload.append("customer", JSON.stringify(cleanCustomer));
    payload.append("addresses", JSON.stringify(formData.addresses));
    payload.append("additional", JSON.stringify(formData.additional));
    payload.append("area", selectedArea || "");
    payload.append("subZone", selectedSubZone || "");
    payload.append("customArea", customArea || "");

    // --- DOCUMENTS: New files + types ---
    const newDocuments = formData.documents.filter(doc => doc.file);
    newDocuments.forEach((doc) => {
      payload.append("documents", doc.file);
      payload.append("documentTypes[]", doc.type || "Other");
    });

    // --- EXISTING DOCUMENTS: Send as JSON string ---
    const existingFilenames = formData.documents
      .filter(doc => doc.existingUrl && !doc.file)
      .map(doc => doc.existingUrl.split("/").pop());

    if (existingFilenames.length > 0) {
      payload.append("existingDocuments", JSON.stringify(existingFilenames));
    }

    try {
      await updateUser(id, payload);
      toast.success("Customer updated successfully!");
      navigate("/user/list");
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (loading) return;
  //   setLoading(true);

  //   const payload = new FormData();

  //   // Clean createdFor.id and customArea before sending
  //   const cleanCustomer = {
  //     ...formData.customer,
  //     createdFor: {
  //       type: formData.customer.createdFor.type,
  //       id: formData.customer.createdFor.id || null,
  //     },
  //     customArea: customArea || "",
  //   };

  //   payload.append("customer", JSON.stringify(cleanCustomer));
  //   payload.append("addresses", JSON.stringify(formData.addresses));
  //   payload.append("additional", JSON.stringify(formData.additional));
  //   payload.append("area", selectedArea || "");
  //   payload.append("customArea", customArea || "");

  //   formData.documents.forEach((doc) => {
  //     if (doc.file) {
  //       payload.append("documents", doc.file);
  //       payload.append("documentTypes[]", doc.type);
  //     }
  //     if (doc.existingUrl && !doc.file) {
  //       const filename = doc.existingUrl.split("/").pop();
  //       payload.append("existingDocuments[]", filename);
  //     }
  //   });

  //   try {
  //     await updateUser(id, payload);
  //     toast.success("Customer updated successfully!");
  //     navigate("/user/list");
  //   } catch (err) {
  //     console.error("Update error:", err);
  //     toast.error(err.response?.data?.message || "Update failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="max-w-[1400px] mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">Update Customer</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Details */}
        <section className="border rounded-lg">
          <div className="bg-blue-800 text-white px-6 py-3 text-lg font-semibold">
            Customer Details
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-5">
            <div>
              <label>Title</label>
              <select
                value={formData.customer.title}
                onChange={(e) =>
                  setFieldValue("customer.title", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
              >
                <option>Mr</option>
                <option>Mrs</option>
                <option>Ms</option>
                <option>M/s</option>
              </select>
            </div>
            <div>
              <label>Name *</label>
              <input
                value={formData.customer.name}
                onChange={(e) => setFieldValue("customer.name", e.target.value)}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label>Billing Name</label>
              <input
                value={formData.customer.billingName}
                onChange={(e) =>
                  setFieldValue("customer.billingName", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full bg-gray-50"
              />
            </div>
            <div>
              <label>Email *</label>
              <input
                type="email"
                value={formData.customer.email}
                onChange={(e) =>
                  setFieldValue("customer.email", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label>Mobile *</label>
              <input
                value={formData.customer.mobile}
                onChange={(e) =>
                  setFieldValue("customer.mobile", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label>Alternate Mobile</label>
              <input
                value={formData.customer.alternateMobile}
                onChange={(e) =>
                  setFieldValue("customer.alternateMobile", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label>Account ID</label>
              <input
                value={formData.customer.accountId}
                onChange={(e) =>
                  setFieldValue("customer.accountId", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label>Connection Type</label>
              <select
                value={formData.customer.connectionType}
                onChange={(e) =>
                  setFieldValue("customer.connectionType", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
              >
                {connectionTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Sales Executive</label>
              <select
                value={formData.customer.selsExecutive}
                onChange={(e) =>
                  setFieldValue("customer.selsExecutive", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
              >
                <option value="">Select</option>
                {staff.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.staffName || s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Installation By */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Installation By *
              </label>
              <div className="relative">
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full p-3 border rounded-lg cursor-pointer bg-white hover:border-blue-500 flex justify-between items-center min-h-[42px]"
                >
                  <div className="flex flex-wrap gap-2">
                    {formData.customer.installationBy.length > 0 ? (
                      formData.customer.installationBy.map((id) => {
                        const p = staff.find((s) => s._id === id);
                        return p ? (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                          >
                            {p.staffName || p.name}{" "}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFieldValue(
                                  "customer.installationBy",
                                  formData.customer.installationBy.filter(
                                    (x) => x !== id
                                  )
                                );
                              }}
                              className="ml-1 hover:text-red-600"
                            >
                              ×
                            </button>
                          </span>
                        ) : null;
                      })
                    ) : (
                      <span className="text-gray-500 text-sm">
                        Select installer(s)
                      </span>
                    )}
                  </div>
                  <svg
                    className={`w-5 h-5 transition ${showDropdown ? "rotate-180" : ""
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
                {showDropdown && (
                  <>
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {staff.map((s) => {
                        const checked =
                          formData.customer.installationBy.includes(s._id);
                        return (
                          <label
                            key={s._id}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                const updated = checked
                                  ? formData.customer.installationBy.filter(
                                    (x) => x !== s._id
                                  )
                                  : [
                                    ...formData.customer.installationBy,
                                    s._id,
                                  ];
                                setFieldValue(
                                  "customer.installationBy",
                                  updated
                                );
                                if (updated.length > 0)
                                  setFieldValue(
                                    "customer.installationByName",
                                    ""
                                  );
                              }}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span>{s.staffName || s.name}</span>
                          </label>
                        );
                      })}
                    </div>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowDropdown(false)}
                    />
                  </>
                )}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Or Manual Name
                </label>
                <input
                  type="text"
                  value={formData.customer.installationByName}
                  onChange={(e) => {
                    setFieldValue(
                      "customer.installationByName",
                      e.target.value
                    );
                    if (e.target.value.trim())
                      setFieldValue("customer.installationBy", []);
                  }}
                  placeholder="e.g. Ramu Kaka"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label>IP Address</label>
              <input
                value={formData.customer.ipAddress}
                onChange={(e) =>
                  setFieldValue("customer.ipAddress", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label>IP Type</label>
              <select
                value={formData.customer.ipType}
                onChange={(e) =>
                  setFieldValue("customer.ipType", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
              >
                {ipTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            {formData.customer.ipType === "Dynamic IP Pool" && (
              <div>
                <label>Dynamic IP Pool</label>
                <input
                  value={formData.customer.dynamicIpPool}
                  onChange={(e) =>
                    setFieldValue("customer.dynamicIpPool", e.target.value)
                  }
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
            )}
            <div>
              <label>Serial No</label>
              <input
                value={formData.customer.serialNo}
                onChange={(e) =>
                  setFieldValue("customer.serialNo", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label>MAC ID</label>
              <input
                value={formData.customer.macId}
                onChange={(e) =>
                  setFieldValue("customer.macId", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label>Service Opted</label>
              <input
                value={formData.customer.serviceOpted}
                onChange={(e) =>
                  setFieldValue("customer.serviceOpted", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label>STB No.</label>
              <input
                value={formData.customer.stbNo}
                onChange={(e) =>
                  setFieldValue("customer.stbNo", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label>VC No.</label>
              <input
                value={formData.customer.vcNo}
                onChange={(e) => setFieldValue("customer.vcNo", e.target.value)}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label>Circuit ID</label>
              <input
                value={formData.customer.circuitId}
                onChange={(e) =>
                  setFieldValue("customer.circuitId", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
              />
            </div>

            {/* Created For Section */}
            <div>
              <label className="block text-sm font-medium">Created For</label>
              <select
                name="createdFor"
                className="mt-1 p-2 border rounded w-full"
                value={selectedCreatedFor}
                onChange={(e) => handleCreatedForChange(e.target.value)}
              >
                <option value="Self">Self</option>
                <option value="admin">Admin</option>
                <option value="reseller">Reseller</option>
                <option value="lco">Lco</option>
              </select>
            </div>

            {/* Reseller Dropdown */}
            {(selectedCreatedFor === "reseller" ||
              selectedCreatedFor === "lco") && (
                <div>
                  <label className="block text-sm font-medium">Reseller</label>
                  <select
                    name="reseller"
                    className="mt-1 p-2 border rounded w-full"
                    value={
                      selectedCreatedFor === "lco"
                        ? selectedRetailerForLco
                        : formData.customer.createdFor.id
                    }
                    onChange={(e) => {
                      if (selectedCreatedFor === "lco") {
                        handleRetailerForLcoChange(e.target.value);
                      } else {
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

            {/* LCO Dropdown */}
            {selectedCreatedFor === "lco" && (
              <div>
                <label className="block text-sm font-medium">Lco</label>
                <select
                  className="mt-1 p-2 border rounded w-full"
                  value={selectedLco}
                  onChange={(e) => handleLcoChange(e.target.value)}
                  disabled={!selectedRetailerForLco}
                >
                  <option value="">Select LCO</option>
                  {lcosForSelectedRetailer.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.lcoName || l.name || l.username}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </section>

        {/* Address Details */}
        <section className="border rounded-lg">
          <div className="bg-blue-800 text-white px-6 py-3 text-lg font-semibold">
            Address Details
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border p-5 rounded">
              <h3 className="font-bold text-blue-700 mb-3">
                Installation Address
              </h3>
              <input
                placeholder="Address Line 1 *"
                value={formData.addresses.billing.addressLine1}
                onChange={(e) =>
                  setFieldValue(
                    "addresses.billing.addressLine1",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded mb-3"
                required
              />
              <input
                placeholder="Address Line 2"
                value={formData.addresses.billing.addressLine2}
                onChange={(e) =>
                  setFieldValue(
                    "addresses.billing.addressLine2",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded mb-3"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="City *"
                  value={formData.addresses.billing.city}
                  onChange={(e) =>
                    setFieldValue("addresses.billing.city", e.target.value)
                  }
                  className="p-2 border rounded"
                  required
                />
                <input
                  placeholder="State *"
                  value={formData.addresses.billing.state}
                  onChange={(e) =>
                    setFieldValue("addresses.billing.state", e.target.value)
                  }
                  className="p-2 border rounded"
                  required
                />
              </div>
              <input
                placeholder="Pincode *"
                value={formData.addresses.billing.pincode}
                onChange={(e) =>
                  setFieldValue("addresses.billing.pincode", e.target.value)
                }
                className="w-full p-2 border rounded mt-3"
                required
              />
            </div>

            <div className="border p-5 rounded">
              <h3 className="font-bold text-blue-700 mb-3">
                Permanent Address (Aadhar)
              </h3>
              <input
                placeholder="Address Line 1"
                value={formData.addresses.permanent.addressLine1}
                onChange={(e) =>
                  setFieldValue(
                    "addresses.permanent.addressLine1",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded mb-3"
              />
              <input
                placeholder="Address Line 2"
                value={formData.addresses.permanent.addressLine2}
                onChange={(e) =>
                  setFieldValue(
                    "addresses.permanent.addressLine2",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded mb-3"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="City"
                  value={formData.addresses.permanent.city}
                  onChange={(e) =>
                    setFieldValue("addresses.permanent.city", e.target.value)
                  }
                  className="p-2 border rounded"
                />
                <input
                  placeholder="State"
                  value={formData.addresses.permanent.state}
                  onChange={(e) =>
                    setFieldValue("addresses.permanent.state", e.target.value)
                  }
                  className="p-2 border rounded"
                />
              </div>
              <input
                placeholder="Pincode"
                value={formData.addresses.permanent.pincode}
                onChange={(e) =>
                  setFieldValue("addresses.permanent.pincode", e.target.value)
                }
                className="w-full p-2 border rounded mt-3"
              />
            </div>

            <div className="border p-5 rounded">
              <h3 className="font-bold text-blue-700 mb-3">Billing Address</h3>
              <label className="inline-flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={formData.addresses.installation.sameAsBilling}
                  onChange={(e) =>
                    setFieldValue(
                      "addresses.installation.sameAsBilling",
                      e.target.checked
                    )
                  }
                  className="mr-2"
                />
                Same as Installation Address
              </label>
              {!formData.addresses.installation.sameAsBilling && (
                <>
                  <input
                    placeholder="Address Line 1"
                    value={formData.addresses.installation.addressLine1}
                    onChange={(e) =>
                      setFieldValue(
                        "addresses.installation.addressLine1",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded mt-3"
                  />
                  <input
                    placeholder="Address Line 2"
                    value={formData.addresses.installation.addressLine2}
                    onChange={(e) =>
                      setFieldValue(
                        "addresses.installation.addressLine2",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded mt-3"
                  />
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <input
                      placeholder="City"
                      value={formData.addresses.installation.city}
                      onChange={(e) =>
                        setFieldValue(
                          "addresses.installation.city",
                          e.target.value
                        )
                      }
                      className="p-2 border rounded"
                    />
                    <input
                      placeholder="State"
                      value={formData.addresses.installation.state}
                      onChange={(e) =>
                        setFieldValue(
                          "addresses.installation.state",
                          e.target.value
                        )
                      }
                      className="p-2 border rounded"
                    />
                  </div>
                  <input
                    placeholder="Pincode"
                    value={formData.addresses.installation.pincode}
                    onChange={(e) =>
                      setFieldValue(
                        "addresses.installation.pincode",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded mt-3"
                  />
                </>
              )}
            </div>
          </div>


          {/* ZONE + CUSTOM AREA - Same as Create Form */}
          {/* ZONE + SUBZONE */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t pt-6">
            {/* Left: Zone Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Zone <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedArea}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedArea(value);
                  setSelectedSubZone(""); // reset subzone
                }}
                className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="">-- Select Zone --</option>
                {zoneList.map((zone) => (
                  <option key={zone._id} value={zone._id}>
                    {zone.zoneName}
                  </option>
                ))}
              </select>
            </div>

            {/* Right: SubZone Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub Area <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSubZone}
                onChange={(e) => setSelectedSubZone(e.target.value)}
                disabled={!selectedArea}
                className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              >
                <option value="">
                  {!selectedArea ? "-- First Select Zone --" : "-- Select Sub Area --"}
                </option>
                {subZoneList.map((sz) => (
                  <option key={sz._id} value={sz._id}>
                    {sz.subZoneName || sz.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t pt-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Zone <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="">-- Select Zone --</option>
                {zoneList.map((zone) => (
                  <option key={zone._id} value={zone._id}>
                    {zone.zoneName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area
              </label>
              <input
                type="text"
                value={customArea}
                onChange={(e) => setCustomArea(e.target.value)}
                placeholder="e.g. Shivaji Nagar, Near Temple"
                className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div> */}
        </section>

        {/* Network & Package */}
        <section className="border rounded-lg">
          <div className="bg-blue-800 text-white px-6 py-3 text-lg font-semibold">
            Network & Package
          </div>
          <div className="p-6 grid md:grid-cols-2 gap-8">
            <div>
              <label className="font-semibold">Select Package*</label>
              <select
                value={formData.customer.packageDetails.packageId}
                onChange={(e) => handlePackageChange(e.target.value)}
                className="w-full p-2 border rounded mt-2"
              >
                <option value="">-- Select Package --</option>
                {packageList.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} {p.basePrice && `₹${p.basePrice}`}
                  </option>
                ))}
              </select>
              <input
                readOnly
                value={formData.customer.packageDetails.packageAmount}
                className="w-full p-2 border rounded mt-4 bg-gray-100 font-bold text-green-700"
                placeholder="Package Amount"
              />
            </div>
            <div>
              <label>Network Type</label>
              <select
                value={formData.customer.networkType}
                onChange={(e) =>
                  setFieldValue("customer.networkType", e.target.value)
                }
                className="w-full p-2 border rounded mt-2"
              >
                <option value="">Select</option>
                {networkTypes.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Documents */}
        <section className="border rounded-lg">
          <div className="bg-blue-800 text-white px-6 py-3 text-lg font-semibold">
            Documents
          </div>
          <div className="p-6">
            {formData.documents.map((doc, i) => (
              <div
                key={i}
                className="grid md:grid-cols-3 gap-4 p-4 border rounded mb-4"
              >
                <div>
                  <label>Type</label>
                  <select
                    value={doc.type}
                    onChange={(e) => updateDocumentType(i, e.target.value)}
                    className="w-full p-2 border rounded mt-1"
                  >
                    <option>Select</option>
                    {documentTypes.map((t) => (
                      <option
                        key={t}
                        value={t}
                        disabled={
                          t !== "Other" &&
                          formData.documents.some((d, j) => d.type === t && j !== i)
                        }
                      >
                        {t}
                      </option>
                    ))}
                  </select>

                  {/* Add this below the select to show the label clearly */}
                  {doc.displayLabel && (
                    <p className="text-sm text-blue-600 mt-1 font-medium">
                      {doc.displayLabel}
                    </p>
                  )}
                  {/* <label>Type</label>
                  <select
                    value={doc.type}
                    onChange={(e) => updateDocumentType(i, e.target.value)}
                    className="w-full p-2 border rounded mt-1"
                  >
                    <option>Select</option>
                    {documentTypes.map((t) => (
                      <option
                        key={t}
                        value={t}
                        disabled={formData.documents.some(
                          (d, j) => d.type === t && j !== i
                        )}
                      >
                        {t}
                      </option>
                    ))}
                  </select> */}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Upload New File</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => updateDocumentFile(i, e.target.files[0])}
                    className="w-full p-2 border rounded mt-1"
                  />

                  {/* Show filename when a new file is selected */}
                  {doc.file && (
                    <p className="text-sm mt-2 text-green-700 font-medium">
                      Selected: {doc.file.name}
                    </p>
                  )}

                  {/* Show PREVIEW for NEW image upload */}
                  {doc.preview && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-green-700 mb-1">New Preview:</p>
                      <img
                        src={doc.preview}
                        alt="New preview"
                        className="w-24 h-24 object-cover border-2 border-green-500 rounded-lg shadow"
                      />
                    </div>
                  )}

                  {/* Show CURRENT existing image */}
                  {doc.existingUrl && !doc.file && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-blue-700 mb-1">Current:</p>
                      <img
                        src={`http://localhost:5004${doc.existingUrl}`}
                        alt="Current document"
                        className="w-24 h-24 object-cover border-2 border-blue-400 rounded-lg shadow"
                      />
                    </div>
                  )}

                  {/* Show both side-by-side when replacing */}
                  {doc.existingUrl && doc.file && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">Current:</p>
                        <img
                          src={`http://localhost:5004${doc.existingUrl}`}
                          alt="Current"
                          className="w-full h-20 object-cover border rounded-lg"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-green-700 mb-1">New:</p>
                        <img
                          src={doc.preview}
                          alt="New"
                          className="w-full h-20 object-cover border-2 border-green-500 rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  {/* Show both if user is replacing an image */}
                  {doc.existingUrl && doc.file && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Current:</p>
                        <img
                          src={`http://localhost:5004${doc.existingUrl}`}
                          alt="Current"
                          className="w-full h-32 object-cover border rounded-lg"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-700 mb-2">New:</p>
                        <img
                          src={doc.preview}
                          alt="New"
                          className="w-full h-32 object-cover border-2 border-green-500 rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  {/* Message for non-image files (PDF, etc.) */}
                  {doc.file && !doc.preview && (
                    <p className="text-sm text-gray-500 mt-3 italic">
                      Preview not available for non-image files (e.g. PDF)
                    </p>
                  )}
                </div>
                {/* <div>
                  <label>New File</label>
                  <input
                    type="file"
                    onChange={(e) => updateDocumentFile(i, e.target.files[0])}
                    className="w-full p-2 border rounded mt-1"
                  />
                  {doc.existingUrl && !doc.file && (
                    <img
                      src={`http://localhost:5004${doc.existingUrl}`}
                      alt="doc"
                      className="w-32 mt-3 border rounded"
                    />
                  )}
                  {doc.file && (
                    <p className="text-green-600 text-sm mt-2">
                      New: {doc.file.name}
                    </p>
                  )}
                </div> */}
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeDocumentRow(i)}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addDocumentRow}
              className="px-5 py-2 bg-blue-700 text-white rounded"
            >
              + Add Document
            </button>
          </div>
        </section>

        {/* Additional */}
        <section className="border rounded-lg">
          <div className="bg-blue-800 text-white px-6 py-3 text-lg font-semibold">
            Additional Information
          </div>
          <div className="p-6 grid md:grid-cols-3 gap-6">
            {/* <div><label>DOB</label><input type="date" value={formData.additional.dob} onChange={e => setFieldValue("additional.dob", e.target.value)} className="w-full p-2 border rounded mt-1" /></div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>

              <div className="relative">
                <DatePicker
                  selected={
                    formData.additional.dob
                      ? new Date(formData.additional.dob)
                      : null
                  }
                  onChange={(date) =>
                    setFieldValue(
                      "additional.dob",
                      date ? date.toISOString().split("T")[0] : ""
                    )
                  }
                  dateFormat="dd/MM/yyyy"
                  placeholderText="dd/mm/yyyy"
                  className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition cursor-pointer text-base"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  maxDate={new Date()}
                  yearDropdownItemNumber={80}
                  scrollableYearDropdown
                  popperPlacement="bottom-start"
                />

                {/* Calendar Icon - Ab 100% Andar aur Perfect Center */}
                <div className="absolute inset-0 flex items-center justify-end pointer-events-none pr-3">
                  <div
                    className="pointer-events-auto cursor-pointer p-2 -mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      const input = e.currentTarget
                        .closest(".relative")
                        .querySelector("input");
                      input?.focus();
                      input?.click();
                    }}
                  >
                    {/* <svg
          className="w-5 h-5 text-gray-500 hover:text-blue-600 transition"
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
        </svg> */}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label>eKYC</label>
              <div className="mt-2 flex gap-6">
                <label>
                  <input
                    type="radio"
                    checked={formData.additional.ekYC}
                    onChange={() => setFieldValue("additional.ekYC", true)}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    checked={!formData.additional.ekYC}
                    onChange={() => setFieldValue("additional.ekYC", false)}
                  />{" "}
                  No
                </label>
              </div>
            </div>
            <div>
              <label>Status</label>
              <select
                value={formData.additional.status ? "Active" : "Inactive"}
                onChange={(e) =>
                  setFieldValue(
                    "additional.status",
                    e.target.value === "Active"
                  )
                }
                className="w-full p-2 border rounded mt-1"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <label>Description</label>
              <textarea
                value={formData.additional.description}
                onChange={(e) =>
                  setFieldValue("additional.description", e.target.value)
                }
                className="w-full p-3 border rounded h-32 mt-1"
              />
            </div>
          </div>
        </section>

        <div className="p-6 bg-gray-50 flex justify-end gap-4 border-t">
          <button
            type="button"
            onClick={() => navigate("/user/list")}
            className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Customer"}
          </button>
        </div>
      </form>
    </div>
  );
}
