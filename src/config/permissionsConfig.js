// src/config/permissionsConfig.js
export const permissionsConfig = [
    {
        category: "dashboard",
        label: "Dashboard",
        permissions: ["listing", "create", "edit", "delete", "view", "resellerWise", "lcoWise"]
    },
    {
        category: "users",
        label: "Users",
        permissions: ["listing", "create", "edit", "delete", "view", "approve"],
    },
    {
        category: "staff",
        label: "Staff",
        permissions: ["listing", "create", "edit", "delete", "view"],
    },
    {
        category: "reseller",
        label: "Reseller",
        permissions: [
            "listing",
            "create",
            "edit",
            "delete",
            "view",
            "addTransaction",
            "addEmployee",
            "assignPackage"
        ],
    },
    {
        category: "lco",
        label: "LCO",
        permissions: [
            "listing",
            "create",
            "edit",
            "delete",
            "view",
            "addTransaction",
            "addEmployee",
        ],
    },
    {
        category: "package",
        label: "Package",
        permissions: [
            "listing",
            "create",
            "edit",
            "delete",
            "view",
            "assign",
        ],
    },
    {
        category: "customer",
        label: "Customer",
        permissions: [
            "listing",
            "create",
            "edit",
            "delete",
            "view",

        ],
    },
    {
        category: "rolepermission",
        label: "Role Permission",
        permissions: ["listing", "create", "edit", "delete", "view"],
    },
    {
        category: "tickets",
        label: "Tickets",
        permissions: [
            "listing",
            "create",
            "edit",
            "delete",
            "view",
            "manage",
            "approval",
            "assign"
        ],
    },
    {
        category: "pricebook",
        label: "Pricebook",
        permissions: ["listing", "create", "edit", "delete", "view", "assign"],
    },
    {
        category: "setting",
        label: "Setting",
        permissions: [
            "listing",
            "create",
            "edit",
            "delete",
            "view",
            "ticketCategory",
            "ticketReply",
            "resolution",
            "hardwareList",
            "zoneList",
        ],
    },
    {
        category: "configlist",
        label: "Config List",
        permissions: ["listing", "create", "edit", "delete", "view"],
    },
    {
        category: "invoice",
        label: "Invoice",
        permissions: [
            "listing",
            "create",
            "edit",
            "delete",
            "view",
        ],
    },
    {
        category: "payment",
        label: "Payment",
        permissions: [
            "listing",
            "create",
            "edit",
            "delete",
            "view",
            "success",
            "failed",
        ],
    },
];
