import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getUserDetails,
  updateUser,
  getAllZoneList,
  getLcoByRetailer,
  getPackagesByRole,
  getPoolIps,
} from "../../service/user";
import { getRetailer } from "../../service/retailer";
import { getStaffList } from "../../service/ticket";
import { toast } from "react-toastify";
import { getSubzonesWithZoneId, getIpacctPools } from "../../service/apiClient";

export default function CustomerUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [installerSearch, setInstallerSearch] = useState("");
  const [isDefaultInstaller, setIsDefaultInstaller] = useState(false);

  // Reference Data
  const [staff, setStaff] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [retailers, setRetailers] = useState([]);

  // Zone + Custom Area
  const [selectedArea, setSelectedArea] = useState("");
  const [customArea, setCustomArea] = useState("");

  const [subZoneList, setSubZoneList] = useState([]);
  const [selectedSubZone, setSelectedSubZone] = useState("");
  const [subZoneLoading, setSubZoneLoading] = useState(false);
  const [poolList, setPoolList] = useState([]);
  const [poolLoading, setPoolLoading] = useState(false);
  const [poolIpList, setPoolIpList] = useState([]);
  const [ipLoading, setIpLoading] = useState(false);

  // Created For States
  const [selectedCreatedFor, setSelectedCreatedFor] = useState("Self");
  const [selectedRetailerForLco, setSelectedRetailerForLco] = useState("");
  const [lcosForSelectedRetailer, setLcosForSelectedRetailer] = useState([]);
  const [selectedLco, setSelectedLco] = useState("");

  // Package States (NEW: like create form)
  const [roleSpecificPackages, setRoleSpecificPackages] = useState([]);
  const [packageLoading, setPackageLoading] = useState(false);
  const [customPackagePrice, setCustomPackagePrice] = useState("");
  const [packageSearch, setPackageSearch] = useState("");
  const [showPackageDropdown, setShowPackageDropdown] = useState(false);

  const connectionTypes = ["IIL", "FTTH", "RF", "OTHER"];
  const filteredStaff = staff.filter((s) => {
    const name = s.staffName || s.name || "";
    return name.toLowerCase().includes(installerSearch.toLowerCase());
  });
  const filteredPackages = roleSpecificPackages.filter((pkg) =>
    (pkg.name || "").toLowerCase().includes(packageSearch.toLowerCase())
  );
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
  const serviceOpted = ["intercom", "broadband", "corporate"];

  const prevBillingRef = useRef();

  const [formData, setFormData] = useState({
    customer: {
      title: "Mr",
      name: "",
      billingName: "",
      username: "",
      UserId: "",
      password: "",
      email: "",
      mobile: "",
      alternateMobile: "",
      gender: "Male",
      ipactId: "",
      connectionType: "ILL",
      selsExecutive: "",
      installationBy: [],
      installationByName: "",
      pool: "",
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
      serverType: "",
      createdFor: { id: null, type: "Self" }, // ← null by default
      customArea: "",
      packageDetails: { packageId: "", packageName: "", packageAmount: "" },
      packages: [],
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

  // LOAD SUBZONES BASED ON ZONE
  useEffect(() => {
    const loadSubZones = async () => {
      if (!selectedArea) {
        setSubZoneList([]);
        return;
      }
      setSubZoneLoading(true);
      try {
        const res = await getSubzonesWithZoneId(selectedArea);
        if (res.status) {
          setSubZoneList(res.data || []);
        } else {
          setSubZoneList([]);
        }
      } catch (err) {
        console.error("Failed to load subzones", err);
        setSubZoneList([]);
      } finally {
        setSubZoneLoading(false);
      }
    };

    loadSubZones();
  }, [selectedArea]);

  // LOAD POOLS BASED ON ZONE (AREA)
  useEffect(() => {
    const loadPools = async () => {
      if (!selectedArea || !zoneList.length) {
        setPoolList([]);
        return;
      }
      const matchedZone = zoneList.find(
        (z) => String(z._id) === String(selectedArea)
      );
      const ipacctZoneId = matchedZone?.ipacctZoneId;
      if (ipacctZoneId === undefined || ipacctZoneId === null || ipacctZoneId === "") {
        setPoolList([]);
        return;
      }
      setPoolLoading(true);
      try {
        const res = await getIpacctPools(ipacctZoneId);
        if (res?.data && Array.isArray(res.data)) {
          setPoolList(res.data);
        } else if (Array.isArray(res)) {
          setPoolList(res);
        } else {
          setPoolList([]);
        }
      } catch (err) {
        console.error("Failed to load pools from IPACCT:", err);
        setPoolList([]);
      } finally {
        setPoolLoading(false);
      }
    };

    loadPools();
  }, [selectedArea, zoneList]);

  // ================== FETCH POOL IPS ==================
  useEffect(() => {
    const loadPoolIps = async () => {
      const currentPool = formData.customer.pool;
      if (!currentPool) {
        setPoolIpList([]);
        return;
      }

      let targetPoolId = currentPool;
      if (poolList.length > 0) {
        const found = poolList.find(
          (p) =>
            String(p.id ?? p.poolId ?? p._id) === String(currentPool) ||
            String(p.name ?? p.poolName) === String(currentPool)
        );
        if (found) {
          targetPoolId = found.id ?? found.poolId ?? found._id ?? targetPoolId;
        }
      }

      setIpLoading(true);
      try {
        const res = await getPoolIps(targetPoolId, 253);
        let ips = [];
        if (Array.isArray(res?.data?.ips)) {
          ips = res.data.ips;
        } else if (res?.data?.ip) {
          ips = [res.data.ip];
        } else if (Array.isArray(res?.data)) {
          ips = res.data;
        } else if (Array.isArray(res?.ips)) {
          ips = res.ips;
        }
        setPoolIpList(ips);
      } catch (err) {
        console.error("Failed to load pool IPs:", err);
        setPoolIpList([]);
      } finally {
        setIpLoading(false);
      }
    };

    loadPoolIps();
  }, [formData.customer.pool, poolList]);

  // Load Customer + Reference Data
  useEffect(() => {
    const load = async () => {
      try {
        const [userRes, staffRes, zoneRes, retailerRes] =
          await Promise.all([
            getUserDetails(id),
            getStaffList(),
            getAllZoneList(),
            getRetailer(),
          ]);

        setStaff(staffRes?.data || []);
        setZoneList(zoneRes?.data || []);
        if (retailerRes?.status) setRetailers(retailerRes.data);
        console.log("userRes", userRes);
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
            UserId: u.generalInformation?.UserId || u.generalInformation?.userId || "",
            password: u.generalInformation?.plainPassword || u.generalInformation?.password || "",
            gender: u.generalInformation?.gender || "Male",
            email: u.generalInformation?.email || "",
            mobile: u.generalInformation?.phone || "",
            alternateMobile: u.generalInformation?.alternatePhone || "",
            ipactId: u.generalInformation?.ipactId || "",
            connectionType: u.generalInformation?.connectionType || "ILL",
            selsExecutive: getId(u.generalInformation?.selsExecutive),
            installationBy: getIds(u.generalInformation?.installationBy),
            installationByName: u.generalInformation?.installationByName || "",
            pool: u.generalInformation?.pool || "",
            ipAddress: u.generalInformation?.ipAdress || u.generalInformation?.ipAddress || "",
            ipType: u.generalInformation?.ipType || "Static IP",
            dynamicIpPool: u.networkInformation?.dynamicIpPool || "",
            serialNo: u.generalInformation?.serialNo || "",
            macId: u.generalInformation?.macId || "",
            serviceOpted: u.generalInformation?.serviceOpted || "",
            stbNo: u.generalInformation?.stbNo || "",
            vcNo: u.generalInformation?.vcNo || "",
            circuitId: u.generalInformation?.circuitId || "",
            networkType: u.networkInformation?.networkType || "",
            serverType: u.generalInformation?.serverType || "",
            aadharNo: u.generalInformation?.adharNo || "",
            gstNo: u.generalInformation?.gst || "",
            panNumber: u.generalInformation?.panNumber || "",
            createdFor: {
              type: createdForType,
              id: getId(u.createdFor?.id),
            },
            packages: (() => {
              if (Array.isArray(u.packageInfomation) && u.packageInfomation.length > 0) {
                return u.packageInfomation.map((p) => ({
                  packageId: getId(p.packageId?._id || p.packageId),
                  packageName: p.packageId?.name || p.packageName || "",
                  packageAmount: p.price || p.packageAmount || "0",
                  originalPrice: p.packageId?.price || p.packageId?.basePrice || p.price || "0",
                }));
              } else if (u.packageInfomation?.packageId) {
                return [{
                  packageId: getId(u.packageInfomation.packageId?._id || u.packageInfomation.packageId),
                  packageName: u.packageInfomation.packageId?.name || u.packageInfomation.packageName || "",
                  packageAmount: u.packageInfomation.price || "0",
                  originalPrice: u.packageInfomation.packageId?.price || u.packageInfomation.price || "0",
                }];
              }
              return [];
            })(),
            packageDetails: {
              packageId: getId(u.packageInfomation?.packageId || (Array.isArray(u.packageInfomation) && u.packageInfomation[0]?.packageId)),
              packageName: u.packageInfomation?.name || (Array.isArray(u.packageInfomation) && u.packageInfomation[0]?.packageName) || "",
              packageAmount: u.packageInfomation?.price || (Array.isArray(u.packageInfomation) && u.packageInfomation[0]?.price) || "",
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
              });
            });
            return docs;
          })(),
        };

        setFormData(loadedData);
        if (u.generalInformation?.installationByName) {
          setIsDefaultInstaller(true);
        }

        // Pre-fill Zone & Custom Area
        setSelectedArea(getId(u.addressDetails?.area) || "");
        setSelectedSubZone(getId(u.addressDetails?.subZone) || "");
        setCustomArea(u.generalInformation?.customArea || "");
        setFieldValue(
          "customer.customArea",
          u.generalInformation?.customArea || ""
        );

        // Set custom price (NEW)
        setCustomPackagePrice(String(loadedData.customer.packageDetails.packageAmount || ""));

        prevBillingRef.current = loadedData.addresses.billing;
      } catch (err) {
        toast.error("Failed to load customer data");
        console.error(err);
      }
    };
    load();
  }, [id]);

  // NEW: Fetch packages based on role (like create)
  const fetchPackagesForRole = async () => {
    const type = formData.customer.createdFor.type || "Admin"; // Default to Admin like Create
    const targetId = formData.customer.createdFor.id || "";

    // Ensure valid roles are sent
    const validRoles = ["Admin", "reseller", "lco", "Self"];
    if (!validRoles.includes(type)) {
      console.error("Invalid role type:", type);
      setRoleSpecificPackages([]);
      return;
    }

    if ((type === "reseller" || type === "lco") && !targetId) {
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
        setRoleSpecificPackages(res.data?.packages || []);
      } else {
        setRoleSpecificPackages([]);
      }
    } catch (err) {
      console.error("Error fetching packages:", err);
      setRoleSpecificPackages([]);
    } finally {
      setPackageLoading(false);
    }
  };

  // NEW: Auto refresh packages
  useEffect(() => {
    fetchPackagesForRole();
  }, [
    formData.customer.createdFor.type,
    formData.customer.createdFor.id,
  ]);

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

  // Handle Package Change (UPDATED: like create + custom price)
  // Handle Multi-Package Selection
  const handleAddPackage = (pkgId, overridePrice) => {
    const pkg = roleSpecificPackages.find((p) => p._id === pkgId);
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

  // Document Functions
  // Add a new document row
  const addDocumentRow = () =>
    setFormData((prev) => ({
      ...prev,
      documents: [
        ...prev.documents,
        { type: "", files: [], previews: [], existingImage: null, existingUrl: null },
      ],
    }));

  const updateDocumentType = (i, v) => {
    const d = [...formData.documents];
    d[i].type = v;
    setFormData((prev) => ({ ...prev, documents: d }));
  };


  const getDocumentUrl = (docPath) => {
    if (!docPath) return "";
    if (docPath.startsWith("http://") || docPath.startsWith("https://") || docPath.startsWith("blob:")) {
      return docPath;
    }
    const clean = docPath.replace(/\\/g, "/").replace(/^public\//, "").replace(/^\//, "");
    const base =
      import.meta.env.VITE_IMAGE_URL ||
      (import.meta.env.VITE_BASE_URL
        ? import.meta.env.VITE_BASE_URL.replace(/\/api\/admin\/?$/, "")
        : "") ||
      "http://localhost:3000";
    return `${base.replace(/\/$/, "")}/${clean}`;
  };

  const updateDocumentFile = (i, newFiles) => {
    if (!newFiles || newFiles.length === 0) return;
    const fileArray = Array.from(newFiles);
    const previews = fileArray.map((f) =>
      f.type.startsWith("image/") ? URL.createObjectURL(f) : ""
    );
    setFormData((prev) => {
      const d = [...prev.documents];
      (d[i].previews || []).forEach((p) => p && URL.revokeObjectURL(p));
      d[i] = { ...d[i], files: fileArray, previews, existingImage: null, existingUrl: null };
      return { ...prev, documents: d };
    });
  };

  const removeDocumentRow = (i) =>
    setFormData((prev) => {
      const d = [...prev.documents];
      // Clean up preview URL to prevent memory leak
      (d[i]?.previews || []).forEach((p) => p && URL.revokeObjectURL(p));
      // Remove both new and existing documents
      return {
        ...prev,
        documents: d.filter((_, idx) => idx !== i),
      };
    });

  // Handle Created For change - NEVER send empty string
  const handleCreatedForChange = (type) => {
    // Update UI
    setSelectedCreatedFor(type);

    // Reset dependent
    setSelectedRetailerForLco("");
    setSelectedLco("");

    // Clear packages & price
    setRoleSpecificPackages([]);
    setCustomPackagePrice("");

    // Update formData
    setFieldValue("customer.createdFor.type", type);
    setFieldValue("customer.createdFor.id", null); // ← Always null when changing
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // 1. Name
    if (!formData.customer.name?.trim()) {
      toast.error("Name is required");
      return;
    }

    // 2. User ID
    if (!formData.customer.UserId?.trim()) {
      toast.error("User ID is required");
      return;
    }

    // 3. Email
    if (!formData.customer.email?.trim()) {
      toast.error("Email is required");
      return;
    }

    // 4. Mobile No
    if (!formData.customer.mobile?.trim()) {
      toast.error("Mobile Number is required");
      return;
    } else if (formData.customer.mobile.trim().length !== 10) {
      toast.error("Mobile Number must be 10 digits");
      return;
    }

    // 5. Password (commented out - optional on update)
    // if (!formData.customer.password?.trim()) {
    //   toast.error("Password is required");
    //   return;
    // }

    // 6. Date of Birth
    if (!formData.additional.dob?.trim()) {
      toast.error("Date of Birth is required");
      return;
    }

    // 7. Connection Type
    if (!formData.customer.connectionType?.trim()) {
      toast.error("Connection Type is required");
      return;
    }

    // 8. Installation By
    const hasInstaller =
      (Array.isArray(formData.customer.installationBy) && formData.customer.installationBy.length > 0) ||
      Boolean(formData.customer.installationByName?.trim()) ||
      Boolean(isDefaultInstaller);
    if (!hasInstaller) {
      toast.error("Installation By is required");
      return;
    }

    // 9. Service Opted
    if (!formData.customer.serviceOpted?.trim()) {
      toast.error("Service Opted is required");
      return;
    }

    // 10, 11, 12, 13. Address Line 1, City, State, Pincode
    if (!formData.addresses.billing.addressLine1?.trim()) {
      toast.error("Address Line 1 is required");
      return;
    }
    if (!formData.addresses.billing.city?.trim()) {
      toast.error("City is required");
      return;
    }
    if (!formData.addresses.billing.state?.trim()) {
      toast.error("State is required");
      return;
    }
    if (!formData.addresses.billing.pincode?.trim()) {
      toast.error("Pincode is required");
      return;
    }

    // 14. Area
    if (!selectedArea) {
      toast.error("Area is required");
      return;
    }

    // 15. Zone
    if (!selectedSubZone) {
      toast.error("Zone is required");
      return;
    }

    // 16. Select Package
    if (!formData.customer.packages || formData.customer.packages.length === 0) {
      toast.error("At least one package is mandatory");
      return;
    }

    setLoading(true);

    const payload = new FormData();

    // Customer, addresses, additional
    const cleanCustomer = {
      ...formData.customer,
      ipAdress: formData.customer.ipAddress,
      pool: formData.customer.pool || "",
      createdFor: {
        type: formData.customer.createdFor.type,
        id: formData.customer.createdFor.id || null,
      },
      customArea: customArea || "",

      // Use custom price if set
      packages: formData.customer.packages || [],
      packageDetails: (formData.customer.packages && formData.customer.packages[0]) || formData.customer.packageDetails,
    };

    // If password is empty, delete it so backend retains existing password
    if (!cleanCustomer.password || !cleanCustomer.password.trim()) {
      delete cleanCustomer.password;
    }

    payload.append("customer", JSON.stringify(cleanCustomer));
    payload.append("pool", formData.customer.pool || "");
    payload.append("addresses", JSON.stringify(formData.addresses));
    payload.append("additional", JSON.stringify(formData.additional));
    payload.append("area", selectedArea || "");
    payload.append("subZone", selectedSubZone || "");
    payload.append("customArea", customArea || "");

    // --- NEW FILES ---
    // Prepare new documents for upload
    const newDocuments = formData.documents.filter(doc => doc.files && doc.files.length > 0);
    newDocuments.forEach((doc) => {
      doc.files.forEach((file) => {
        payload.append("documents", file);
        payload.append("documentTypes[]", doc.type || "Other");
      });
    });

    // Prepare existing documents to keep

    const keptFilenames = formData.documents
      .filter(doc => doc.existingImage && !(doc.files && doc.files.length > 0))
      .map(doc => doc.existingImage.split("/").pop())
      .filter(Boolean);
    payload.append("existingDocuments", JSON.stringify(keptFilenames));

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
              <label>Name <span className="text-red-500">*</span></label>
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
              <label>Email <span className="text-red-500">*</span></label>
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
              <label>User ID <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.customer.UserId}
                onChange={(e) =>
                  setFieldValue("customer.UserId", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
                placeholder="User ID"
              />
            </div>
            {/* <div>
              <label>Password <span className="text-red-500">*</span></label>
              <input
                type="password"
                value={formData.customer.password}
                onChange={(e) =>
                  setFieldValue("customer.password", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
                placeholder="Password"
              />
            </div> */}
            <div>
              <label>Gender</label>
              <select
                value={formData.customer.gender || "Male"}
                onChange={(e) =>
                  setFieldValue("customer.gender", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label>Mobile No <span className="text-red-500">*</span></label>
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

            {/* Aadhar Number */}
            <div>
              <label>Aadhar Number</label>
              <input
                value={formData.customer.aadharNo}
                onChange={(e) => setFieldValue("customer.aadharNo", e.target.value)}
                className="mt-1 p-2 border rounded w-full"
                placeholder="Aadhar Number"
              />
            </div>

            {/* GST Number */}
            <div>
              <label>GST Number</label>
              <input
                value={formData.customer.gstNo}
                onChange={(e) => setFieldValue("customer.gstNo", e.target.value)}
                className="mt-1 p-2 border rounded w-full"
                placeholder="GST Number"
              />
            </div>

            {/* PAN Number */}
            <div>
              <label>PAN Number</label>
              <input
                value={formData.customer.panNumber}
                onChange={(e) => setFieldValue("customer.panNumber", e.target.value)}
                className="mt-1 p-2 border rounded w-full"
                placeholder="PAN Number"
              />
            </div>
            <div>
              <label>IPACCT ID/H8</label>
              <input
                value={formData.customer.ipactId}
                onChange={(e) =>
                  setFieldValue("customer.ipactId", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label>Connection Type <span className="text-red-500">*</span></label>
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
              <label>Server Type</label>
              <input
                type="text"
                value={formData.customer.serverType}
                onChange={(e) =>
                  setFieldValue("customer.serverType", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
                placeholder="e.g. NAS-01, NAS-02"
              />
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
                Installation By <span className="text-red-500">*</span>
              </label>
              {/* CLEAN & MINIMAL MULTI-SELECT DROPDOWN */}
              <div className="relative">
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full p-3 border rounded-lg cursor-pointer bg-white hover:border-blue-500 transition flex justify-between items-center min-h-[42px]"
                >
                  <div className="flex flex-wrap gap-2">
                    {(isDefaultInstaller || formData.customer.installationByName) && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md">
                        Other {formData.customer.installationByName ? `(${formData.customer.installationByName})` : ""}
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
                    {formData.customer.installationBy.length > 0 &&
                      formData.customer.installationBy.map((id) => {
                        const p = staff.find((s) => s._id === id);
                        return p ? (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md"
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
                      {(!installerSearch || "other".includes(installerSearch.toLowerCase())) && (
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
                              if (!nextState) {
                                setFieldValue("customer.installationByName", "");
                              }
                            }}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="font-semibold text-sm text-gray-800">
                            Other
                          </span>
                        </label>
                      )}

                      {/* Staff options */}
                      {filteredStaff.length > 0 ? (
                        filteredStaff.map((s) => {
                          const checked =
                            formData.customer.installationBy.includes(s._id);
                          return (
                            <label
                              key={s._id}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition"
                              onMouseDown={(e) => e.preventDefault()}
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
                                  if (updated.length > 0) {
                                  }
                                }}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="font-medium text-sm">{s.staffName || s.name}</span>
                            </label>
                          );
                        })
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          {installerSearch ? "No staff found" : "No staff available"}
                        </div>
                      )}
                    </div>
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
                      setFieldValue(
                        "customer.installationByName",
                        name
                      );
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
              <label>ONT/ONU MAC ID</label>
              <input
                value={formData.customer.serialNo}
                onChange={(e) =>
                  setFieldValue("customer.serialNo", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label>Wi-Fi Router MAC ID</label>
              <input
                value={formData.customer.macId}
                onChange={(e) =>
                  setFieldValue("customer.macId", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            {/* <div>
              <label>Service Opted</label>
              <input
                value={formData.customer.serviceOpted}
                onChange={(e) =>
                  setFieldValue("customer.serviceOpted", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
              />
            </div> */}
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
            </div>
            <div>
              <label>Android Box No.</label>
              <input
                value={formData.customer.stbNo}
                onChange={(e) =>
                  setFieldValue("customer.stbNo", e.target.value)
                }
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label>RF MAC ID</label>
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

          {/* ZONE + SUBZONE */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t pt-6 p-4">
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
                  setSelectedSubZone(""); // Reset subzone when zone changes
                  setFieldValue("customer.pool", ""); // Reset pool when zone changes
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
                className={`mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${(!selectedArea || subZoneLoading) ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                required
                disabled={!selectedArea || subZoneLoading}
              >
                <option value="">
                  {subZoneLoading ? "Loading..." : !selectedArea ? "-- First Select Zone --" : "-- Select Sub Area --"}
                </option>
                {subZoneList.map((sz) => (
                  <option key={sz._id} value={sz._id}>
                    {sz.name || sz.subZoneName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* POOL & IP ADDRESS */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 pt-0">
            {/* Left: Pool Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pool
              </label>
              <select
                value={formData.customer.pool || ""}
                onChange={(e) => {
                  const newPool = e.target.value;
                  setFieldValue("customer.pool", newPool);
                  if (newPool !== formData.customer.pool) {
                    setFieldValue("customer.ipAddress", "");
                  }
                }}
                className={`mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  !selectedArea || poolLoading ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                }`}
                disabled={!selectedArea || poolLoading}
              >
                <option value="">
                  {poolLoading
                    ? "-- Loading Pools... --"
                    : !selectedArea
                    ? "-- First Select Zone --"
                    : poolList.length === 0
                    ? "-- No Pools Available --"
                    : "-- Select Pool --"}
                </option>
                {formData.customer.pool &&
                  !poolList.some((p) => String(p.id ?? p.poolId ?? p._id) === String(formData.customer.pool)) && (
                    <option value={formData.customer.pool}>
                      {formData.customer.pool}
                    </option>
                  )}
                {poolList.map((pool) => {
                  const pId = pool.id ?? pool.poolId ?? pool._id;
                  const pName = pool.name ?? pool.poolName;
                  return (
                    <option key={pId || pName} value={pId}>
                      {pName}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Right: IP Address Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IP Address
              </label>
              <select
                value={formData.customer.ipAddress || ""}
                onChange={(e) =>
                  setFieldValue("customer.ipAddress", e.target.value)
                }
                disabled={!formData.customer.pool || ipLoading}
                className={`mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  !formData.customer.pool || ipLoading
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-white"
                }`}
              >
                <option value="">
                  {ipLoading
                    ? "-- Loading IPs... --"
                    : !formData.customer.pool
                    ? "-- First Select Pool --"
                    : poolIpList.length === 0
                    ? "-- No Free IPs Available --"
                    : "-- Select IP Address --"}
                </option>
                {formData.customer.ipAddress &&
                  !poolIpList.some(item => item.ip === formData.customer.ipAddress) && (
                    <option value={formData.customer.ipAddress}>
                      {formData.customer.ipAddress} (Current)
                    </option>
                  )}
                {poolIpList.map((item) => (
                  <option 
                    key={item.ip} 
                    value={item.ip}
                    disabled={!item.available && item.ip !== formData.customer.ipAddress}
                    style={{ color: (!item.available && item.ip !== formData.customer.ipAddress) ? 'red' : 'inherit' }}
                  >
                    {item.ip} {(!item.available && item.ip !== formData.customer.ipAddress) ? "(Unavailable)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Package Details */}
        <section className="border rounded-lg">
          <div className="bg-blue-800 text-white px-6 py-3 text-lg font-semibold">
            Package Details
          </div>
          <div className="p-6 space-y-6">
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
                    className={`w-full sm:w-auto px-5 py-2.5 font-semibold rounded-lg text-sm transition flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm ${!packageSearch || packageLoading
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
                          className={'px-3 py-1.5 text-xs font-medium rounded transition ' + (
                            formData.customer.packages.length <= 1
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          )}
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
                    <option value="">Select</option>
                    {documentTypes.map((t) => (
                      <option
                        key={t}
                        value={t}
                      >
                        {t}
                      </option>
                    ))}
                  </select>

                  {/* Show displayLabel if multiple */}
                  {doc.displayLabel && (
                    <p className="text-sm text-blue-600 mt-1 font-medium">
                      {doc.displayLabel}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Upload New File(s)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    onChange={(e) => updateDocumentFile(i, e.target.files)}
                    className="w-full p-2 border rounded mt-1"
                  />

                  {/* Show selected filenames */}
                  {doc.files && doc.files.length > 0 && (
                    <div className="mt-2 space-y-0.5">
                      {doc.files.map((f, fi) => (
                        <p key={fi} className="text-sm text-green-700 font-medium">
                          {fi + 1}. {f.name}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Preview for NEW images */}
                  {doc.previews && doc.previews.some(Boolean) && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-green-700 mb-1">New Preview(s):</p>
                      <div className="flex flex-wrap gap-2">
                        {doc.previews.map((prev, pi) =>
                          prev ? (
                            <img
                              key={pi}
                              src={prev}
                              alt={"New preview " + (pi + 1)}
                              className="w-20 h-20 object-cover border-2 border-green-500 rounded-lg shadow"
                            />
                          ) : null
                        )}
                      </div>
                    </div>
                  )}

                  {/* Current existing image (if not replaced) */}
                  {doc.existingUrl && !(doc.files && doc.files.length > 0) && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-blue-700 mb-1">Current:</p>
                      <img
                        src={getDocumentUrl(doc.existingUrl)}
                        alt="Current document"
                        className="w-24 h-24 object-cover border-2 border-blue-400 rounded-lg shadow"
                      />
                    </div>
                  )}

                  {/* Message for non-image */}
                  {doc.files && doc.files.length > 0 && !doc.previews?.some(Boolean) && (
                    <p className="text-sm text-gray-500 mt-3 italic">
                      Preview not available for non-image files (e.g. PDF)
                    </p>
                  )}
                </div>
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

                {/* Calendar Icon */}
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
                    {/* SVG icon here if needed */}
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

