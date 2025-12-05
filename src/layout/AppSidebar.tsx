import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { usePermission } from "../context/PermissionContext";
import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  FileIcon,
} from "../icons";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { permissions, loading } = usePermission();
  const location = useLocation();

  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [othersItems, setOthersItems] = useState<NavItem[]>([]);
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // ✅ Helper — Checks if any permission in a section is true
  const hasTruePermission = (group: any) =>
    group && Object.values(group).some((v) => v === true);

  // ✅ Build sidebar items dynamically from permissions 
  useEffect(() => {
    if (loading) {
      console.log("⏳ Still loading permissions...");
      return;
    }

    if (!permissions || Object.keys(permissions).length === 0) {
      console.log("🚫 No permissions found — sidebar empty");
      setNavItems([]);
      return;
    }

    console.log("🧠 Sidebar rebuilding with permissions:", permissions);

    const generatedNavItems: NavItem[] = [
      {
        icon: <GridIcon />,
        name: "Dashboard",
        subItems: [{ name: "Dashboard", path: "/", pro: false }],
      },
    ];

    // 👥 Staff
    const staffSubItems = [];
    if (permissions.staff?.listing)
      staffSubItems.push({ name: "Staff List", path: "/staff/list" });
    if (staffSubItems.length > 0)
      generatedNavItems.push({
        name: "Staff",
        icon: <ListIcon />,
        subItems: staffSubItems,
      });

    // 🏢 Reseller + LCO
    const resellerSubItems = [];
    if (permissions.reseller?.listing)
      resellerSubItems.push({ name: "Reseller List", path: "/retailer/list" });
    if (permissions.lco?.listing)
      resellerSubItems.push({ name: "LCO List", path: "/lco/list" });
    if (resellerSubItems.length > 0)
      generatedNavItems.push({
        name: "Reseller",
        icon: <ListIcon />,
        subItems: resellerSubItems,
      });

    // 📦 Package
    const packageSubItems = [];
    if (permissions.package?.listing)
      packageSubItems.push({ name: "Package List", path: "/package/list" });
    if (packageSubItems.length > 0)
      generatedNavItems.push({
        name: "Package",
        icon: <ListIcon />,
        subItems: packageSubItems,
      });

    // 👤 Customer
    const customerSubItems = [];
    if (permissions.customer?.listing)
      customerSubItems.push({ name: "Customer List", path: "/user/list" });
    if (customerSubItems.length > 0)
      generatedNavItems.push({
        name: "Customer",
        icon: <ListIcon />,
        subItems: customerSubItems,
      });

    // 🔐 Role Permission
    const rolePermissionSubItems = [];
    if (permissions.rolepermission?.listing)
      rolePermissionSubItems.push({ name: "Role List", path: "/role/list" });
    if (rolePermissionSubItems.length > 0)
      generatedNavItems.push({
        name: "Role Permission",
        icon: <ListIcon />,
        subItems: rolePermissionSubItems,
      });

    // 📊 Reports
    const reportsSubItems = [];
    if (hasTruePermission(permissions.report))
      reportsSubItems.push({ name: "Report List", path: "/report/list" });
    if (reportsSubItems.length > 0)
      generatedNavItems.push({
        name: "Reports",
        icon: <ListIcon />,
        subItems: reportsSubItems,
      });

    // 🎫 Tickets (fixed naming and all keys)

    const ticketsSubItems = [];
    if (permissions.tickets?.renewalTicketList)
      ticketsSubItems.push({ name: "Renewal Ticket", path: "/ticket/renewal" });
    if (permissions.tickets?.create)
      ticketsSubItems.push({ name: "Create Ticket", path: "/ticket/create" });
    if (permissions.tickets?.close)
      ticketsSubItems.push({ name: "Close Ticket", path: "/ticket/close" });
    if (permissions.tickets?.manageOpenList)
      ticketsSubItems.push({ name: "Manage Ticket", path: "/ticket/manage" });
    if (permissions.tickets?.allTicketList)
      ticketsSubItems.push({ name: "All Ticket", path: "/ticket/all" });
    if (permissions.tickets?.approvalTicketList)
      ticketsSubItems.push({
        name: "Approval Ticket",
        path: "/ticket/approval",
      });
    if (ticketsSubItems.length > 0)
      generatedNavItems.push({
        name: "Tickets",
        icon: <ListIcon />,
        subItems: ticketsSubItems,
      });


    // 💰 Invoice
    const invoiceSubItems = [];
    if (hasTruePermission(permissions.invoice)) {
      if (permissions.invoice?.packageRechargeList)
        invoiceSubItems.push({
          name: "Package Recharge",
          path: "/invoice/package-recharge",
        });
      if (permissions.invoice?.ottRecharge)
        invoiceSubItems.push({
          name: "OTT Recharge",
          path: "/invoice/ott-recharge",
        });
      if (permissions.invoice?.iptvRecharge)
        invoiceSubItems.push({
          name: "IPTV Recharge",
          path: "/invoice/iptv-recharge",
        });
    }
    if (invoiceSubItems.length > 0)
      generatedNavItems.push({
        name: "Invoice",
        icon: <ListIcon />,
        subItems: invoiceSubItems,
      });

    // 💳 Payment
    const paymentSubItems = [];
    if (hasTruePermission(permissions.payment)) {
      if (permissions.payment?.success)
        paymentSubItems.push({
          name: "Received Payment",
          path: "/received/payment",
        });
      if (permissions.payment?.failed)
        paymentSubItems.push({
          name: "Pending Payment",
          path: "/pending/payment",
        });
    }
    if (paymentSubItems.length > 0)
      generatedNavItems.push({
        name: "Payment",
        icon: <ListIcon />,
        subItems: paymentSubItems,
      });

    // 🧾 Price Book
    const priceBookSubItems = [];
    if (permissions.pricebook?.listing)
      priceBookSubItems.push({
        name: "Price Book List",
        path: "/pricebook/list",
      });
    if (priceBookSubItems.length > 0)
      generatedNavItems.push({
        name: "Price Book",
        icon: <FileIcon />,
        subItems: priceBookSubItems,
      });

    // ⚙️ Config
    const configSubItems = [];
    if (permissions.configlist?.listing)
      configSubItems.push({ name: "Config List", path: "/config/list" });
    if (configSubItems.length > 0)
      generatedNavItems.push({
        name: "Config List",
        icon: <FileIcon />,
        subItems: configSubItems,
      });

    // 🧩 Settings
    const settingSubItems = [];
    if (hasTruePermission(permissions.setting)) {
      if (permissions.setting?.ticketReplyList)
        settingSubItems.push({
          name: "Ticket Reply",
          path: "/setting/ticketReplyOption/List",
        });
      if (permissions.setting?.ticketResolutionList)
        settingSubItems.push({
          name: "Resolution",
          path: "/setting/resolution/List",
        });
      if (permissions.setting?.ticketCategoryList)
        settingSubItems.push({
          name: "Ticket Category",
          path: "/setting/ticketcattogry",
        });
      if (permissions.setting?.zoneList)
        settingSubItems.push({
          name: "Zone List",
          path: "/setting/zonelist",
        });
      if (permissions.setting?.hardwareList)
        settingSubItems.push({
          name: "Hardware List",
          path: "/setting/hardware/list",
        });
    }
    if (settingSubItems.length > 0)
      generatedNavItems.push({
        name: "Setting",
        icon: <FileIcon />,
        subItems: settingSubItems,
      });

    setNavItems(generatedNavItems);

    // Others (Static)
    setOthersItems([
      ...(permissions.userCms?.listing
        ? [
            {
              icon: <FileIcon />,
              name: "CMS",
              subItems: [{ name: "User CMS", path: "/signin" }],
            },
          ]
        : []),
      ...(permissions
        ? 
        [
            {
              icon: <FileIcon />,
              name: "Connection Request",
              subItems: [
                { name: "Connection Request", path: "/connection-request" },
              ],
            },
          ]
        : []
      ),  
    ]);

    // ]);
  }, [permissions, loading]);

  // ✅ Active link logic
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  // ✅ Handle open submenus based on current path
  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType as "main" | "others", index });
              submenuMatched = true;
            }
          });
        }
      });
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive, navItems, othersItems]);

  // ✅ Adjust submenu height animation
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  // ✅ Toggle submenus
  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev && prev.type === menuType && prev.index === index
        ? null
        : { type: menuType, index }
    );
  };

  // ✅ Render menu list
  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={`menu-item-icon-size ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`menu-item-icon-size ${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}

          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              // ref={(el) => (subMenuRefs.current[`${menuType}-${index}`] = el)}
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Loading sidebar...
      </div>
    );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`py-2 mx-10 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/auth-logo.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>

      {/* Menus */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {/* Main */}
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            {/* Others */}
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
