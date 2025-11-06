import React from "react";
import { getAssignedTicket } from "../../../service/ticketReport";
import TicketsReportPage from "./TicketReportPage";

export default function AssignedTicketReport() {
  return <TicketsReportPage fetcher={getAssignedTicket} title="Assigned Tickets" />;
}