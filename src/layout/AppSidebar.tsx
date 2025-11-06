// import { useCallback, useEffect, useRef, useState } from "react";
// import { Link, useLocation } from "react-router";

// // Assume these icons are imported from an icon library
// import {
//   ChevronDownIcon,
//   GridIcon,
//   HorizontaLDots,
//   ListIcon,
//   FileIcon
// } from "../icons";
// import { useSidebar } from "../context/SidebarContext";

// type NavItem = {
//   name: string;
//   icon: React.ReactNode;
//   path?: string;
//   subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
// };

// const navItems: NavItem[] = [
//   {
//     icon: <GridIcon />,
//     name: "Dashboard",
//     subItems: [{ name: "dashboard", path: "/", pro: false }],
//   },
//   // {
//   //   icon: <CalenderIcon />,
//   //   name: "Calendar",
//   //   path: "/calendar",
//   // // },
//   // {
//   //   icon: <UserCircleIcon />,
//   //   name: "User Profile",
//   //   path: "/profile",
//   // },
//   {
//     name: "Users",
//     icon: <ListIcon />,
//     subItems: [{ name: "User List", path: "/user-list", pro: false }],
//   },
//   {
//     name: "Staff",
//     icon: <ListIcon />,
//     subItems: [{ name: "staff List", path: "/staff/list", pro: false }],
//   },
//     {
//     name: "Reseller",
//     icon: <ListIcon />,
//     subItems: [{ name: "Retailer List", path: "/retailer/list", pro: false }],
//   },
//    {
//     name: "Lco",
//     icon: <ListIcon />,
//     subItems: [{ name: "Lco List", path: "/lco/list", pro: false }],
//   },
//    {
//     name: "Packege",
//     icon: <ListIcon />,
//     subItems: [{ name: "Package List", path: "/package/list", pro: false }],
//   },
//    {
//     name: "Customer",
//     icon: <ListIcon />,
//     subItems: [{ name: "Customer List", path: "/user/list", pro: false }],
//   },
//    {
//     name: "Role Permission",
//     icon: <ListIcon />,
//     subItems: [{ name: "Role List", path: "/role/list", pro: false }],
//   },
//    {
//     name: "Tickets",
//     icon: <ListIcon />,
//     subItems: [{ name: "Ticket List", path: "/ticket/list", pro: false },
//       {name: "Create Ticket", path: "/ticket/create", pro: false},
//          {name: "Close Ticket", path: "/ticket/close", pro: false},
//            {name: "Manage Ticket", path: "/ticket/manage", pro: false},
//             {name: "All Ticket", path: "/ticket/all", pro: false},
//               {name: "Approvel Ticket", path: "/ticket/approvel", pro: false},
//     ],
//   },
//   {name:"Price Book",
//     icon:<FileIcon/>,
//     subItems:[{name:"Price Book List",path:"/pricebook/list",pro:false}]
//   },
//    {name:"Setting",
//     icon:<FileIcon/>,
//     subItems:[{name:"jon",path:"/setting/jon",pro:false},
// {name:"Ticket Cattogry",path:"/setting/ticketcattogry",pro:false},
// {name:"Zone List",path:"/setting/zonelist",pro:false}
//     ]
//   }

//   // {
//   //   name: "Forms",
//   //   icon: <ListIcon />,
//   //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
//   // },
//   // {
//   //   name: "Tables",
//   //   icon: <TableIcon />,
//   //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
//   // },
//   // {
//   //   name: "Pages",
//   //   icon: <PageIcon />,
//   //   subItems: [
//   //     { name: "Blank Page", path: "/blank", pro: false },
//   //     { name: "404 Error", path: "/error-404", pro: false },
//   //   ],
//   // },
// ];

// const othersItems: NavItem[] = [
//   {
//     icon: <FileIcon />,
//     name: "CMS",
//     subItems: [
//       { name: "User CMS", path: "/signin", pro: false },
//       // { name: "Sign Up", path: "/signup", pro: false },
//     ],
//   },
//   // {
//   //   icon: <PieChartIcon />,
//   //   name: "Charts",
//   //   subItems: [
//   //     { name: "Line Chart", path: "/line-chart", pro: false },
//   //     { name: "Bar Chart", path: "/bar-chart", pro: false },
//   //   ],
//   // },
//   // {
//   //   icon: <BoxCubeIcon />,
//   //   name: "UI Elements",
//   //   subItems: [
//   //     { name: "Alerts", path: "/alerts", pro: false },
//   //     { name: "Avatar", path: "/avatars", pro: false },
//   //     { name: "Badge", path: "/badge", pro: false },
//   //     { name: "Buttons", path: "/buttons", pro: false },
//   //     { name: "Images", path: "/images", pro: false },
//   //     { name: "Videos", path: "/videos", pro: false },
//   //   ],
//   // },
//   // {
//   //   icon: <PlugInIcon />,
//   //   name: "Authentication",
//   //   subItems: [
//   //     { name: "Sign In", path: "/signin", pro: false },
//   //     { name: "Sign Up", path: "/signup", pro: false },
//   //   ],
//   // },
// ];

// const AppSidebar: React.FC = () => {
//   const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
//   const location = useLocation();

//   const [openSubmenu, setOpenSubmenu] = useState<{
//     type: "main" | "others";
//     index: number;
//   } | null>(null);
//   const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
//     {}
//   );
//   const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

//   // const isActive = (path: string) => location.pathname === path;
//   const isActive = useCallback(
//     (path: string) => location.pathname === path,
//     [location.pathname]
//   );

//   useEffect(() => {
//     let submenuMatched = false;
//     ["main", "others"].forEach((menuType) => {
//       const items = menuType === "main" ? navItems : othersItems;
//       items.forEach((nav, index) => {
//         if (nav.subItems) {
//           nav.subItems.forEach((subItem) => {
//             if (isActive(subItem.path)) {
//               setOpenSubmenu({
//                 type: menuType as "main" | "others",
//                 index,
//               });
//               submenuMatched = true;
//             }
//           });
//         }
//       });
//     });
//     if (!submenuMatched) {
//       setOpenSubmenu(null);
//     }
//   }, [location, isActive]);
//   useEffect(() => {
//     if (openSubmenu !== null) {
//       const key = `${openSubmenu.type}-${openSubmenu.index}`;
//       if (subMenuRefs.current[key]) {
//         setSubMenuHeight((prevHeights) => ({
//           ...prevHeights,
//           [key]: subMenuRefs.current[key]?.scrollHeight || 0,
//         }));
//       }
//     }
//   }, [openSubmenu]);

//   const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
//     setOpenSubmenu((prevOpenSubmenu) => {
//       if (
//         prevOpenSubmenu &&
//         prevOpenSubmenu.type === menuType &&
//         prevOpenSubmenu.index === index
//       ) {
//         return null;
//       }
//       return { type: menuType, index };
//     });
//   };
//   const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
//     <ul className="flex flex-col gap-4">
//       {items.map((nav, index) => (
//         <li key={nav.name}>
//           {nav.subItems ? (
//             <button
//               onClick={() => handleSubmenuToggle(index, menuType)}
//               className={`menu-item group ${
//                 openSubmenu?.type === menuType && openSubmenu?.index === index
//                   ? "menu-item-active"
//                   : "menu-item-inactive"
//               } cursor-pointer ${
//                 !isExpanded && !isHovered
//                   ? "lg:justify-center"
//                   : "lg:justify-start"
//               }`}
//             >
//               <span
//                 className={`menu-item-icon-size  ${
//                   openSubmenu?.type === menuType && openSubmenu?.index === index
//                     ? "menu-item-icon-active"
//                     : "menu-item-icon-inactive"
//                 }`}
//               >
//                 {nav.icon}
//               </span>
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <span className="menu-item-text">{nav.name}</span>
//               )}
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <ChevronDownIcon
//                   className={`ml-auto w-5 h-5 transition-transform duration-200 ${
//                     openSubmenu?.type === menuType &&
//                     openSubmenu?.index === index
//                       ? "rotate-180 text-brand-500"
//                       : ""
//                   }`}
//                 />
//               )}
//             </button>
//           ) : (
//             nav.path && (
//               <Link
//                 to={nav.path}
//                 className={`menu-item group ${
//                   isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
//                 }`}
//               >
//                 <span
//                   className={`menu-item-icon-size ${
//                     isActive(nav.path)
//                       ? "menu-item-icon-active"
//                       : "menu-item-icon-inactive"
//                   }`}
//                 >
//                   {nav.icon}
//                 </span>
//                 {(isExpanded || isHovered || isMobileOpen) && (
//                   <span className="menu-item-text">{nav.name}</span>
//                 )}
//               </Link>
//             )
//           )}
//           {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
//             <div
//               ref={(el) => {
//                 subMenuRefs.current[`${menuType}-${index}`] = el;
//               }}
//               className="overflow-hidden transition-all duration-300"
//               style={{
//                 height:
//                   openSubmenu?.type === menuType && openSubmenu?.index === index
//                     ? `${subMenuHeight[`${menuType}-${index}`]}px`
//                     : "0px",
//               }}
//             >
//               <ul className="mt-2 space-y-1 ml-9">
//                 {nav.subItems.map((subItem) => (
//                   <li key={subItem.name}>
//                     <Link
//                       to={subItem.path}
//                       className={`menu-dropdown-item ${
//                         isActive(subItem.path)
//                           ? "menu-dropdown-item-active"
//                           : "menu-dropdown-item-inactive"
//                       }`}
//                     >
//                       {subItem.name}
//                       <span className="flex items-center gap-1 ml-auto">
//                         {subItem.new && (
//                           <span
//                             className={`ml-auto ${
//                               isActive(subItem.path)
//                                 ? "menu-dropdown-badge-active"
//                                 : "menu-dropdown-badge-inactive"
//                             } menu-dropdown-badge`}
//                           >
//                             new
//                           </span>
//                         )}
//                         {subItem.pro && (
//                           <span
//                             className={`ml-auto ${
//                               isActive(subItem.path)
//                                 ? "menu-dropdown-badge-active"
//                                 : "menu-dropdown-badge-inactive"
//                             } menu-dropdown-badge`}
//                           >
//                             pro
//                           </span>
//                         )}
//                       </span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </li>
//       ))}
//     </ul>
//   );

//   return (
//     <aside
//       className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
//         ${
//           isExpanded || isMobileOpen
//             ? "w-[290px]"
//             : isHovered
//             ? "w-[290px]"
//             : "w-[90px]"
//         }
//         ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
//         lg:translate-x-0`}
//       onMouseEnter={() => !isExpanded && setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div
//         className={`py-8 flex ${
//           !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
//         }`}
//       >
//         <Link to="/">
//           {isExpanded || isHovered || isMobileOpen ? (
//             <>
//               <img
//                 className="dark:hidden"
//                 src="/images/logo/logo.svg"
//                 alt="Logo"
//                 width={150}
//                 height={40}
//               />
//               <img
//                 className="hidden dark:block"
//                 src="/images/logo/logo-dark.svg"
//                 alt="Logo"
//                 width={150}
//                 height={40}
//               />
//             </>
//           ) : (
//             <img
//               src="/images/logo/logo-icon.svg"
//               alt="Logo"
//               width={32}
//               height={32}
//             />
//           )}
//         </Link>
//       </div>
//       <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
//         <nav className="mb-6">
//           <div className="flex flex-col gap-4">
//             <div>
//               <h2
//                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                   !isExpanded && !isHovered
//                     ? "lg:justify-center"
//                     : "justify-start"
//                 }`}
//               >
//                 {isExpanded || isHovered || isMobileOpen ? (
//                   "Menu"
//                 ) : (
//                   <HorizontaLDots className="size-6" />
//                 )}
//               </h2>
//               {renderMenuItems(navItems, "main")}
//             </div>
//             <div className="">
//               <h2
//                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                   !isExpanded && !isHovered
//                     ? "lg:justify-center"
//                     : "justify-start"
//                 }`}
//               >
//                 {isExpanded || isHovered || isMobileOpen ? (
//                   "Others"
//                 ) : (
//                   <HorizontaLDots />
//                 )}
//               </h2>
//               {renderMenuItems(othersItems, "others")}
//             </div>
//           </div>
//         </nav>
//       </div>
//     </aside>
//   );
// };

// export default AppSidebar;

import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
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

  // Fetch permissions from localStorage and generate menu items dynamically
  useEffect(() => {
    const rolePermission = JSON.parse(
      localStorage.getItem("rolePermission") || "{}"
    );
    console.log(rolePermission, " t his is the role permission");
    // Base structure for navItems
    const generatedNavItems: NavItem[] = [
      {
        icon: <GridIcon />,
        name: "Dashboard",
        subItems: [{ name: "dashboard", path: "/", pro: false }],
      },
    ];
    // Users menu
    // const usersSubItems = [];
    // if (rolePermission.users?.ban !== false) { // Show if not explicitly false
    //   usersSubItems.push({ name: "User List", path: "/user-list", pro: false });
    // }
    // if (usersSubItems.length > 0) {
    //   generatedNavItems.push({
    //     name: "Users",
    //     icon: <ListIcon />,
    //     subItems: usersSubItems,
    //   });
    // }

    // Staff menu (assume permission key "staff.listing")
    const staffSubItems = [];
    if (rolePermission.staff?.listing !== false) {
      staffSubItems.push({
        name: "staff List",
        path: "/staff/list",
        pro: false,
      });
    }
    if (staffSubItems.length > 0) {
      generatedNavItems.push({
        name: "Staff",
        icon: <ListIcon />,
        subItems: staffSubItems,
      });
    }

    // Reseller menu
    const resellerSubItems = [];
    if (rolePermission.retailer?.listing !== false) {
      resellerSubItems.push({
        name: "Reseller/Lco List",
        path: "/retailer/list",
        pro: false,
      });
    }
    if (resellerSubItems.length > 0) {
      generatedNavItems.push({
        name: "Reseller/Lco",
        icon: <ListIcon />,
        subItems: resellerSubItems,
      });
    }
    // Lco menu (assume permission key "lco.listing")
    // const lcoSubItems = [];
    // if (rolePermission.lco?.listing !== false) {
    //   lcoSubItems.push({ name: "Lco List", path: "/lco/list", pro: false });
    // }
    // if (lcoSubItems.length > 0) {
    //   generatedNavItems.push({
    //     name: "Lco",
    //     icon: <ListIcon />,
    //     subItems: lcoSubItems,
    //   });
    // }
    // Package menu
    const packageSubItems = [];
    if (rolePermission.package?.listing !== false) {
      packageSubItems.push({
        name: "Package List",
        path: "/package/list",
        pro: false,
      });
    }
    if (packageSubItems.length > 0) {
      generatedNavItems.push({
        name: "Packege",
        icon: <ListIcon />,
        subItems: packageSubItems,
      });
    }

    // Customer menu (assume permission key "customer.listing")
    const customerSubItems = [];
    if (rolePermission.customer?.listing !== false) {
      customerSubItems.push({
        name: "Customer List",
        path: "/user/list",
        pro: false,
      });
    }
    if (customerSubItems.length > 0) {
      generatedNavItems.push({
        name: "Customer",
        icon: <ListIcon />,
        subItems: customerSubItems,
      });
    }

    // Role Permission menu
    const rolePermissionSubItems = [];
    if (rolePermission.rolePermission?.listing !== false) {
      rolePermissionSubItems.push({
        name: "Role List",
        path: "/role/list",
        pro: false,
      });
    }
    if (rolePermissionSubItems.length > 0) {
      generatedNavItems.push({
        name: "Role Permission",
        icon: <ListIcon />,
        subItems: rolePermissionSubItems,
      });
    }

    // report Permission menu

    const reports = [];
    if (rolePermission?.reports?.listing !== false) {
      reports.push({ name: "Report List", path: "/report/list", pro: false });
    }
    if (reports.length > 0) {
      generatedNavItems.push({
        name: "Reports",
        icon: <ListIcon />,
        subItems: reports,
      });
    }
    // Tickets menu
    const ticketsSubItems = [];
    if (rolePermission.tickets?.listing !== false) {
      ticketsSubItems.push({
        name: "Renewal Ticket",
        path: "/ticket/renewal",
        pro: false,
      });
    }
    if (rolePermission.tickets?.create !== false) {
      ticketsSubItems.push({
        name: "Create Ticket",
        path: "/ticket/create",
        pro: false,
      });
    }
    if (rolePermission.tickets?.close !== false) {
      ticketsSubItems.push({
        name: "Close Ticket",
        path: "/ticket/close",
        pro: false,
      });
    }
    if (rolePermission.tickets?.manage !== false) {
      ticketsSubItems.push({
        name: "Manage Ticket",
        path: "/ticket/manage",
        pro: false,
      });
    }
    if (rolePermission.tickets?.all !== false) {
      ticketsSubItems.push({
        name: "All Ticket",
        path: "/ticket/all",
        pro: false,
      });
    }
    if (rolePermission.tickets?.approvel !== false) {
      ticketsSubItems.push({
        name: "Approvel Ticket",
        path: "/ticket/approvel",
        pro: false,
      });
    }
    if (ticketsSubItems.length > 0) {
      generatedNavItems.push({
        name: "Tickets",
        icon: <ListIcon />,
        subItems: ticketsSubItems,
      });
    }
    // Price Book menu (assume permission key "priceBook.listing")
    const priceBookSubItems = [];
    if (rolePermission.priceBook?.listing !== false) {
      priceBookSubItems.push({
        name: "Price Book List",
        path: "/pricebook/list",
        pro: false,
      });
    }
    if (priceBookSubItems.length > 0) {
      generatedNavItems.push({
        name: "Price Book",
        icon: <FileIcon />,
        subItems: priceBookSubItems,
      });
    }
    // Price Book menu (assume permission key "priceBook.listing")
    const configSunItems = [];
    if (rolePermission.configlist?.listing !== false) {
      configSunItems.push({
        name: "Config List",
        path: "/config/list",
        pro: false,
      });
    }
    if (configSunItems.length > 0) {
      generatedNavItems.push({
        name: "Config List",
        icon: <FileIcon />,
        subItems: configSunItems,
      });
    }
    // Setting menu (assume permission keys "setting.jon", "setting.ticketCattogry", "setting.zoneList")
    const settingSubItems = [];
    if (rolePermission.setting?.ticketcategory !== false) {
      settingSubItems.push({
        name: "Ticket Category",
        path: "/setting/ticketcattogry",
        pro: false,
      });
    }
    if (rolePermission.setting?.zonelist !== false) {
      settingSubItems.push({
        name: "Zone List",
        path: "/setting/zonelist",
        pro: false,
      });
    }
    if (rolePermission.setting?.hardwarelist !== false) {
      settingSubItems.push({
        name: "Hardware List",
        path: "/setting/hardwarelist",
        pro: false,
      });
    }
    if (settingSubItems.length > 0) {
      generatedNavItems.push({
        name: "Setting",
        icon: <FileIcon />,
        subItems: settingSubItems,
      });
    }
    setNavItems(generatedNavItems);
    // Others items (CMS, no permission check in provided object)
    setOthersItems([
      {
        icon: <FileIcon />,
        name: "CMS",
        subItems: [{ name: "User CMS", path: "/signin", pro: false }],
      },
    ]);
  }, []);
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );
  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive, navItems, othersItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
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
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
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
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
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
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
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

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
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
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
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
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
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
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
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
