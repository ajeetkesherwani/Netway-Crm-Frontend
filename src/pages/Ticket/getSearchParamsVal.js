import { sub } from "date-fns";

export const getSearchParamsVal = (searchParams) => {
  return {
    page: parseInt(searchParams.get("page") ?? "1"),
    limit: parseInt(searchParams.get("limit") ?? "10"),
    userSearch: searchParams.get("userSearch") ?? "",
    ticketNumber: searchParams.get("ticketNumber") ?? "",
    createdFrom: searchParams.get("fromDate") ?? "",
    createdTo: searchParams.get("toDate") ?? "",
    zoneId: searchParams.get("zoneId") ?? "",
    subZoneId: searchParams.get("subZoneId") ?? "",
    fixedBy: searchParams.get("resolvedBy") ?? "",
    category: searchParams.get("category") ?? "",
    assignTo: searchParams.get("assignTo") ?? "",
    callSource: searchParams.get("callSource") ?? "",
    lcoId: searchParams.get("lcoId") ?? "",
    resellerId: searchParams.get("resellerId") ?? "",
    filter: searchParams.get("status") ?? "",
    fixedBy: searchParams.get("fixedBy") || "",
  };
};
