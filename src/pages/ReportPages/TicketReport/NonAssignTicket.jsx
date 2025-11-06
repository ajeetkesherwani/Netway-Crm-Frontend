import React from "react";
import { getNonAssignedTicket } from "../../../service/ticketReport";
import TicketsReportPage from "./TicketReportPage";

export default function NonAssignedTicketReport() {
  return <TicketsReportPage fetcher={getNonAssignedTicket} title="Unassigned Tickets" />;
}